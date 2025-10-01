import {Icons} from '@assets';
import {Text} from '@components';
import {AuthData} from '@data';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {hexToRgbA, navigate, Scale, setField, validField} from '@util';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Styles} from './Styles';
export type ProfileCardProps = {
  profileData?: AuthData;
};

export const ProfileCard = ({profileData}: ProfileCardProps) => {
  const {t} = useTranslation(['profile']);
  return (
    <LinearGradient
      colors={[
        Colors.white,
        hexToRgbA(Colors.gradientStart, '0.3'),
        hexToRgbA(Colors.gradientEnd, '0.3'),
      ]}
      locations={[0, 0.9, 1]}
      start={{x: 0.8, y: 0.5}}
      end={{x: 1, y: 0}}
      style={[VS.pv_15, VS.br_12, CommonStyle.shadowBox]}>
      <View style={[VS.fd_row, VS.jc_space_between, VS.ai_center, VS.ph_15]}>
        <Text fontWeight="bold" style={[TS.fs_20, CommonStyle.textBlack]}>
          {t('personalDetails')}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigate('EditProfile', {
              profileData: profileData,
            })
          }>
          <Icons.Pencil color={Colors.black} />
        </TouchableOpacity>
      </View>
      <View style={[Styles.divider, AppStyle.fullWidth, VS.mt_12]} />
      <View style={[VS.mt_11, VS.ph_15]}>
        <Text fontWeight="semiBold" style={[TS.fs_16, CommonStyle.textBlack]}>
          {setField(profileData?.name)}
        </Text>
        <View style={VS.mt_6}>
          <View style={[VS.fd_row, VS.ai_center, VS.gap_4]}>
            <Icons.Email />
            <Text style={[TS.fs_14, CommonStyle.textBlueGray]}>
              {setField(profileData?.email)}
            </Text>
          </View>
          <View style={[VS.fd_row, VS.ai_center, VS.gap_4]}>
            <Icons.CallNow
              color={Colors.blueGray}
              width={Scale(13)}
              height={Scale(13)}
            />
            <Text style={[TS.fs_14, CommonStyle.textBlueGray, VS.pr_2]}>
              {setField(profileData?.code)}{' '}
              {setField(profileData?.mobile_number)}
            </Text>
            {profileData?.mobile_number && <Icons.WhatsAppLine />}
          </View>
          <View style={[VS.fd_row, VS.ai_center, VS.gap_4]}>
            <Icons.Map />
            {validField(profileData?.country_name) &&
              setField(profileData?.state_name) &&
              setField(profileData?.state_name) && (
                <Text style={[TS.fs_14, CommonStyle.textBlueGray]}>
                  {setField(profileData?.country_name)},{' '}
                  {setField(profileData?.state_name)},{' '}
                  {setField(profileData?.city_name)}
                </Text>
              )}
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};
