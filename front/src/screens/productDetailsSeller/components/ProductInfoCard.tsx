import {Icons} from '@assets';
import {
  GenericFlatList,
  NoData,
  ProgressImage,
  SellerListItem,
  TabTitleItem,
  Text,
} from '@components';
import {ProductBean} from '@data';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {formatCurrency, setField, validField} from '@util';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {Styles} from './Styles';
import UserCard from './UserCard';
import {useTranslation} from 'react-i18next';

type Props = {
  bean?: ProductBean;
  relatedPosts?: ProductBean[];
  sellerPosts?: ProductBean[];
  onPress: (id: string) => void;
};

const ProductInfoCard = ({onPress, bean, relatedPosts, sellerPosts}: Props) => {
  const {t} = useTranslation(['generic']);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [roleIndex, setRoleIndex] = useState(0);

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
    review_avg_rating,
    review_count,
    other_details,
    main_category_image_url,
    main_category_name,
    price,
  } = bean || {};

  const roleArray = useMemo(() => roles ?? [], [roles]);

  useEffect(() => {
    if (roleArray.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setRoleIndex(prev => (prev + 1) % roleArray.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [roleArray.length]);

  const currentRole = useMemo(
    () => roleArray[roleIndex],
    [roleArray, roleIndex],
  );

  const renderSellerPosts = useCallback(
    ({item, index}: {item: ProductBean; index: number}) => {
      return (
        <SellerListItem
          key={index}
          parentStyle={[Styles.cardWidth, VS.mh_0]}
          productBean={item}
          onPress={() => onPress(item.id?.toString() ?? '')}
        />
      );
    },
    [onPress],
  );

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
      <View style={[VS.mb_5]}>
        <View style={[VS.fd_row, VS.ai_start, VS.jc_space_between]}>
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
        {validField(review_avg_rating) && (
          <View
            style={[
              Styles.ratingContainer,
              VS.ph_15,
              VS.pv_5,
              VS.fd_row,
              VS.ai_center,
              VS.gap_5,
              VS.jc_center,
              {width: '25%'},
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

        <View
          style={[
            CommonStyle.shadowBox,
            VS.br_10,
            VS.gap_10,
            VS.p_10,
            VS.mt_10,
          ]}>
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
      </View>

      <View>
        <Text fontWeight="semiBold" style={[TS.fs_16, CommonStyle.textBlack]}>
          {t('productDetails')}
        </Text>
        <Text style={[TS.fs_13, TS.lh_21]}>{setField(other_details)}</Text>
      </View>

      <UserCard
        userMobileCode={user_code}
        userMobileNumber={user_mobile_number}
        userName={user_name}
        userRole={setField(currentRole.name?.toLowerCase())}
        userProfileUrl={user_profile_url}
        userAddress={`${city_name}, ${state_name}, ${country_name}`}
        onPress={() => {}}
      />

      <View>
        <ScrollView
          horizontal
          style={[VS.mt_30, VS.mb_20]}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[VS.gap_10, VS.ai_center, VS.jc_center]}>
          <TabTitleItem
            title={`${t('postBy')} ${setField(user_name)}`}
            isSelected={selectedTab === 0}
            onPress={() => setSelectedTab(0)}
          />
          <TabTitleItem
            title={t('relatedPosts')}
            isSelected={selectedTab === 1}
            onPress={() => setSelectedTab(1)}
          />
        </ScrollView>
        <GenericFlatList
          horizontal
          pagingEnabled
          data={selectedTab === 0 ? sellerPosts : relatedPosts}
          renderItem={renderSellerPosts}
          contentContainerStyle={[VS.gap_14, AppStyle.flexGrow]}
          ListEmptyComponent={
            <View style={[VS.ai_center, VS.jc_center, VS.flex_1]}>
              <NoData message={t('noPostFound')} />
            </View>
          }
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default ProductInfoCard;
