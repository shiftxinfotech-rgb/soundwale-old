import {Icons} from '@assets';
import {
  BuyerItem,
  CommonHeader,
  CommonModal,
  CommonModalRef,
  Container,
  ListPlaceholder,
  SellerListItem,
  SmartShimmerFlatList,
} from '@components';
import {ProductBean} from '@data';
import {useToggleSnackBar} from '@hooks';
import {useIsFocused} from '@react-navigation/native';
import {useDeletePostMutation, useGetRequirementPostsQuery} from '@services';
import {AppStyle, VS} from '@theme';
import {navigate, normalizeApiError} from '@util';
import React, {useCallback, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import Category from './components/Category';
import {Styles} from './Styles';

export default function RequirementPosts() {
  const isFocused = useIsFocused();

  const {t} = useTranslation(['generic']);
  const modalRef = useRef<CommonModalRef>(null);
  const {toggleMessage} = useToggleSnackBar();

  const [deleteRequirement] = useDeletePostMutation();

  const [selectedCategory, setSelectedCategory] = useState<number>(1);

  const {data, isLoading, isFetching, refetch} = useGetRequirementPostsQuery(
    undefined,
    {
      refetchOnFocus: true,
      skip: !isFocused,
      refetchOnMountOrArgChange: true,
    },
  );

  const arrayItems = useMemo(() => {
    if (selectedCategory === 1) {
      return data?.buyerPosts;
    } else {
      return data?.sellerPosts;
    }
  }, [data?.buyerPosts, data?.sellerPosts, selectedCategory]);

  const onSelectCategory = useCallback((id: number) => {
    setSelectedCategory(id);
  }, []);

  const onPostEdit = useCallback((type: string, item: ProductBean) => {
    navigate('AddPost', {type: type, requirementInfo: item});
  }, []);

  const onPostDelete = useCallback(
    async (id: string, type: string) => {
      const formdata = new FormData();
      formdata.append('id', id ?? '');
      formdata.append('type', type ?? '');
      try {
        const result = await deleteRequirement(formdata).unwrap();
        const {status, message} = result;
        toggleMessage(message);
        if (status) {
          refetch();
        }
      } catch (error: unknown) {
        const {message} = normalizeApiError(error);
        if (message) {
          toggleMessage(message);
        } else {
          toggleMessage(t('generic:serverError'));
        }
      }
    },
    [deleteRequirement, refetch, t, toggleMessage],
  );

  const onModalDelete = useCallback(
    (id: string, type: string) => {
      modalRef?.current?.show({
        title: t('generic:deletePost'),
        content: t('generic:areYouSureYouWantToDeleteThisPost'),
        isCancel: true,
        customButton: false,
        onClose: () => {
          onPostDelete(id, type);
        },
      });
    },
    [onPostDelete, t],
  );

  const _renderItem = useCallback(
    ({item, index}: {item: ProductBean; index: number}) => {
      if (selectedCategory === 1) {
        return (
          <BuyerItem
            key={index}
            productBean={item}
            type="myPost"
            onPostEdit={() => onPostEdit('buyer', item)}
            onPostDelete={id => onModalDelete(id, 'buyer')}
          />
        );
      } else {
        return (
          <SellerListItem
            key={index}
            productBean={item}
            type="myPost"
            onPostEdit={() => onPostEdit('seller', item)}
            onPostDelete={id => onModalDelete(id, 'seller')}
          />
        );
      }
    },
    [onModalDelete, onPostEdit, selectedCategory],
  );

  const _renderItemShimmer = useCallback(({index}: {index: number}) => {
    return <ListPlaceholder key={index} />;
  }, []);

  return (
    <Container>
      <CommonHeader withBackArrow title={t('generic:myPosts')} />
      <Category
        onPress={onSelectCategory}
        selectedCategory={selectedCategory}
      />
      <SmartShimmerFlatList
        data={arrayItems ?? []}
        isLoading={isLoading}
        isRefetching={isFetching}
        showShimmerWhileRefetching={true}
        isFetchingMore={false}
        hasMore={false}
        renderItem={_renderItem}
        renderShimmerItem={_renderItemShimmer}
        onRefresh={refetch}
        emptyComponentLabel={t('generic:noPostFound')}
        contentContainerStyle={[VS.gap_15, AppStyle.flexGrow]}
        style={[VS.flex_1, VS.mt_20]}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={[Styles.addButtonContainer]}
        onPress={() => {
          if (selectedCategory === 1) {
            navigate('AddPost', {
              type: 'buyer',
              onGoBack: () => {
                refetch();
              },
            });
          } else if (selectedCategory === 2) {
            navigate('AddPost', {
              type: 'seller',
              onGoBack: () => {
                refetch();
              },
            });
          }
        }}>
        <Icons.CirclePlus />
      </TouchableOpacity>
      <CommonModal ref={modalRef} />
    </Container>
  );
}
