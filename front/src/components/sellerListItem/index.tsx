import {Icons} from '@assets';
import {Text, ViewMore} from '@components';
import {NavigationParamStack, ProductBean} from '@data';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {
  fetchStyles,
  formatCurrency,
  getUserLocation,
  setField,
  validField,
} from '@util';
import moment from 'moment';
import React, {useCallback} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import PostEditDelete from '../PostEditDelete';
import UserInfo from '../UserInfo';
import {Styles} from './Styles';

type SellerListItemProps = {
  type?: string;
  userInfo?: boolean;
  productBean: ProductBean;
  parentStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onPostEdit?: (id: string) => void;
  onPostDelete?: (id: string) => void;
};
function SellerListItem({
  parentStyle,
  productBean,
  onPress,
  containerStyle,
  type,
  onPostEdit,
  onPostDelete,
}: SellerListItemProps) {
  const {navigate} = useNavigation<NavigationProp<NavigationParamStack>>();
  const {
    user_code,
    user_mobile_number,
    user_name,
    user_profile_url,
    roles,
    view_counter,
    main_category_name,
    category_name,
    sub_category_name,
    review_avg_rating,
    review_count,
    price,
    requirment_name,
    city_name,
    state_name,
    id,
    categories_id,
    created_at,
    other_details,
    country_name,
  } = productBean || {};

  const containerStyles = fetchStyles(containerStyle);

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      navigate('ProductDetailSeller', {categories_id, id});
    }
  }, [onPress, navigate, categories_id, id]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handlePress}
      style={[
        VS.br_10,
        VS.mh_15,
        VS.mt_10,
        VS.bw_1,
        CommonStyle.bgLightPrimary,
        AppStyle.hideOverFlow,
        containerStyles,
        CommonStyle.shadowBox,
        CommonStyle.borderVeryLightGray,
        parentStyle,
      ]}>
      <View style={[VS.flex_1, VS.mt_11, VS.ph_10, VS.br_12, VS.gap_6]}>
        <View style={[VS.fd_row, VS.ai_center, VS.jc_space_between, VS.gap_6]}>
          <Text
            fontWeight={'bold'}
            style={[
              TS.fs_18,
              TS.ta_left,
              TS.tav_center,
              TS.tt_capitalize,
              CommonStyle.textBlack,
              VS.flex_1,
            ]}>
            {setField(main_category_name)}
          </Text>

          <View
            style={[
              Styles.statusContainer,
              requirment_name === 'New'
                ? CommonStyle.bgStatusNew
                : CommonStyle.bgStatusOld,
              VS.ph_15,
              VS.pv_3,
            ]}>
            <Text
              fontWeight={'quickSandSemiBold'}
              style={[
                TS.fs_14,
                TS.ta_center,
                TS.tav_center,
                TS.lh_19,
                CommonStyle.textWhite,
              ]}>
              {setField(requirment_name)}
            </Text>
          </View>
        </View>
        <View style={[VS.gap_6, VS.fd_row]}>
          <View style={[VS.flex_1, VS.gap_6, VS.as_start, VS.ai_start]}>
            <Text
              fontWeight={'medium'}
              numberOfLines={1}
              style={[
                TS.fs_14,
                TS.ta_left,
                TS.tav_center,
                TS.tt_capitalize,
                CommonStyle.textDimGray,
              ]}>
              {setField(category_name)}
            </Text>
            <Text
              fontWeight={'medium'}
              numberOfLines={1}
              style={[
                TS.fs_14,
                TS.ta_left,
                TS.tav_center,
                TS.tt_capitalize,
                CommonStyle.textDimGray,
              ]}>
              {setField(sub_category_name)}
            </Text>
          </View>
          {view_counter && view_counter > 0 ? (
            <View style={[VS.ph_7, VS.pv_5, VS.fd_row, VS.ai_center, VS.gap_5]}>
              <Icons.Eye color={Colors.dimGray} />
              <Text
                fontWeight={'semiBold'}
                style={[
                  TS.fs_13,
                  CommonStyle.textDimGray,
                  TS.lh_17,
                  TS.ta_center,
                ]}>
                {setField(view_counter?.toString())}
              </Text>
            </View>
          ) : null}
        </View>
        <View style={[VS.fd_row, VS.ai_center, VS.gap_5, VS.jc_space_between]}>
          <Text
            fontWeight="medium"
            style={[TS.fs_15, TS.pt_3, CommonStyle.textDimGray]}>
            {validField(price?.toString())
              ? formatCurrency(parseFloat(price?.toString() ?? ''), 'INR')
              : '-'}
          </Text>
          <View
            style={[VS.fd_row, VS.ai_center, VS.as_end, VS.jc_space_between]}>
            <View
              style={[
                VS.flex_1,
                VS.as_start,
                VS.ai_start,
                VS.jc_center,
                VS.gap_6,
              ]}>
              {validField(review_avg_rating) && (
                <View
                  style={[
                    Styles.ratingContainer,
                    VS.ph_15,
                    VS.pv_5,
                    VS.fd_row,
                    VS.ai_center,
                    VS.gap_5,
                  ]}>
                  <Icons.Star size={15} color={Colors.amber} />
                  <Text
                    fontWeight={'quickSandSemiBold'}
                    style={[
                      TS.fs_15,
                      TS.ta_center,
                      TS.tav_center,
                      TS.tt_capitalize,
                      CommonStyle.textAmber,
                    ]}>
                    {`${parseInt(review_avg_rating ?? '', 10).toFixed(
                      1,
                    )} (${review_count})`}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {other_details && (
          <ViewMore
            textStyle={[TS.fs_13, CommonStyle.textDimGray, TS.ta_justify]}
            child={
              <Text
                fontWeight={'medium'}
                style={[TS.fs_13, CommonStyle.textDimGray, TS.ta_justify]}>
                {setField(other_details)}
              </Text>
            }
          />
        )}
        <Text
          fontWeight={'quickSandMedium'}
          style={[TS.fs_14, TS.pb_10, TS.pt_3, CommonStyle.textDimGray]}>
          {moment(created_at ?? '').fromNow()}
        </Text>
      </View>
      {type === 'myPost' ? (
        <PostEditDelete
          onEdit={() => onPostEdit?.(id?.toString() ?? '')}
          onDelete={() => onPostDelete?.(id?.toString() ?? '')}
        />
      ) : (
        <>
          <UserInfo
            userMobileCode={user_code}
            userMobileNumber={user_mobile_number}
            userName={user_name}
            userLocation={getUserLocation(city_name, state_name, country_name)}
            roles={roles}
            userProfileUrl={user_profile_url}
          />
        </>
      )}
    </TouchableOpacity>
  );
}
export default React.memo(SellerListItem);
