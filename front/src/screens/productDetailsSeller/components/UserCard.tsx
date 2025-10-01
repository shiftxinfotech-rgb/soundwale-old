import {Icons} from '@assets';
import {ComponentStyles, ProgressImage, Text} from '@components';
import {AppStyle, CommonStyle, TS, VS} from '@theme';
import {isValidImageUrl} from '@util';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';

type Props = {
  userName?: string;
  userMobileCode?: string;
  userMobileNumber?: string;
  userProfileUrl?: string;
  userAddress?: string;
  onPress?: () => void;
  userRole?: string;
};
const UserCard = ({
  userName,
  userMobileCode,
  userMobileNumber,
  userProfileUrl,
  userAddress,
  onPress,
  userRole,
}: Props) => {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[
        VS.fd_row,
        VS.ai_center,
        CommonStyle.commonBorderMid,
        CommonStyle.shadowBox,
        VS.mt_11,
        VS.ph_12,
        VS.pv_15,
        VS.gap_10,
      ]}>
      <View
        style={[
          ComponentStyles.profileContainer,
          AppStyle.hideOverFlow,
          CommonStyle.bgPaleAqua,
          VS.p_4,
        ]}>
        {isValidImageUrl(userProfileUrl) && (
          <ProgressImage
            source={{uri: userProfileUrl}}
            containerStyle={[
              AppStyle.fullSize,
              ComponentStyles.borderRadius,
              AppStyle.hideOverFlow,
            ]}
          />
        )}
      </View>
      <View style={[VS.flex_1]}>
        <Text fontWeight="semiBold" style={[TS.fs_15, VS.mb_2]}>
          {userName}
        </Text>
        <Text
          fontWeight="medium"
          style={[
            TS.fs_14,
            CommonStyle.textBlueGray,
            VS.mb_2,
            TS.tt_capitalize,
          ]}>
          {`${userRole}`}
        </Text>
        <Text
          fontWeight="medium"
          style={[TS.fs_14, CommonStyle.textBlueGray, VS.mb_2]}>
          {`${userMobileCode} ${userMobileNumber}`}
        </Text>

        <View style={[VS.fd_row, VS.ai_center, VS.gap_4]}>
          <Icons.Map />
          <Text
            fontWeight="medium"
            style={[TS.fs_14, CommonStyle.textBlueGray]}>
            {userAddress}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;
