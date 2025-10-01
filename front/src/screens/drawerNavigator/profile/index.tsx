import {Images} from '@assets';
import {NavigationParamStack, ShopImage} from '@data';
import {useToggleSnackBar, useUserInfo} from '@hooks';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {
  useBusinessShopRemoveMutation,
  useLazyGetDealerCompanyQuery,
  useLazyGetProfileQuery,
} from '@services';
import {AppStyle, CommonStyle, VS} from '@theme';
import {ChatHelper, normalizeApiError} from '@util';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image, ScrollView, View} from 'react-native';
import {BusinessProfileSection} from './components/BusinessProfileSection';
import {ProfileHeader} from './components/ProfileHeader';
import {Styles} from './Styles';

export default function ProfileScreen() {
  const {t} = useTranslation('generic');
  const userDetail = useUserInfo();
  const {toggleMessage} = useToggleSnackBar();
  const {addListener} = useNavigation<NavigationProp<NavigationParamStack>>();

  const [removeShopImage] = useBusinessShopRemoveMutation();
  const [getProfile] = useLazyGetProfileQuery();
  const [getDealerCompany, {data: dealerCompany}] =
    useLazyGetDealerCompanyQuery();
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [shopImages, setShopImages] = useState<ShopImage[]>([]);

  useEffect(() => {
    const listener = addListener('focus', () => {
      getProfile(userDetail?.id?.toString() ?? '')
        .unwrap()
        .then(res => {
          if (res.status) {
            ChatHelper.createUserProfile(res.user);
          }
        });
      getDealerCompany(userDetail?.id?.toString() ?? '');
    });
    return () => listener();
  }, [addListener, getDealerCompany, getProfile, userDetail?.id]);

  useEffect(() => {
    if (userDetail !== undefined && userDetail !== null) {
      if (
        dealerCompany &&
        dealerCompany.length > 0 &&
        userDetail?.business_data?.length !== 0
      ) {
        if (
          userDetail?.business_data &&
          userDetail?.business_data[0]?.companies_id !== null
        ) {
          const selected_Companies = dealerCompany.filter(
            company =>
              userDetail?.business_data &&
              userDetail?.business_data[0]?.companies_id
                ?.split(',')
                .includes(String(company.id)),
          );
          if (selected_Companies.length > 0) {
            setSelectedCompanies(
              selected_Companies.map(company => String(company.value)),
            );
          }
        }
      }

      if (userDetail?.business_shop_images_data?.length !== 0) {
        setShopImages(userDetail?.business_shop_images_data ?? []);
      }
    }
  }, [dealerCompany, userDetail]);

  const onRemoveShop = useCallback(
    async (id: number) => {
      try {
        const formdata = new FormData();
        formdata.append('id', id ?? '');
        const result = await removeShopImage(formdata).unwrap();
        const {status, message} = result;
        if (status) {
          setShopImages(o => o.filter(image => image.id !== id));
          getProfile(userDetail?.id?.toString() ?? '');
        } else {
          toggleMessage(message);
        }
      } catch (error: unknown) {
        const {message} = normalizeApiError(error);
        if (message) {
          toggleMessage(message);
        } else {
          toggleMessage(t('serverError'));
        }
      }
    },
    [getProfile, removeShopImage, t, toggleMessage, userDetail?.id],
  );

  return (
    <View style={[VS.flex_1, CommonStyle.bgPrimary]}>
      <Image source={Images.filterTopMask} style={Styles.absoluteTopRight} />
      <ScrollView
        contentContainerStyle={[
          CommonStyle.safeAreaSpaceTop,
          AppStyle.flexGrow,
        ]}
        alwaysBounceVertical={false}
        showsVerticalScrollIndicator={false}>
        <ProfileHeader profileData={userDetail} />
        <View
          style={[
            Styles.infoContainer,
            CommonStyle.bgWhite,
            VS.flex_1,
            VS.mt_13,
            VS.pv_21,
            VS.ph_16,
          ]}>
          <BusinessProfileSection
            profileData={userDetail || null}
            selectedCompanies={selectedCompanies}
            onRemoveShop={(id: number) => onRemoveShop(id)}
            shopImages={shopImages}
          />
        </View>
      </ScrollView>
    </View>
  );
}
