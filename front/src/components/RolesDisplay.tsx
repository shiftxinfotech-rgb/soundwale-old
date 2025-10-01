import {RoleBean} from '@data';
import {CommonStyle, TS, VS} from '@theme';
import {fetchStyles, Scale, setField} from '@util';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';

import {Text} from './TextView';
import {TextStyle} from 'react-native';

type Props = {
  viewStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  roles: RoleBean[];
};

export function RolesDisplay({roles, viewStyle, titleStyle}: Props) {
  const [index, setIndex] = useState(0);
  const viewStyles = fetchStyles(viewStyle);
  const titleStyles = fetchStyles(titleStyle);

  useEffect(() => {
    if (roles.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % roles.length);
    }, 3000); // Show each role for 3 seconds

    return () => clearInterval(interval);
  }, [roles.length]);

  const currentRole = useMemo(() => roles[index], [roles, index]);

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(400)}
      style={[VS.ai_center, VS.ph_10, VS.pv_5, VS.gap_2, viewStyles]}>
      {/* <ProgressImage
        source={{uri: currentRole?.image_url}}
        containerStyle={ComponentStyles.roleImage}
      /> */}
      <View
        style={[
          CommonStyle.bgBlueGray,
          VS.ph_5,
          VS.pv_5,
          {width: Scale(110), borderRadius: Scale(110)},
        ]}>
        <Text
          fontWeight="quickSandMedium"
          numberOfLines={2}
          style={[
            TS.fs_13,
            TS.ta_center,
            // TS.tav_center,
            // TS.tt_capitalize,
            CommonStyle.textWhite,
            TS.lh_15,
            titleStyles,
          ]}>
          {setField(currentRole.name)}
        </Text>
      </View>
    </Animated.View>
  );
}
