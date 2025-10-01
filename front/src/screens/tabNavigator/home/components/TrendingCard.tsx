import {Icons} from '@assets';
import {ComponentStyles, ProgressImage, Text} from '@components';
import {TopPicksData} from '@data';
import {AppStyle, Colors, CommonStyle, TS, VS} from '@theme';
import {setField} from '@util';
import React from 'react';
import {View} from 'react-native';
import {Styles} from './Styles';

type Props = {
  bean: TopPicksData;
};

export default function TrendingCard({bean}: Props) {
  return (
    <View style={[Styles.brandContainer]}>
      <View style={[Styles.topRectangle, VS.ml_16]} />
      <View style={[VS.pt_6, VS.pl_7, VS.pr_12]}>
        <View style={[VS.fd_row, VS.ai_center, VS.jc_space_between]}>
          <Text fontWeight="bold" style={[TS.fs_18, CommonStyle.textBlack]}>
            {setField(bean.name)}
          </Text>
          <View style={[Styles.brandBg, VS.ai_center, VS.jc_center]}>
            <ProgressImage
              source={{uri: bean.image_url}}
              containerStyle={[
                Styles.brandLogo,
                AppStyle.hideOverFlow,
                ComponentStyles.borderRadius,
              ]}
            />
          </View>
        </View>
        <Text
          fontWeight="medium"
          numberOfLines={3}
          style={[
            TS.fs_12,
            TS.lh_17,
            CommonStyle.textBlack,
            Styles.labelMaxWidth,
          ]}>
          {setField(bean.description)}
        </Text>
      </View>
      <View style={[Styles.rightView, VS.ai_center, VS.jc_center]}>
        <Icons.ArrowRight color={Colors.black} height={27} width={27} />
      </View>
    </View>
  );
}
