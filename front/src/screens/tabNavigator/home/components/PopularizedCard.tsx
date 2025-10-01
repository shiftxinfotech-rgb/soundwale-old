import {Images} from '@assets';
import {Text} from '@components';
import {AppStyle, CommonStyle, TS, VS} from '@theme';
import React from 'react';
import {ImageBackground, View, TouchableOpacity} from 'react-native';
import {hexToRgbA} from '@util';
import {Styles} from './Styles';

type PopularizedCardProps = {};

export default function PopularizedCard({}: PopularizedCardProps) {
  return (
    <View style={[VS.ph_15, VS.mt_15]}>
      <View style={[Styles.container, VS.br_10]}>
        <ImageBackground
          source={Images.popularizedHome}
          style={[Styles.imageBackground, AppStyle.fullWidth]}
          imageStyle={Styles.image}>
          <View
            style={[
              Styles.imageBackground,
              {
                backgroundColor: hexToRgbA('#A27EF7', '0.98'),
              },
              AppStyle.fullWidth,
              VS.ph_13,
              VS.pv_12,
            ]}>
            <Text
              fontWeight="bold"
              style={[TS.fs_17, TS.lh_25, CommonStyle.textWhite]}>
              Popularised in the 1960s with
            </Text>
            <View style={[VS.fd_row]}>
              <Text
                fontWeight="quickSandMedium"
                style={[
                  TS.fs_12,
                  TS.lh_17,
                  CommonStyle.textWhite,
                  {width: '80%'},
                ]}>
                sometimes by accident, sometimes on purpose don't look even
                slightly believable.
              </Text>
              <TouchableOpacity
                style={[
                  Styles.clickNowButton,
                  CommonStyle.bgWhite,
                  VS.ai_center,
                  VS.jc_center,
                ]}>
                <Text
                  fontWeight="quickSandSemiBold"
                  style={[TS.fs_10, TS.lh_13, CommonStyle.textBlack]}>
                  Click Now!
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}
