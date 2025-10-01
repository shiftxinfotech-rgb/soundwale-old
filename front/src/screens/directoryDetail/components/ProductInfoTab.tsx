import {NoData, Text} from '@components';
import {DirectoryDetail} from '@data';
import {CommonStyle, TS, VS} from '@theme';
import {Scale, setField, validField} from '@util';
import _ from 'lodash';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

type ProductInfoTabProps = {
  info: DirectoryDetail;
};

export default function ProductInfoTab({info}: ProductInfoTabProps) {
  const {t} = useTranslation(['generic']);
  const {business_data: details, roles} = info;
  const hasInfo = Array.isArray(details) && details.length > 0;

  console.log('details', JSON.stringify(details, null, 2));

  if (!hasInfo) {
    return <NoData message={t('noInformationFound')} />;
  }

  const firstItem = details[0];
  const {product_info, category_names, sub_category_names, companies_name} =
    firstItem || {};

  const haveProductInfo = validField(product_info);

  const haveCategory =
    Array.isArray(category_names) && category_names.length > 0;
  const haveSubCategory =
    Array.isArray(sub_category_names) && sub_category_names.length > 0;
  const haveCompanies =
    Array.isArray(companies_name) && companies_name.length > 0;

  const haveCategories = haveCategory || haveSubCategory;

  if (!haveCategories && !haveCompanies && !haveProductInfo) {
    return <NoData message={t('noInformationFound')} />;
  }

  return (
    <View style={[VS.gap_10]}>
      {haveProductInfo ? (
        <View style={[VS.gap_10]}>
          {JSON.parse(product_info!)?.map((el: any, index: number) => (
            <View
              key={index}
              style={[VS.gap_6, CommonStyle.shadowBoxLight, VS.br_10, VS.p_10]}>
              <RowItem
                label={`${t('product')} : `}
                value={el.product_name || ''}
              />
              <RowItem
                label={`${t('company')} : `}
                value={el.company_name || ''}
              />
              <RowItem label={`${t('model')} : `} value={el.model_name || ''} />
            </View>
          ))}
        </View>
      ) : (
        <></>
      )}

      {haveCategories ? (
        <View style={[VS.gap_10]}>
          <CategoryItem
            label={
              roles?.some(role => role.slug === 'manufacturer')
                ? t('manufacturerProduct')
                : t('product')
            }
            value={_.sortBy(category_names?.map(s => s.value.trim()))
              .map((item, i) => `${i + 1})  ${_.capitalize(item.trim())}`)
              .join('\n')}
          />

          {haveSubCategory && (
            <CategoryItem
              label={t('subProduct')}
              value={_.sortBy(sub_category_names?.map(s => s.value.trim()))
                .map((item, i) => `${i + 1})  ${_.capitalize(item.trim())}`)
                .join('\n')}
            />
          )}

          {haveCompanies && (
            <CategoryItem
              label={
                roles?.some(role => role.slug === 'dealer')
                  ? t('dealerOfCompany')
                  : t('company')
              }
              value={_.sortBy(companies_name?.map(s => s.value.trim()))
                .map((item, i) => `${i + 1})  ${_.capitalize(item.trim())}`)
                .join('\n')}
            />
          )}
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}

const RowItem = ({label, value}: {label: string; value: string}) => {
  return (
    <View style={[VS.fd_row, VS.gap_10, VS.ai_center, VS.flex_1]}>
      <Text
        fontWeight="bold"
        style={[
          TS.fs_16,
          TS.tt_capitalize,
          CommonStyle.textBlack,
          {minWidth: Scale(90)},
        ]}>
        {label}
      </Text>
      <View style={[VS.flex_1]}>
        <Text style={[TS.fs_14, TS.tt_capitalize, CommonStyle.textBlack]}>
          {setField(value)}
        </Text>
      </View>
    </View>
  );
};

const CategoryItem = ({label, value}: {label: string; value: string}) => {
  return (
    <View style={[VS.gap_5]}>
      <Text
        fontWeight="bold"
        style={[TS.fs_16, TS.tt_capitalize, CommonStyle.textBlack]}>
        {label}
      </Text>
      <View style={[CommonStyle.shadowBoxLight, VS.br_10, VS.p_10]}>
        <Text style={[TS.fs_14, TS.tt_capitalize, CommonStyle.textBlack]}>
          {setField(value)}
        </Text>
      </View>
    </View>
  );
};
