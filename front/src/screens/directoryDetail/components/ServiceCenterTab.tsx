import {Icons} from '@assets';
import {NoData, Text, VectorIcon} from '@components';
import {DirectoryDetail} from '@data';
import {Colors, CommonStyle, TS, VS} from '@theme';
import {
  createOpenLink,
  openPhoneCall,
  Scale,
  setField,
  validField,
} from '@util';
import _ from 'lodash';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import MapView, {LatLng, Marker} from 'react-native-maps';
import {Styles} from '../Styles';

type ServiceCenterTabProps = {
  info: DirectoryDetail;
};

const DEALER_ROLES = [
  'dealer',
  'repairing_shop',
  'service_center',
  'manufacturer',
];

const hasDealerRole = (roles: any[]) =>
  roles?.some(role => DEALER_ROLES.includes(role.slug ?? ''));

const ServiceCenterItem = ({
  label,
  value,
  onPress,
  icon,
}: {
  label: string;
  value: string;
  onPress: () => void;
  icon?: React.ReactNode;
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={1}
    style={[VS.fd_row, VS.gap_10, VS.ai_center]}>
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
    {icon}
  </TouchableOpacity>
);

const DealerServiceCenter = ({
  serviceCenterInfo,
  t,
}: {
  serviceCenterInfo: string;
  t: any;
}) => {
  const serviceCenters = JSON.parse(serviceCenterInfo);

  return (
    <>
      <Text fontWeight="bold" style={[TS.fs_16, TS.tt_capitalize]}>
        {t('serviceCenter')}
      </Text>
      <View style={[VS.gap_10]}>
        {serviceCenters.map((el: any, index: number) => (
          <View
            key={index}
            style={[CommonStyle.shadowBoxLight, VS.p_10, VS.br_10, VS.gap_9]}>
            <ServiceCenterItem
              label={`${t('centerName')} : `}
              value={el.center_name}
              onPress={() => {}}
            />
            <ServiceCenterItem
              label={`${t('company')} : `}
              value={el.company_name}
              onPress={() => {}}
            />
            <ServiceCenterItem
              label={`${t('location')} : `}
              value={el.location}
              icon={
                <VectorIcon
                  iconColor={Colors.black}
                  iconSize={Scale(25)}
                  iconName="location-pin"
                  iconType={2}
                />
              }
              onPress={() => {
                try {
                  createOpenLink({
                    travelType: 'public_transport',
                    end: el.location,
                    latitude: parseFloat(el.latitude ?? '0'),
                    longitude: parseFloat(el.longitude ?? '0'),
                  });
                } catch (error) {}
              }}
            />
            <ServiceCenterItem
              label={`${t('phone')} : `}
              value={`${el.code} ${el.mobile_number}`}
              icon={
                <VectorIcon
                  iconColor={Colors.black}
                  iconSize={Scale(25)}
                  iconName="phone"
                  iconType={2}
                />
              }
              onPress={() => {
                openPhoneCall(`${el.code} ${el.mobile_number}`);
              }}
            />
          </View>
        ))}
      </View>
    </>
  );
};

const RegularServiceCenter = ({
  serviceCenterName,
  serviceCenterAddress,
  serviceCenterAddressLatitude,
  serviceCenterAddressLongitude,
  t,
}: {
  serviceCenterName: string;
  serviceCenterAddress: string;
  serviceCenterAddressLatitude: string;
  serviceCenterAddressLongitude: string;
  t: any;
}) => {
  const haveCoordinates =
    validField(serviceCenterAddressLatitude) &&
    validField(serviceCenterAddressLongitude) &&
    Number(serviceCenterAddressLatitude) !== 0 &&
    Number(serviceCenterAddressLongitude) !== 0;

  const coords: LatLng = {
    latitude: Number(serviceCenterAddressLatitude || 0),
    longitude: Number(serviceCenterAddressLongitude || 0),
  };

  return (
    <>
      <Text fontWeight="bold" style={[TS.fs_16, TS.tt_capitalize]}>
        {t('serviceCenter')}
      </Text>
      <View style={[VS.gap_10, CommonStyle.shadowBoxLight, VS.br_10, VS.p_10]}>
        <Text
          fontWeight="medium"
          style={[
            TS.fs_14,
            TS.lh_25,
            TS.tt_capitalize,
            CommonStyle.textBlack,
            VS.flex_1,
          ]}>
          {setField(
            _.sortBy((serviceCenterName || '').split(',').map(s => s.trim()))
              .map((item, i) => `${i + 1})  ${item}`)
              .join('\n'),
          )}
        </Text>
      </View>
      <Text fontWeight="bold" style={[TS.fs_16, TS.tt_capitalize]}>
        {t('serviceCenterAddress')}
      </Text>
      <View style={[VS.gap_10, CommonStyle.shadowBoxLight, VS.br_10, VS.p_10]}>
        <View style={[VS.gap_10]}>
          <View style={[VS.fd_row, VS.ai_start, VS.gap_10]}>
            <View style={[VS.mt_2]}>
              <Icons.Location />
            </View>
            <Text
              fontWeight="quickSandRegular"
              style={[
                TS.fs_13,
                CommonStyle.textBlack,
                TS.ta_justify,
                VS.flex_1,
              ]}>
              {setField(serviceCenterAddress)}
            </Text>
          </View>
          {haveCoordinates && (
            <MapView
              followsUserLocation={true}
              userInterfaceStyle={'light'}
              showsMyLocationButton={false}
              userLocationPriority="high"
              initialRegion={{
                ...coords,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              style={Styles.mapView}>
              <Marker.Animated tappable={false} coordinate={coords} />
            </MapView>
          )}
        </View>
      </View>
    </>
  );
};

export default function ServiceCenterTab({info}: ServiceCenterTabProps) {
  const {t} = useTranslation(['generic']);
  const {business_data, roles, service_center_info} = info || {};

  const haveServiceCenter =
    Array.isArray(business_data) && business_data.length > 0;
  const haveDealerServiceCenter =
    validField(service_center_info) &&
    JSON.parse(service_center_info as string).length > 0;

  // Early return if no service center data
  if (!haveServiceCenter && !haveDealerServiceCenter) {
    return <NoData message={t('noInformationFound')} />;
  }

  const isDealerRole = hasDealerRole(roles);
  const firstItem = business_data?.[0] || {};

  // Check if dealer role has service center data
  if (isDealerRole && !haveDealerServiceCenter) {
    return <NoData message={t('noInformationFound')} />;
  }

  // Check if regular role has required fields
  if (!isDealerRole) {
    const hasRequiredFields =
      validField(firstItem.service_center_name) &&
      validField(firstItem.service_center_address) &&
      validField(firstItem.service_center_address_latitude) &&
      validField(firstItem.service_center_address_longitude);

    if (!hasRequiredFields) {
      return <NoData message={t('noInformationFound')} />;
    }
  }

  return (
    <View style={[VS.gap_10]}>
      {isDealerRole ? (
        haveDealerServiceCenter && (
          <DealerServiceCenter
            serviceCenterInfo={service_center_info as string}
            t={t}
          />
        )
      ) : (
        <RegularServiceCenter
          serviceCenterName={firstItem.service_center_name}
          serviceCenterAddress={firstItem.service_center_address}
          serviceCenterAddressLatitude={
            firstItem.service_center_address_latitude || ''
          }
          serviceCenterAddressLongitude={
            firstItem.service_center_address_longitude || ''
          }
          t={t}
        />
      )}
    </View>
  );
}
