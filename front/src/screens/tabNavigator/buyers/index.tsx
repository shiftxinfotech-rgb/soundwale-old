import {Icons} from '@assets';
import {BuyerItem, Container, SmartFlatList} from '@components';
import type {BuyersProps} from '@data';
import {ProductBean, Selections} from '@data';
import {LazyFetcher, usePaginatedList, useUserInfo} from '@hooks';
import {
  useGetFilterDataQuery,
  useLazyGetBuyerRequirementsQuery,
} from '@services';
import {AppStyle, VS} from '@theme';
import {navigate, RequestLimit, safeSplit, transformQueryParam} from '@util';
import {debounce} from 'lodash';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import LocationWidget from '../components/LocationWidget';
import ProductTypeFilter from '../components/ProductTypeFilter';
import SearchInputWithFilter from '../components/SearchInputWithFilter';
import TabHeader from '../components/TabHeader';
import {Styles} from './Styles';

type RequestTypeParam = {
  categories_id?: string;
  category_id?: string;
  sub_category_id?: string;
  city_id?: string;
  requirment_id?: string;
  price?: string;
  search?: string;
  limit?: string;
};

export default function Buyers({navigation}: BuyersProps) {
  const {t} = useTranslation(['tabNavigator']);
  const userInfo = useUserInfo();
  const {data: filterData, refetch: refetchFilterData} = useGetFilterDataQuery(
    `type=buyer&user_id=${userInfo?.id}`,
    {
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
    },
  );
  const [currentCity, setCurrentCity] = useState<string>(
    userInfo?.city_name || '',
  );
  const [selectedType, setSelectType] = useState(0);
  const [query, setQuery] = useState('');
  const [queryParams, setQueryParams] = useState<RequestTypeParam>({
    limit: String(RequestLimit),
    city_id: userInfo?.city_id ? String(userInfo.city_id) : '',
  });

  const [trigger] = useLazyGetBuyerRequirementsQuery();

  const fetchBuyerPosts: LazyFetcher<ProductBean> = async param => {
    const formData = transformQueryParam(param);
    const result = await trigger(formData, false);
    return {
      data: result.data?.data?.data ?? [],
      meta: result.data?.data?.meta,
    };
  };

  const controller = usePaginatedList(fetchBuyerPosts, {
    extraParams: queryParams,
    debounceDelay: 300,
    refreshOnFocus: false,
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      setQueryParams({
        limit: String(RequestLimit),
        city_id: userInfo?.city_id ? String(userInfo.city_id) : '',
      });
      setSelectType(0);
      setCurrentCity(userInfo?.city_name || '');
      setQuery('');
      refetchFilterData();
    });
    return unsubscribe;
  }, [navigation, userInfo?.city_id, userInfo?.city_name, refetchFilterData]);

  const preSelectedFilters = useMemo(() => {
    return {
      products: {
        categoryIds: safeSplit(queryParams.category_id),
        subCategoryIds: safeSplit(queryParams.sub_category_id),
      },
      companies: safeSplit(queryParams.categories_id),
      location: safeSplit(queryParams.city_id),
      product_type: queryParams.requirment_id
        ? queryParams.requirment_id.toString()
        : '',
      budget_range: safeSplit(queryParams.price),
    };
  }, [queryParams]);

  const onFilterSelected = (filters: Selections) => {
    const updatedParams: RequestTypeParam = {...queryParams};
    const setOrRemoveIfPresent = (key: keyof RequestTypeParam, value: any) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          updatedParams[key] = value.join(',');
        } else {
          updatedParams[key] = value;
        }
      }
    };

    setOrRemoveIfPresent('category_id', filters.products?.categoryIds);
    setOrRemoveIfPresent('sub_category_id', filters.products?.subCategoryIds);
    setOrRemoveIfPresent('requirment_id', filters.product_type);
    setOrRemoveIfPresent(
      'city_id',
      filters.location ? filters.location : userInfo?.city_id,
    );
    setOrRemoveIfPresent('categories_id', filters.companies);
    setOrRemoveIfPresent('price', filters.budget_range);

    setQueryParams(updatedParams);
  };

  const onSearch = useCallback((content: string) => {
    setQueryParams(old => ({
      ...old,
      search: content,
    }));
  }, []);

  const debouncedSearch = useMemo(() => debounce(onSearch, 500), [onSearch]);

  const onChangeText = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const _renderItem = useCallback(
    ({item, index}: {item: ProductBean; index: number}) => {
      return <BuyerItem key={index} productBean={item} />;
    },
    [],
  );

  const renderHeaderComponent = () => {
    return (
      <>
        <SearchInputWithFilter
          screenFrom="buyer"
          searchInput={query}
          onSearch={onChangeText}
          preSelectedFilters={preSelectedFilters}
          onFilterSelected={onFilterSelected}
        />
        {filterData?.requirement_type &&
          filterData?.requirement_type.length > 0 && (
            <ProductTypeFilter
              productTypeData={filterData?.requirement_type ?? []}
              selectedType={selectedType}
              onSelect={(id: string) => {
                setSelectType(parseInt(id, 10) ?? 0);
                setQueryParams(old => ({
                  ...old,
                  requirment_id: id,
                }));
              }}
            />
          )}
      </>
    );
  };

  return (
    <Container>
      <TabHeader
        title={t('buyers')}
        onPressHamburger={() => {}}
        onPressChat={() => {}}
        onPressNotification={() => {}}
        titleWidget={
          <LocationWidget
            currentCity={currentCity}
            onPress={() => {
              navigate('Location', {
                requestFrom: 'buyer',
                type: 'buyer',
                onGoBack: (cityInfo: {
                  id: string | number;
                  city_name?: string;
                  latitude?: number;
                  longitude?: number;
                }) => {
                  if (cityInfo.latitude && cityInfo.longitude) {
                    setQueryParams(old => ({
                      ...old,
                      latitude: cityInfo.latitude,
                      longitude: cityInfo.longitude,
                      city_id: undefined,
                    }));
                  } else {
                    setQueryParams(old => ({
                      ...old,
                      latitude: undefined,
                      longitude: undefined,
                      city_id: cityInfo.id ? String(cityInfo.id) : '',
                    }));
                  }
                  setCurrentCity(cityInfo.city_name || '');
                },
              });
            }}
          />
        }
      />

      {renderHeaderComponent()}

      <SmartFlatList
        controller={controller}
        renderItem={_renderItem}
        showShimmerWhileRefetching={true}
        emptyComponentLabel={t('noBuyerFound')}
        contentContainerStyle={[
          VS.gap_15,
          AppStyle.flexGrow,
          Styles.spaceBottom,
        ]}
        style={[VS.flex_1]}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={[Styles.addButtonContainer]}
        onPress={() =>
          navigate('AddPost', {
            type: 'buyer',
            onGoBack: () => {
              controller.refresh();
            },
          })
        }>
        <Icons.CirclePlus />
      </TouchableOpacity>
    </Container>
  );
}
