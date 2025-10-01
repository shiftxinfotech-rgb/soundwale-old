import {Icons} from '@assets';
import {ProgressImage, Text} from '@components';
import {AuthData, ShopImage} from '@data';
import {Colors, CommonStyle, TS, VS} from '@theme';
import {navigate, setField, validField} from '@util';
import _ from 'lodash';
import React, {useCallback} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Styles} from './Styles';

interface InfoRowProps {
  label?: string;
  value?: string;
  actionLabel?: string;
  isLast?: boolean;
  isFirst?: boolean;
  invalidValue?: boolean;
  onAction?: () => void;
}

export type BusinessProfileSectionProps = {
  profileData?: AuthData | null;
  selectedCompanies: string[];
  onRemoveShop: (id: number) => void;
  shopImages: ShopImage[];
};
export const BusinessProfileSection = ({
  profileData,
  selectedCompanies,
  onRemoveShop,
  shopImages,
}: BusinessProfileSectionProps) => {
  const {t} = useTranslation(['profile', 'register']);
  const {roles, business_data, name, personal_name} = profileData || {};

  const businessInfo =
    business_data && Array.isArray(business_data) && business_data.length > 0
      ? business_data[0]
      : null;

  const rawProducts = Array.isArray(businessInfo?.category_names)
    ? businessInfo?.category_names
    : [];
  const products = rawProducts
    ? _.sortBy(rawProducts.map(item => item.value.trim()))
        .map((item, index) => `${index + 1}) ${_.capitalize(item)}`)
        .join('\n')
    : '';

  const rawSubProducts = Array.isArray(businessInfo?.sub_category_names)
    ? businessInfo?.sub_category_names
    : [];
  const subProducts = rawSubProducts
    ? _.sortBy(rawSubProducts.map(item => item.value.trim()))
        .map((item, index) => `${index + 1}) ${_.capitalize(item)}`)
        .join('\n')
    : '';

  const companiesList = selectedCompanies
    ? _.sortBy(selectedCompanies.map(item => item.trim()))
        .map((item, index) => `${index + 1}) ${_.capitalize(item)}`)
        .join('\n')
    : '';

  const workingWith =
    businessInfo?.working_with && validField(businessInfo?.working_with)
      ? _.sortBy(
          JSON.parse(businessInfo?.working_with ?? '').map((item: any) =>
            item?.value.trim(),
          ),
        )
          .map((item, index) => `${index + 1}) ${_.capitalize(item)}`)
          .join('\n')
      : '';
  const isExist = useCallback(
    (names: string[]) => {
      const slugs = roles?.map(role => role.slug) || [];
      return names.some(el => slugs.includes(el));
    },
    [roles],
  );

  return (
    <View>
      <InfoRow
        label={
          isExist(['sound_provider'])
            ? t('register:forms.sound_provider.label')
            : isExist(['dj_operator', 'sound_operator'])
            ? t('register:forms.sound_operator.label')
            : isExist(['manufacturer'])
            ? t('register:forms.manufacturer.label')
            : isExist(['spare_part'])
            ? t('register:forms.spare_part.yourShopName')
            : t('businessName')
        }
        value={
          isExist(['spare_part'])
            ? validField(personal_name)
              ? personal_name
              : t('infoMissing')
            : validField(businessInfo?.name)
            ? setField(businessInfo?.name)
            : validField(name)
            ? setField(name)
            : t('infoMissing')
        }
        isFirst={true}
        invalidValue={!validField(businessInfo?.name) && !validField(name)}
      />

      <InfoRow
        label={t('register:forms.location.label')}
        invalidValue={!validField(profileData?.address)}
        value={
          validField(profileData?.address)
            ? setField(profileData?.address ?? t('infoMissing'))
            : setField(business_data?.[0]?.address ?? t('infoMissing'))
        }
      />
      {shopImages.length !== 0 && (
        <>
          <Text
            fontWeight="medium"
            style={[TS.fs_14, VS.mt_10, CommonStyle.textBlueGray]}>
            {t('shopPhoto')}
          </Text>
          {shopImages.length > 0 ? (
            <ScrollView
              horizontal
              style={[VS.mt_10]}
              contentContainerStyle={[VS.fd_row, VS.gap_10]}
              showsHorizontalScrollIndicator={false}>
              {shopImages.map((pi: ShopImage) => (
                <View key={pi.id} style={[]}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() =>
                      navigate('GalleryDetail', {
                        type: 'image',
                        images: shopImages.map(el => el.image_url),
                      })
                    }>
                    <ProgressImage
                      source={{uri: pi.image_url}}
                      imageStyle={[VS.br_15]}
                      containerStyle={[Styles.shopImageContainer]}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onRemoveShop(pi.id)}
                    style={[VS.pt_5, VS.ai_center, VS.jc_center]}>
                    <Icons.Delete color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text
              fontWeight="semiBold"
              style={[
                TS.fs_16,
                CommonStyle.textBlack,
                VS.pt_6,
                CommonStyle.textRed,
              ]}>
              {t('notUploaded')}
            </Text>
          )}
        </>
      )}

      {business_data && selectedCompanies.length > 0 && (
        <InfoRow
          label={t('addCompanies')}
          value={companiesList.length !== 0 ? companiesList : t('infoMissing')}
          invalidValue={companiesList.length === 0}
        />
      )}

      {products && (
        <InfoRow
          label={
            roles?.some(role => role.slug === 'manufacturer')
              ? t('register:forms.whatManufacturer.label')
              : t('product')
          }
          value={validField(products) ? products : t('infoMissing')}
          invalidValue={!validField(products)}
        />
      )}
      {subProducts && (
        <InfoRow
          label={t('subProduct')}
          value={validField(subProducts) ? subProducts : t('infoMissing')}
          invalidValue={!validField(subProducts)}
        />
      )}
      {profileData?.business_data &&
        validField(profileData?.business_data?.[0]?.working_with) && (
          <InfoRow
            label={t('workingWith')}
            value={setField(workingWith ?? t('infoMissing'))}
            invalidValue={
              !validField(profileData?.business_data?.[0]?.working_with)
            }
          />
        )}
      <InfoRow
        label={t('register:forms.gst.label')}
        value={setField(
          profileData?.business_data?.[0]?.gst_number ?? t('infoMissing'),
        )}
        invalidValue={!validField(profileData?.business_data?.[0]?.gst_number)}
      />
    </View>
  );
};

const InfoRow = ({
  label,
  value,
  actionLabel,
  isLast,
  onAction,
  isFirst = false,
  invalidValue = false,
}: InfoRowProps) => (
  <View>
    <View style={[!isFirst && VS.mt_12, VS.fd_row, VS.jc_space_between]}>
      <View>
        <Text
          fontWeight="medium"
          style={[TS.fs_14, CommonStyle.textBlueGray, TS.lh_17]}>
          {label}
        </Text>
        {value && (
          <Text
            fontWeight="semiBold"
            style={[
              TS.fs_16,
              CommonStyle.textBlack,
              VS.pt_6,
              (value === 'Info Missing' ||
                value === 'Not Uploaded' ||
                invalidValue) &&
                CommonStyle.textRed,
            ]}>
            {value}
          </Text>
        )}
      </View>

      {actionLabel && (
        <TouchableOpacity onPress={onAction}>
          <Text
            fontWeight="quickSandBold"
            style={[TS.fs_15, CommonStyle.textPrimary]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
    {!isLast && value !== '' && <View style={[Styles.divider, VS.mt_12]} />}
  </View>
);
