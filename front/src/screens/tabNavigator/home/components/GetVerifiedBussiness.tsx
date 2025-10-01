import {Icons, Images} from '@assets';
import {Text} from '@components';
import {AppStyle, CommonStyle, TS, VS} from '@theme';
import React from 'react';
import {ImageBackground, View} from 'react-native';

import {Styles} from './Styles';

type GetVerifiedBusinessCardProps = {};

export default function GetVerifiedBusinessCard({}: GetVerifiedBusinessCardProps) {
  return (
    <View style={[VS.ph_15, VS.mt_15]}>
      <View style={[Styles.container]}>
        <ImageBackground
          source={Images.homeBusiness}
          style={[Styles.getVerifiedBusiness, AppStyle.fullWidth]}>
          <View style={[VS.pl_11, VS.pv_7]}>
            <View style={[VS.fd_row]}>
              <View style={Styles.getVerifiedText}>
                <Text
                  fontWeight="bold"
                  numberOfLines={2}
                  style={[TS.fs_19, TS.lh_30, CommonStyle.textWhite]}>
                  Get Verified & Grow Your Business!
                </Text>
                <Text
                  fontWeight="quickSandMedium"
                  numberOfLines={3}
                  style={[
                    TS.fs_14,
                    TS.lh_21,
                    CommonStyle.textWhite,
                    {width: '75%'},
                  ]}>
                  There are many variations of passages of Lorem Ipsum
                  available...
                </Text>
              </View>

              <Icons.BusinessVerify />
            </View>
          </View>
          <View style={[Styles.getVerifiedToday, VS.ai_center, VS.jc_center]}>
            <Text
              fontWeight="quickSandBold"
              style={[TS.fs_13, CommonStyle.textWhite]}>
              Get Verified Today
            </Text>
          </View>
        </ImageBackground>
      </View>
    </View>
  );
}
