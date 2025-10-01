import {NoData, Text} from '@components';
import {ContactBean, DirectoryDetail} from '@data';
import {CommonStyle, TS, VS} from '@theme';
import {Scale, setField, validField} from '@util';
import React from 'react';
import {View} from 'react-native';
import {ContactItem} from './ContactItem';
import {useTranslation} from 'react-i18next';

type OtherInfoTabProps = {
  info: DirectoryDetail;
};

export default function OtherInfoTab({info}: OtherInfoTabProps) {
  const {t} = useTranslation(['generic']);
  const {
    extra_mobile_number,
    image_url,
    service_center_info,
    your_best_engineer,
    business_data,
    roles,
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
    return <NoData message={t('noInformationFound')} />;
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
      {haveServiceCenter &&
      !roles?.some(role => ['dealer'].includes(role.slug ?? '')) ? (
        <View style={[VS.gap_10]}>
          <Text fontWeight="bold" style={[TS.fs_16, TS.tt_capitalize]}>
            {t('serviceCenterInfo')}
          </Text>
          <View style={[VS.gap_10]}>
            {JSON.parse(service_center_info as string).map(
              (el: any, index: number) => (
                <View
                  key={index}
                  style={[
                    CommonStyle.shadowBoxLight,
                    VS.p_10,
                    VS.br_10,
                    VS.gap_9,
                  ]}>
                  <ServiceCenterItem
                    label={`${t('company')} : `}
                    value={el.company_name}
                  />
                  <ServiceCenterItem
                    label={`${t('location')} : `}
                    value={el.location}
                  />
                </View>
              ),
            )}
          </View>
        </View>
      ) : (
        <></>
      )}

      {haveYourBestEngineer ? (
        <>
          <Text fontWeight="bold" style={[TS.fs_16, TS.tt_capitalize]}>
            {t('studentInfoInHarmony')}
          </Text>
          <View
            style={[VS.gap_10, CommonStyle.shadowBoxLight, VS.br_10, VS.p_10]}>
            <View style={[VS.gap_8]}>
              {JSON.parse(your_best_engineer).map(
                (item: any, index: number) => (
                  <Text
                    key={index}
                    fontWeight="medium"
                    style={[
                      TS.fs_14,
                      TS.lh_25,
                      TS.tt_capitalize,
                      CommonStyle.textBlack,
                      VS.flex_1,
                    ]}>
                    {index + 1}. {item}
                  </Text>
                ),
              )}
            </View>
          </View>
        </>
      ) : (
        <></>
      )}
    </View>
  );
}

const ServiceCenterItem = ({label, value}: {label: string; value: string}) => {
  return (
    <View style={[VS.fd_row, VS.gap_10, VS.ai_center]}>
      <Text
        fontWeight="bold"
        style={[
          TS.fs_14,
          TS.tt_capitalize,
          CommonStyle.textBlack,
          {minWidth: Scale(80)},
        ]}>
        {label}
      </Text>
      <Text
        style={[
          TS.fs_12,
          TS.tt_capitalize,
          CommonStyle.textBlack,
          VS.flex_1,
          TS.ta_justify,
        ]}>
        {setField(value)}
      </Text>
    </View>
  );
};
