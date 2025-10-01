import {Icons} from '@assets';
import {BuyerItem, GenericFlatList, ProgressImage, Text} from '@components';
import {ProductBean} from '@data';
import {CommonStyle, TS, VS} from '@theme';
import {formatCurrency, setField, validField} from '@util';
import _ from 'lodash';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {Styles} from './Styles';
import UserCard from './UserCard';

type Props = {
  bean?: ProductBean;
  relatedPosts?: ProductBean[];
  onPress: (id: string) => void;
  onPressViewAll: () => void;
};

const ProductInfoCard = ({
  bean,
  relatedPosts,
  onPress,
  onPressViewAll,
}: Props) => {
  const {t} = useTranslation('tabNavigator');
  const renderRelatedPosts = useCallback(
    ({item, index}: {item: ProductBean; index: number}) => {
      return (
        <BuyerItem
          key={index}
          productBean={item}
          onPress={() => onPress?.(item.id?.toString() ?? '')}
          containerStyle={[Styles.relatedPostContainer, VS.mt_0, VS.mh_0]}
        />
      );
    },
    [onPress],
  );

  if (!bean) {
    return null;
  }
  const {
    category_name,
    sub_category_name,
    requirment_name,
    roles,
    user_code,
    user_mobile_number,
    user_name,
    user_profile_url,
    country_name,
    state_name,
    city_name,
    other_details,
    main_category_name,
    price,
    main_category_image_url,
  } = bean;

  const rolesName = _.map(roles, el => el.name).join(',');

  return (
    <View
      style={[
        CommonStyle.bgWhiteSmoke,
        VS.br_16,
        VS.mt_32,
        VS.ph_14,
        VS.pt_22,
        VS.mb_10,
        Styles.infoCardContainer,
      ]}>
      <View style={[VS.mb_10]}>
        <View style={[VS.fd_row, VS.ai_start, VS.jc_space_between, VS.gap_10]}>
          <View style={[VS.gap_6, VS.flex_1]}>
            <Text
              fontWeight="semiBold"
              numberOfLines={2}
              style={[TS.fs_15, TS.tt_capitalize, CommonStyle.textPrimary]}>
              {setField(category_name)}
            </Text>
            <Text
              fontWeight="medium"
              style={[TS.fs_13, TS.tt_capitalize, CommonStyle.textPrimary]}>
              {setField(sub_category_name)}
            </Text>
          </View>

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
      </View>
      <View style={[CommonStyle.shadowBox, VS.br_10, VS.gap_10, VS.p_10]}>
        <View style={[VS.ai_center, VS.fd_row, VS.gap_14]}>
          <ProgressImage
            source={{uri: main_category_image_url}}
            mode={'cover'}
            containerStyle={Styles.pioneerImageContainer}
            imageStyle={Styles.pioneerImage}
          />
          <Text
            fontWeight="medium"
            numberOfLines={2}
            style={[TS.fs_14, TS.tt_capitalize, VS.flex_1]}>
            {setField(main_category_name)}
          </Text>
        </View>
      </View>
      <View
        style={[
          CommonStyle.shadowBox,
          VS.fd_row,
          VS.ai_center,
          VS.br_10,
          VS.gap_10,
          VS.p_10,
          VS.mv_10,
        ]}>
        <Icons.Budget />
        <View style={[VS.gap_6, VS.flex_1]}>
          <Text fontWeight="semiBold" style={[TS.fs_12]}>
            {t('budget')}
          </Text>
          <Text fontWeight="bold" style={[TS.fs_19]}>
            {validField(price?.toString())
              ? formatCurrency(parseFloat(price?.toString() ?? ''), 'INR')
              : '-'}
          </Text>
        </View>
      </View>
      <View>
        <Text fontWeight="semiBold" style={[TS.fs_16, CommonStyle.textBlack]}>
          {t('productDetails')}
        </Text>
        <Text style={[TS.fs_13, TS.lh_21]}>{setField(other_details)}</Text>
      </View>
      <View style={[VS.pb_10]}>
        <UserCard
          userMobileCode={user_code}
          userMobileNumber={user_mobile_number}
          userName={user_name}
          userProfileUrl={user_profile_url}
          userRole={setField(rolesName)}
          userAddress={`${city_name}, ${state_name}, ${country_name}`}
        />
      </View>

      {relatedPosts && relatedPosts.length > 0 && (
        <View>
          <View style={[VS.fd_row, VS.mv_18, VS.jc_space_between]}>
            <Text fontWeight="bold" style={[TS.fs_18]}>
              {t('relatedPosts')}
            </Text>
            <TouchableOpacity
              style={[VS.fd_row, VS.ai_center, VS.jc_center]}
              activeOpacity={1}
              onPress={onPressViewAll}>
              <Text
                fontWeight="quickSandSemiBold"
                style={[TS.fs_15, CommonStyle.textPrimary]}>
                {t('viewAll')}
              </Text>
              <Icons.ArrowRight />
            </TouchableOpacity>
          </View>
          <GenericFlatList
            horizontal
            pagingEnabled
            data={relatedPosts}
            renderItem={renderRelatedPosts}
            contentContainerStyle={[VS.gap_14]}
            keyExtractor={(__, index) => index.toString()}
          />
        </View>
      )}
    </View>
  );
};

export default ProductInfoCard;
