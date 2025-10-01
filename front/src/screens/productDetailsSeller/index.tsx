import {Icons} from '@assets';
import {ProductHeader, Text} from '@components';
import {ChatPreview, NavigationParamStack, User} from '@data';
import {useToggleSnackBar, useUserInfo} from '@hooks';
import {RouteProp} from '@react-navigation/native';
import {
  useGetSellerLikePostMutation,
  useLazyGetSellerRequirementDetailQuery,
} from '@services';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
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
const ProductDetailSeller = ({
  route,
}: {
  route: RouteProp<NavigationParamStack, 'ProductDetailSeller'>;
}) => {
  const {t} = useTranslation(['generic']);
  const {toggleMessage} = useToggleSnackBar();

  const {categories_id, id} = route.params || {};
  const {id: userId} = useUserInfo() || {};
  const userInfo = useUserInfo();
  const [getRequirements, {isLoading, data: detailInfo}] =
    useLazyGetSellerRequirementDetailQuery();
  const [togglePostLike] = useGetSellerLikePostMutation();

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

  const toggleLike = useCallback(async () => {
    const res = await togglePostLike(
      transformObject({
        user_id: userId?.toString() ?? '',
        seller_id: lastId?.toString() ?? '',
      }),
    ).unwrap();
    if (res) {
      toggleMessage(res.message);
      if (res.status) {
        fetchRelatedPosts(lastId);
      }
    }
  }, [fetchRelatedPosts, toggleMessage, togglePostLike, userId]);

  const initiateChat = useCallback(async () => {
    const {detailInfo: dInfo} = detailInfo || {};
    const {
      user_id,
      user_name,
      user_mobile_number,
      user_profile_url,
      id: oId,
    } = dInfo || {};
    const sender: User = {
      id: userInfo?.id?.toString() ?? '',
      name: userInfo?.name ?? '',
      phone: userInfo?.mobile_number ?? '',
      avatar: userInfo?.image_url ?? '',
    };

    const receiver: User = {
      id: user_id?.toString() ?? '',
      name: user_name ?? '',
      phone: user_mobile_number ?? '',
      avatar: user_profile_url ?? '',
    };

    const chatItem: ChatPreview = await ChatHelper.createChat(
      oId?.toString() ?? '',
      receiver,
      sender,
    );
    console.log('chatItem', chatItem);
    navigate('ChatDetail', {chatItem});
  }, [
    detailInfo,
    userInfo?.id,
    userInfo?.image_url,
    userInfo?.mobile_number,
    userInfo?.name,
  ]);

  return (
    <View style={[VS.flex_1, CommonStyle.bgWhite]}>
      {isLoading ? (
        <View style={[VS.flex_1, VS.ai_center, VS.jc_center]}>
          <ActivityIndicator size={'large'} color={Colors.primary} />
        </View>
      ) : detailInfo ? (
        <>
          <ScrollView
            style={[VS.flex_1]}
            contentContainerStyle={[
              AppStyle.flexGrow,
              Styles.spaceBottom,
              CommonStyle.bgWhiteSmoke,
            ]}
            showsVerticalScrollIndicator={false}>
            <ProductHeader
              requestType="seller"
              bean={detailInfo?.detailInfo}
              onToggleLike={toggleLike}
            />
            <ProductInfoCard
              bean={detailInfo?.detailInfo}
              relatedPosts={detailInfo.relatedPosts}
              sellerPosts={detailInfo.sellerPosts}
              onPress={pId => {
                fetchRelatedPosts(Number(pId));
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
              activeOpacity={1}
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
              onPress={() => openWhatsApp(detailInfo?.detailInfo!)}
              activeOpacity={1}
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
              onPress={initiateChat}>
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
        </>
      ) : null}
    </View>
  );
};
export default ProductDetailSeller;
