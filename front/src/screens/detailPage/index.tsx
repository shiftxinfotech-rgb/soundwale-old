import {Icons} from '@assets';
import {ProductHeader, Text} from '@components';
import {ChatPreview, NavigationParamStack, User} from '@data';
import {useToggleSnackBar, useUserInfo} from '@hooks';
import {
  NavigationProp,
  RouteProp,
  StackActions,
  useNavigation,
} from '@react-navigation/native';
import {
  useGetBuyerLikePostMutation,
  useLazyGetBuyerRequirementDetailQuery,
} from '@services';
import {Colors, CommonStyle, TS, VS} from '@theme';
import {ChatHelper, navigate, openWhatsApp, transformObject} from '@util';
import React, {useCallback, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductInfoCard from './components/ProductInfoCard';
import {Styles} from './Styles';

let lastId: number | undefined;
const ProductDetailScreen = ({
  route,
}: {
  route: RouteProp<NavigationParamStack, 'ProductDetail'>;
}) => {
  const {t} = useTranslation('tabNavigator');
  const {toggleMessage} = useToggleSnackBar();
  const {dispatch} = useNavigation<NavigationProp<NavigationParamStack>>();
  const {categories_id, id} = route.params || {};
  const {id: userId} = useUserInfo() || {};
  const userInfo = useUserInfo();
  const [getRequirements, {isLoading, data: detailInfo}] =
    useLazyGetBuyerRequirementDetailQuery();
  const [togglePostLike] = useGetBuyerLikePostMutation();

  const fetchRelatedPosts = useCallback(
    async (postId: number | undefined) => {
      lastId = postId;
      await getRequirements({
        id: postId?.toString() ?? '',
        categories_id: categories_id?.toString() ?? '',
        limit: 5,
      });
    },
    [getRequirements, categories_id],
  );

  useEffect(() => {
    fetchRelatedPosts(id);
  }, [fetchRelatedPosts, id]);

  const onInitiateChat = useCallback(async () => {
    const sender: User = {
      id: userInfo?.id?.toString() ?? '',
      name: userInfo?.name ?? '',
      phone: userInfo?.mobile_number ?? '',
      avatar: userInfo?.image_url ?? '',
    };

    const receiver: User = {
      id: detailInfo?.detailInfo?.user_id?.toString() ?? '',
      name: detailInfo?.detailInfo?.user_name ?? '',
      phone: detailInfo?.detailInfo?.user_mobile_number ?? '',
      avatar: detailInfo?.detailInfo?.user_profile_url ?? '',
    };

    const chatItem: ChatPreview = await ChatHelper.createChat(
      detailInfo?.detailInfo?.id?.toString() ?? '',
      receiver,
      sender,
    );
    navigate('ChatDetail', {chatItem});
  }, [
    userInfo,
    detailInfo?.detailInfo?.id,
    detailInfo?.detailInfo?.user_id,
    detailInfo?.detailInfo?.user_mobile_number,
    detailInfo?.detailInfo?.user_name,
    detailInfo?.detailInfo?.user_profile_url,
  ]);

  const toggleLike = useCallback(async () => {
    const res = await togglePostLike(
      transformObject({
        user_id: userId?.toString() ?? '',
        buyer_id: lastId?.toString() ?? '',
      }),
    ).unwrap();
    if (res) {
      toggleMessage(res.message);
      if (res.status) {
        fetchRelatedPosts(lastId);
      }
    }
  }, [fetchRelatedPosts, toggleMessage, togglePostLike, userId]);

  return (
    <View style={[VS.flex_1, CommonStyle.bgWhite]}>
      {isLoading ? (
        <View style={[VS.flex_1, VS.ai_center, VS.jc_center]}>
          <ActivityIndicator size={'large'} color={Colors.primary} />
        </View>
      ) : detailInfo ? (
        <>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ProductHeader
              requestType="buyer"
              bean={detailInfo?.detailInfo}
              onToggleLike={toggleLike}
              categories_id={categories_id?.toString() ?? ''}
            />
            <ProductInfoCard
              bean={detailInfo?.detailInfo}
              relatedPosts={detailInfo.relatedPosts}
              onPress={pId => fetchRelatedPosts(Number(pId))}
              onPressViewAll={() => {
                dispatch(
                  StackActions.replace('RelatedPosts', {
                    categories_id: categories_id,
                    id: id,
                  }),
                );
              }}
            />
          </ScrollView>
          <View
            style={[
              VS.ph_16,
              VS.pv_14,
              VS.fd_row,
              VS.ai_center,
              VS.jc_center,
              CommonStyle.bgPrimary,
            ]}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `tel:${detailInfo?.detailInfo?.user_mobile_number}`,
                )
              }
              style={[
                VS.fd_row,
                VS.ai_center,
                VS.gap_9,
                VS.flex_1,
                VS.jc_center,
              ]}>
              <Icons.CallNow />
              <Text
                fontWeight="quickSandSemiBold"
                style={[TS.fs_16, TS.lh_20, CommonStyle.textWhite]}>
                {t('callNow')}
              </Text>
            </TouchableOpacity>
            <View style={[Styles.divider, CommonStyle.bgWhite]} />
            <TouchableOpacity
              onPress={() => {
                openWhatsApp(detailInfo?.detailInfo!);
              }}
              style={[
                VS.fd_row,
                VS.ai_center,
                VS.gap_9,
                VS.flex_1,
                VS.jc_center,
              ]}>
              <Icons.Whatsapp />
              <Text
                fontWeight="quickSandSemiBold"
                style={[TS.fs_16, TS.lh_20, CommonStyle.textWhite]}>
                {t('whatsapp')}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
      {detailInfo && userInfo?.id !== detailInfo?.detailInfo?.user_id && (
        <TouchableOpacity
          style={[
            Styles.addButtonContainer,
            Styles.roundBorder,
            VS.ai_center,
            VS.as_center,
            VS.jc_center,
          ]}
          activeOpacity={1}
          onPress={onInitiateChat}>
          <View
            style={[
              CommonStyle.bgPrimary,
              Styles.roundBorder,
              Styles.messageContainer,
              VS.ai_center,
              VS.as_center,
              VS.jc_center,
            ]}>
            <Icons.Message size={28} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};
export default ProductDetailScreen;
