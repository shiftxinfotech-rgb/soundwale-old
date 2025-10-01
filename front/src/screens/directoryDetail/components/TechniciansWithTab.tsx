import {NoData, Text} from '@components';
import {DirectoryDetail} from '@data';
import {CommonStyle, TS, VS} from '@theme';
import {validField} from '@util';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

type TechniciansWithTabProps = {
  info: DirectoryDetail;
};

export default function TechniciansWithTab({info}: TechniciansWithTabProps) {
  const {t} = useTranslation(['generic']);
  const {business_data} = info || {};
  const haveTechniciansWith =
    Array.isArray(business_data) &&
    business_data.length > 0 &&
    validField(business_data[0].your_best_engineer);

  if (!haveTechniciansWith) {
    return <NoData message={t('noInformationFound')} />;
  }

  const engineers = JSON.parse(business_data[0].your_best_engineer);

  return (
    <View style={[VS.gap_10]}>
      {haveTechniciansWith ? (
        <View
          style={[VS.gap_10, CommonStyle.shadowBoxLight, VS.br_10, VS.p_10]}>
          <Text fontWeight="bold" style={[TS.fs_16, TS.tt_capitalize]}>
            {t('technicians')}
          </Text>
          <View style={[VS.gap_8]}>
            {engineers.map((item: any, index: number) => {
              const value = typeof item === 'string' ? item : item?.value ?? '';
              const key =
                typeof item === 'object' && item?.id ? item.id : index;
              return (
                <Text
                  key={key}
                  fontWeight="medium"
                  style={[
                    TS.fs_14,
                    TS.lh_25,
                    TS.tt_capitalize,
                    CommonStyle.textBlack,
                    VS.flex_1,
                  ]}>
                  {index + 1}. {value}
                </Text>
              );
            })}
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}
