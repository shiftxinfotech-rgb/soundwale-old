import {Images} from '@assets';
import {CustomButton, ProgressImage, Text} from '@components';
import {CommonStyle, TS, VS} from '@theme';
import React from 'react';
import {View} from 'react-native';
import {Styles} from './Styles';
type AdCardProps = {
  onPressAdd: () => void;
};
export default function AdCard({onPressAdd}: AdCardProps) {
  return (
    <View style={[VS.fd_row, VS.ai_center, VS.jc_space_between, VS.ph_15]}>
      <View style={[VS.flex_1, VS.ai_start, VS.jc_center]}>
        <Text
          style={[TS.fs_19, TS.lh_27, CommonStyle.textPrimary, VS.mb_4]}
          fontWeight="extraBold">
          ADD YOUR ADVERTISEMENT.
        </Text>
        <Text
          style={[
            TS.fs_14,
            CommonStyle.textBlack,
            VS.mb_4,
            TS.lh_22,
            {width: '85%'},
          ]}
          fontWeight="quickSandMedium">
          Affordable and reliable service at your doorstep – quality you can
          trust!
        </Text>
        <CustomButton
          buttonTitle={'+ Add'}
          onPress={onPressAdd}
          variant="primary"
          titleStyle={[TS.lh_28, TS.fs_16]}
          containerStyle={[
            VS.ai_center,
            VS.as_center,
            Styles.addButton,
            VS.mt_10,
          ]}
        />
      </View>
      <ProgressImage
        source={Images.advertisement}
        containerStyle={[Styles.adImage]}
        mode="cover"
      />
    </View>
  );
}
