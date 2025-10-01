import {NoData, Text} from '@components';
import {ContactBean, DirectoryDetail} from '@data';
import {CommonStyle, TS, VS} from '@theme';
import {validField} from '@util';
import React from 'react';
import {View} from 'react-native';
import {ContactItem} from './ContactItem';
import { useTranslation } from 'react-i18next';

type ContactInfoTabProps = {
  info: DirectoryDetail;
};

export default function ContactInfoTab({ info }: ContactInfoTabProps) {
  const {t} = useTranslation(['generic']);
  const {
    extra_mobile_number,
    image_url,
    service_center_info,
    your_best_engineer,
    business_data,
  } = info || {};

  const haveNumbers =
    validField(extra_mobile_number as string) &&
    JSON.parse(extra_mobile_number as string).length > 0;

  const haveServiceCenter =
    validField(service_center_info) &&
    JSON.parse(service_center_info as string).length > 0;

  const haveYourBestEngineer =
    validField(your_best_engineer) &&
    Array.isArray(JSON.parse(your_best_engineer)) &&
    JSON.parse(your_best_engineer).some(
      (item: any) => item !== null && item !== '' && typeof item === 'string',
    );

  const haveWorkingWith =
    Array.isArray(business_data) &&
    business_data.length > 0 &&
    validField(business_data[0].working_with);

  if (
    !haveNumbers &&
    !haveServiceCenter &&
    !haveYourBestEngineer &&
    !haveWorkingWith
  ) {
    return <NoData message="No information found" />;
  }

  return (
    <View style={[VS.gap_10]}>
      {haveNumbers ? (
        <View style={[VS.gap_10]}>
          <Text fontWeight="bold" style={[TS.fs_16, TS.tt_capitalize]}>
            {t('contacts')}
          </Text>
          <View style={[VS.gap_10]}>
            {JSON.parse(extra_mobile_number as string).map(
              (el: ContactBean, index: number) => (
                <View
                  key={index}
                  style={[CommonStyle.shadowBoxLight, VS.br_10, VS.p_10]}>
                  <ContactItem info={el} userImage={image_url} />
                </View>
              ),
            )}
          </View>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}
