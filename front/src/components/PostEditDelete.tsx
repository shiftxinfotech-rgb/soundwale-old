import {Icons} from '@assets';
import {Text} from '@components';
import {Colors, CommonStyle, TS, VS} from '@theme';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
};

const PostEditDelete = ({onEdit, onDelete}: Props) => (
  <View
    style={[
      VS.fd_row,
      VS.ai_center,
      VS.ph_10,
      VS.pv_10,
      VS.pb_15,
      VS.jc_center,
      VS.gap_10,
    ]}>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onEdit}
      style={[
        VS.flex_1,
        VS.fd_row,
        VS.ai_center,
        VS.jc_center,
        VS.gap_10,
        VS.br_10,
        VS.bw_1,
        VS.pv_10,
        {borderColor: Colors.primary},
      ]}>
      <Icons.Pencil color={Colors.primary} />
      <Text
        fontWeight="quickSandMedium"
        style={[CommonStyle.textPrimary, TS.fs_14]}>
        Edit
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={onDelete}
      activeOpacity={0.8}
      style={[
        VS.flex_1,
        VS.fd_row,
        VS.ai_center,
        VS.jc_center,
        VS.gap_10,
        VS.br_10,
        VS.bw_1,
        VS.pv_10,
        {borderColor: Colors.red},
      ]}>
      <Icons.Delete color={Colors.red} />
      <Text
        fontWeight="quickSandMedium"
        style={[CommonStyle.textRed, TS.fs_14]}>
        {'Delete'}
      </Text>
    </TouchableOpacity>
  </View>
);

export default PostEditDelete;
