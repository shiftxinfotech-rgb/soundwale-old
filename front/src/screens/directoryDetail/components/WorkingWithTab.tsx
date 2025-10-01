import {NoData, Text} from '@components';
import {DirectoryDetail} from '@data';
import {CommonStyle, TS, VS} from '@theme';
import {validField} from '@util';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

type WorkingWithTabProps = {
  info: DirectoryDetail;
};

export default function WorkingWithTab({info}: WorkingWithTabProps) {
  const {t} = useTranslation(['generic']);
  const {business_data} = info || {};
  const haveWorkingWith =
    Array.isArray(business_data) &&
    business_data.length > 0 &&
    validField(business_data[0].working_with);

  if (!haveWorkingWith) {
    return <NoData message={t('noInformationFound')} />;
  }

  return (
    <View style={[VS.gap_10]}>
      {haveWorkingWith ? (
        <View
          style={[VS.gap_10, CommonStyle.shadowBoxLight, VS.br_10, VS.p_10]}>
          <Text fontWeight="bold" style={[TS.fs_16, TS.tt_capitalize]}>
            {t('workingWith')}
          </Text>
          <View style={[VS.gap_8]}>
            {JSON.parse(business_data[0].working_with).map(
              (item: any, index: number) => {
                const value =
                  typeof item === 'string' ? item : item?.value ?? '';
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
              },
            )}
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}
