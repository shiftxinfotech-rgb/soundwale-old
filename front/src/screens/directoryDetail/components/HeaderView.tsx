import {Icons} from '@assets';

import {Colors, CommonStyle, VS} from '@theme';
import {moveBack, onSharePost} from '@util';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Styles} from './Styles';
import {DirectoryBean} from '@data';

export const HeaderView = ({info}: {info: DirectoryBean}) => {
  return (
    <View style={[VS.ph_17, CommonStyle.safeAreaSpaceTop]}>
      <View style={[VS.fd_row, VS.ai_center, VS.jc_space_between]}>
        <TouchableOpacity activeOpacity={1} onPress={moveBack}>
          <Icons.ArrowBack color={Colors.black} />
        </TouchableOpacity>
        <View style={[VS.fd_row, VS.gap_10, VS.mt_7]}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              onSharePost(
                'directory',
                info?.id?.toString() ?? '',
                info?.categories_id ?? '',
                {
                  title: info?.name ?? '',
                  description: info?.description ?? '',
                  image: info?.image_url ?? '',
                },
              );
            }}
            style={[Styles.iconContainer, VS.ai_center, VS.jc_center]}>
            <Icons.Share />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
