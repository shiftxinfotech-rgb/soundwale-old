import {
  BuyerItem,
  CommonHeader,
  Container,
  SellerListItem,
  SmartFlatList,
} from '@components';
import {FavTypes, ProductBean} from '@data';
import {LazyFetcher, usePaginatedList} from '@hooks';
import {useLazyGetFavPostsQuery} from '@services';
import {AppStyle, VS} from '@theme';
import {RequestLimit, transformQueryParam} from '@util';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Category from './components/Category';

type RequestTypeParam = {
  type?: FavTypes;
  limit: string;
};

export default function Favorite() {
  const {t} = useTranslation(['generic']);

  const [trigger] = useLazyGetFavPostsQuery();

  const [queryParams, setQueryParams] = useState<RequestTypeParam>({
    limit: String(RequestLimit),
    type: 'buyer',
  });

  const fetchFavoritePosts: LazyFetcher<ProductBean> = async param => {
    const formData = transformQueryParam(param);
    const result = await trigger(formData, false);
    if (result?.status === 'rejected') {
      throw result.error || new Error('API fetch failed');
    }
    const responseData = result.data?.data?.data ?? [];
    const meta = result.data?.data?.meta;
    return {
      data: responseData,
      meta,
    };
  };

  const controller = usePaginatedList(fetchFavoritePosts, {
    extraParams: queryParams,
    debounceDelay: 300,
    refreshOnFocus: true,
  });

  console.log('controller', controller.data);

  const onSelectCategory = useCallback(async (id: FavTypes) => {
    setQueryParams({
      limit: String(RequestLimit),
      type: id,
    });
  }, []);

  const _renderItem = useCallback(
    ({item, index}: {item: ProductBean; index: number}) => {
      if (queryParams.type === 'buyer') {
        return <BuyerItem key={index} productBean={item} />;
      } else {
        return <SellerListItem key={index} productBean={item} />;
      }
    },
    [queryParams.type],
  );

  return (
    <Container>
      <CommonHeader
        withBackArrow
        title="Favorite / Wishlist"
        withChatNotification={false}
      />
      <Category
        onPress={onSelectCategory}
        selectedCategory={queryParams.type}
      />
      <SmartFlatList
        controller={controller}
        renderItem={_renderItem}
        showShimmerWhileRefetching={true}
        emptyComponentLabel={t('noDataFound')}
        contentContainerStyle={[VS.gap_15, AppStyle.flexGrow]}
        style={[VS.flex_1, VS.mt_20]}
      />
    </Container>
  );
}
