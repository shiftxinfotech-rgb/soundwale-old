import {Icons} from '@assets';
import {Text} from '@components';
import {CommonStyle, TS, VS} from '@theme';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';

type Props = {
  title: string;
  rightTitle?: string;
  withRight: boolean;
  onPress: () => void;
};

export default function HeaderWithViewAll({
  onPress,
  title,
  withRight,
  rightTitle,
}: Props) {
  return (
    <View style={[VS.fd_row, VS.jc_space_between, VS.ai_center, VS.mb_10]}>
      <Text fontWeight="bold" style={[TS.fs_18, CommonStyle.textBlack]}>
        {title}
      </Text>
      {withRight && (
        <TouchableOpacity
          style={[VS.fd_row, VS.ai_center, VS.jc_center, VS.gap_2]}
          accessibilityLabel={'ViewAll'}
          onPress={onPress}
          testID="trending-viewall-btn">
          <Text
            fontWeight="quickSandSemiBold"
            style={[TS.fs_15, TS.ls_0_2, CommonStyle.textPrimary]}>
            {rightTitle}
          </Text>
          <Icons.ArrowRight />
        </TouchableOpacity>
      )}
    </View>
  );
}
