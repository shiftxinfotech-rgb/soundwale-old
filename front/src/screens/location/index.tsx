import {CommonHeader, Container, SmartShimmerFlatList} from '@components';
import {CityBean, NavigationParamStack} from '@data';
import {useToggleSnackBar} from '@hooks';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useLazyGetFilterDataQuery} from '@services';
import {AppStyle, VS} from '@theme';
import {
  enableLocationServices,
  getAddressFromCoordinates,
  getCurrentLocation,
  requestLocationPermission,
} from '@util';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import LocationItem from './components/LocationItem';
import LocationItemShimmer from './components/LocationItemShimmer';
import SearchCurrentLocation from './components/SearchCurrentLocation';

let filteredCities: CityBean[] | undefined = [];
type RouteProps = RouteProp<NavigationParamStack, 'Location'>;

export default function Location() {
  const {t} = useTranslation('generic');
  const {toggleMessage} = useToggleSnackBar();
  const {goBack, addListener} =
    useNavigation<NavigationProp<NavigationParamStack>>();
  const {requestFrom, onGoBack, type} = useRoute<RouteProps>().params;
  const [searchTerms, setSearchTerms] = useState('');
  const [getFilters, {isFetching, isLoading, data: filterData}] =
    useLazyGetFilterDataQuery();

  const [selectedLocation, setSelectedLocation] = useState(-1);

  const selectLocationAndGoBack = useCallback(
    (city: CityBean, index: number) => {
      setSelectedLocation(index);
      goBack();
      onGoBack?.({id: city.id, city_name: city.city_name});
    },
    [onGoBack, goBack],
  );

  const validateLocationPermission = useCallback(async () => {
    try {
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      const isLocationEnabled = await enableLocationServices();
      if (!isLocationEnabled) {
        return;
      }
      const location = await getCurrentLocation();
      const results = await getAddressFromCoordinates(location);
      if (results !== undefined && results !== null) {
        const cityComponent = results.address_components.find(
          comp =>
            comp.types.includes('locality') && comp.types.includes('political'),
        );
        goBack();
        onGoBack?.({
          latitude: location.latitude,
          longitude: location.longitude,
          city_name: cityComponent?.long_name ?? '',
        });
      } else {
        toggleMessage(t('errorGettingCurrentLocation'));
      }
    } catch (error) {
      toggleMessage(t('errorGettingCurrentLocation'));
    }
  }, [goBack, onGoBack, t, toggleMessage]);

  useEffect(() => {
    const unsubscribe = addListener('focus', () => {
      getFilters(`type=${type}`);
    });
    return () => unsubscribe();
  }, [addListener, getFilters, type]);

  const _renderLocationItem = useCallback(
    ({item, index}: {item: CityBean; index: number}) => {
      return (
        <LocationItem
          key={index}
          onPressItem={() => selectLocationAndGoBack(item, index)}
          item={item.city_name ?? ''}
          selectedLocation={selectedLocation === index}
        />
      );
    },
    [selectLocationAndGoBack, selectedLocation],
  );

  const _renderItemShimmer = useCallback(({index}: {index: number}) => {
    return <LocationItemShimmer key={index} />;
  }, []);

  return (
    <Container>
      <CommonHeader
        title={t('location')}
        withBackArrow
        withChatNotification={false}
        onPressBack={() => {
          if (requestFrom === 'buyer' || requestFrom === 'directory') {
            if (selectedLocation !== -1) {
              const city = filterData?.city?.[selectedLocation];
              selectLocationAndGoBack(city!, selectedLocation);
            } else {
              goBack();
            }
          } else {
            goBack();
          }
        }}
      />
      <SearchCurrentLocation
        onChangeText={text => {
          filteredCities = filterData?.city?.filter(city =>
            city?.city_name?.toLowerCase().includes(text.toLowerCase()),
          );
          setSearchTerms(text);
        }}
        onPressCurrentLocation={validateLocationPermission}
      />
      <SmartShimmerFlatList
        data={
          searchTerms !== '' ? filteredCities ?? [] : filterData?.city ?? []
        }
        isLoading={isLoading}
        isRefetching={isFetching}
        showShimmerWhileRefetching={true}
        isFetchingMore={false}
        hasMore={false}
        renderItem={_renderLocationItem}
        renderShimmerItem={_renderItemShimmer}
        contentContainerStyle={[AppStyle.flexGrow]}
        style={[VS.flex_1]}
      />
    </Container>
  );
}
