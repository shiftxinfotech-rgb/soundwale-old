import {RoleBean} from '@data';
import {CommonStyle, TS, VS} from '@theme';
import {fetchStyles, Scale, setField} from '@util';
import React, {useMemo} from 'react';
import {ImageProps, StyleProp, View, ViewStyle} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import {TextStyle} from 'react-native';
import {Text} from '../TextView';

type Props = {
  viewStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  imageStyle?: ImageProps;
  roles: RoleBean[];
};

function BudgetRolesDisplay({roles, viewStyle, titleStyle}: Props) {
  const viewStyles = fetchStyles(viewStyle);
  const titleStyles = fetchStyles(titleStyle);
  const currentRole = useMemo(() => roles[0], [roles]);

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}
      style={[
        VS.as_end,
        VS.ai_center,
        VS.pv_5,
        VS.gap_2,
        VS.fd_row,
        viewStyles,
      ]}>
      <View
        style={[
          CommonStyle.bgBlueGray,
          VS.ph_5,
          VS.ai_center,
          VS.jc_center,
          {width: Scale(110), borderRadius: Scale(110)},
        ]}>
        <Text
          fontWeight="quickSandMedium"
          numberOfLines={2}
          style={[
            TS.fs_13,
            TS.tt_capitalize,
            CommonStyle.textWhite,
            TS.lh_15,
            TS.ta_center,
            VS.pv_5,
            titleStyles,
          ]}>
          {setField(currentRole.name)}
        </Text>
      </View>
    </Animated.View>
  );
}

export default React.memo(BudgetRolesDisplay);
