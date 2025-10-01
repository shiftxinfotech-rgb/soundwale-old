import {ComponentStyles, ProgressImage, Text} from '@components';
import {RoleBean} from '@data';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {isValidImageUrl} from '@util';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import BudgetRolesDisplay from './BuyerListItem/RolesDisplay';

type Props = {
  userName?: string;
  userMobileCode?: string;
  userMobileNumber?: string;
  userProfileUrl?: string;
  userLocation?: string;
  type?: string;
  roles?: RoleBean[];
};

const UserInfo = ({
  userMobileCode,
  userMobileNumber,
  userName,
  type,
  userProfileUrl,
  roles,
  userLocation,
}: Props) => (
  <View
    style={[
      VS.fd_row,
      VS.ph_10,
      VS.flex_1,
      type !== 'seller' ? VS.pv_15 : VS.pv_10,
      type !== 'seller' && styles.profileContainer,
      VS.gap_5,
    ]}>
    <View style={[VS.fd_row, type !== 'seller' && VS.flex_1]}>
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
              AppStyle.hideOverFlow,
              ComponentStyles.borderRadius,
            ]}
          />
        )}
      </View>
      <View style={[VS.ml_10, VS.flex_1]}>
        <View style={[VS.fd_row, VS.ai_center, VS.jc_space_between, VS.gap_5]}>
          <Text
            numberOfLines={1}
            fontWeight="semiBold"
            style={[TS.fs_15, TS.tt_capitalize]}>
            {userName}
          </Text>
        </View>
        <Text
          numberOfLines={1}
          fontWeight="medium"
          style={[TS.fs_14, CommonStyle.textBlueGray]}>
          {`${userMobileCode} ${userMobileNumber}`}
        </Text>
        <Text
          numberOfLines={1}
          fontWeight="medium"
          style={[TS.fs_14, CommonStyle.textBlueGray]}>
          {`${userLocation}`}
        </Text>
      </View>
    </View>

    {type !== 'seller' && (
      <View style={[VS.ai_center]}>
        <BudgetRolesDisplay roles={roles ?? []} />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  profileContainer: {
    borderTopColor: Colors.silverGray,
    backgroundColor: '#f3f8fb',
  },
});

export default UserInfo;
