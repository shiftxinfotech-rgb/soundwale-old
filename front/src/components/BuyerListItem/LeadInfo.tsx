import {Text} from '@components';
import {Colors, CommonStyle, TS, VS} from '@theme';
import React from 'react';
import {View} from 'react-native';

const LeadInfo = () => (
  <View
    style={[
      VS.ai_center,
      VS.pt_6,
      VS.pb_8,
      VS.gap_5,
      VS.bwt_1,
      {borderTopColor: Colors.silverGray},
    ]}>
    <Text
      fontWeight="quickSandBold"
      style={[TS.fs_16, CommonStyle.textPrimary, TS.lh_20]}>
      {'Get this lead'}
    </Text>
    <Text
      fontWeight="medium"
      style={[TS.fs_11, CommonStyle.textBlueGray, TS.lh_13]}>
      (Phone No. & Shop Photo Available)
    </Text>
  </View>
);

export default React.memo(LeadInfo);
