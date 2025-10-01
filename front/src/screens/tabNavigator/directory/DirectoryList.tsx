import {
  Container,
  CustomBottomSheet,
  CustomBottomSheetMethods,
  SmartFlatList,
} from '@components';
import {
  BottomNavigationParamStack,
  CategoryBean,
  DirectoryBean,
  RoleBean,
  Selections,
} from '@data';
import {LazyFetcher, usePaginatedList, useUserInfo} from '@hooks';
import {RouteProp} from '@react-navigation/native';
import {
  useGetCategoryQuery,
  useGetRolesQuery,
  useLazyGetDirectoryQuery,
} from '@services';
import {AppStyle, VS} from '@theme';
import {navigate, RequestLimit, safeSplit, transformQueryParam} from '@util';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import TabHeader from '../components/TabHeader';
import DirectoryListItem from './components/DirectoryItem';
import LocationStatusFilter from './components/LocationStatusFilter';
import ProductFilter from './components/ProductFilter';
import SearchInput from './components/SearchInput';
import SupplierType from './components/SupplierType';

export type LocationInfo = {
  city: string;
  isCustom: boolean;
  total: number;
};

type DirectoryListRouteProp = RouteProp<
  BottomNavigationParamStack,
  'DirectoryList'
>;

type RequestTypeParam = {
  role_id?: string | number | undefined;
  city_id?: string | number | undefined;
  search?: string | number | undefined;
  status?: string | number | undefined;
  limit?: string | number | undefined;
  product_id?: string | number | undefined;
  company_id?: string | number | undefined;
  model_id?: string | number | undefined;
  sub_category_id?: string | number | undefined;
  radius?: string | undefined;
  latitude?: string | number | undefined;
  longitude?: string | number | undefined;
};

const DirectoryList: React.FC<{route: DirectoryListRouteProp}> = ({route}) => {
  const selectedSupplier = route?.params && route?.params.selectedSupplier;
  const {t} = useTranslation(['directory']);
  const sheetRef = useRef<CustomBottomSheetMethods | null>(null);
  const statusRef = useRef<CustomBottomSheetMethods | null>(null);
  const userInfo = useUserInfo();

  const {data: productData} = useGetCategoryQuery(
    userInfo?.id?.toString() ?? '',
    {skip: true},
  );

  const [trigger] = useLazyGetDirectoryQuery();

  const [queryParams, setQueryParams] = useState<RequestTypeParam>({
    limit: RequestLimit,
    role_id: selectedSupplier?.id ?? '',
    city_id: userInfo?.city_id ?? '',
  });
  const [selectedProduct, setSelectedProduct] = useState<CategoryBean>({
    id: 0,
    name: 'All',
  });
  const [selectedType, setSelectedType] = useState<RoleBean>(
    selectedSupplier ?? {},
  );

  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    city: userInfo?.city_name || '',
    isCustom: false,
    total: 0,
  });

  const fetchBuyerPosts: LazyFetcher<DirectoryBean> = async param => {
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

  const {data: rolesArray} = useGetRolesQuery();

  const onFilterSelected = useCallback(
    (filters: Selections) => {
      const updatedParams: RequestTypeParam = {...queryParams};
      const setOrRemoveIfPresent = (
        key: keyof RequestTypeParam,
        value: any,
      ) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            updatedParams[key] = value.join(',');
          } else {
            updatedParams[key] = value;
          }
        }
      };
      setOrRemoveIfPresent('sub_category_id', filters.products?.subCategoryIds);
      setOrRemoveIfPresent('product_id', filters.products?.categoryIds);
      setOrRemoveIfPresent('model_id', filters.model);
      setOrRemoveIfPresent(
        'city_id',
        filters.location ? filters.location : userInfo?.city_id,
      );
      setOrRemoveIfPresent('company_id', filters.companies);
      setOrRemoveIfPresent('radius', filters.location_range);
      if (
        filters.location &&
        Array.isArray(filters.location) &&
        filters.location.length > 1
      ) {
        setLocationInfo({
          city: '',
          isCustom: true,
          total: filters.location.length,
        });
      }
      setQueryParams(updatedParams);
    },
    [queryParams, userInfo?.city_id],
  );

  const preSelectedFilters = useMemo(() => {
    return {
      products: {
        categoryIds: safeSplit(queryParams.product_id),
        subCategoryIds: safeSplit(queryParams.sub_category_id),
      },
      companies: safeSplit(queryParams.company_id),
      model: safeSplit(queryParams.model_id),
      location: safeSplit(queryParams.city_id),
      location_range: queryParams.radius,
    };
  }, [queryParams]);

  const renderHeaderComponent = () => {
    return (
      <>
        <SearchInput
          onPerformSearch={(query: string) => {
            setQueryParams(old => ({
              ...old,
              search: query,
            }));
          }}
          preSelectedFilters={preSelectedFilters}
          onFilterSelected={onFilterSelected}
        />
        <LocationStatusFilter
          locationInfo={locationInfo}
          totalResults={controller.meta?.total ?? 0}
          category={selectedType?.name ?? ''}
          isLoading={controller.isLoading || controller.isRefreshing}
          onPressLocation={() => {
            navigate('Location', {
              requestFrom: 'directory',
              type: 'directory',
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

                if (cityInfo.id === 'all') {
                  setLocationInfo({
                    city: 'All Cities',
                    isCustom: true,
                    total: 0,
                  });
                } else {
                  setLocationInfo({
                    city: cityInfo.city_name || '',
                    isCustom: false,
                    total: 0,
                  });
                }
              },
            });
          }}
        />
      </>
    );
  };
  const _renderItem = useCallback(({item}: {item: DirectoryBean}) => {
    return <DirectoryListItem item={item} />;
  }, []);

  return (
    <Container>
      <TabHeader
        title={selectedType?.name ?? ''}
        isSupplier
        isBack
        onSupplier={() => {
          sheetRef?.current?.onPresent();
        }}
      />

      {renderHeaderComponent()}

      <SmartFlatList
        controller={controller}
        renderItem={_renderItem}
        showShimmerWhileRefetching={true}
        emptyComponentLabel={t('noDirectoryFound')}
        contentContainerStyle={[
          VS.gap_15,
          AppStyle.flexGrow,
          VS.pb_20,
          VS.mt_10,
        ]}
        style={[VS.flex_1]}
      />
      <CustomBottomSheet ref={sheetRef}>
        <SupplierType
          onPressItem={(item: RoleBean) => {
            setSelectedType(item);
            setQueryParams(old => ({
              ...old,
              role_id: item.id,
            }));
            setSelectedProduct({
              id: 0,
              name: 'All',
            });
            sheetRef?.current?.onDismiss();
          }}
          selectedType={selectedType}
          supplierData={rolesArray ?? []}
          onClose={() => sheetRef?.current?.onDismiss()}
        />
      </CustomBottomSheet>
      <CustomBottomSheet ref={statusRef}>
        <ProductFilter
          onPressItem={(item: CategoryBean) => {
            setSelectedProduct(item);
            setQueryParams(old => ({
              ...old,
              product_id: item.id,
            }));
            statusRef?.current?.onDismiss();
          }}
          selectedProduct={selectedProduct}
          productData={[{id: 0, name: 'All'}, ...(productData || [])]}
          onClose={() => statusRef?.current?.onDismiss()}
        />
      </CustomBottomSheet>
    </Container>
  );
};
export default DirectoryList;
