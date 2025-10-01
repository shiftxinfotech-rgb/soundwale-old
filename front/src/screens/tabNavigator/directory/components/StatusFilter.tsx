import {Icons} from '@assets';
import {ComponentStyles, Text} from '@components';
import {StatusList} from '@data';
import {Colors, CommonStyle, TS, VS} from '@theme';
import {Scale, statusData} from '@util';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import ItemView from './ItemView';
import {Styles} from './Styles';

type StatusItemProps = {
  onPressItem: (item: StatusList) => void;
  selectedStatus: StatusList;
  onClose: () => void;
};

export default function StatusFilter({
  onPressItem,
  selectedStatus,
  onClose,
}: StatusItemProps) {
  const {t} = useTranslation('directory');
  return (
    <View>
      <View
        style={[
          VS.fd_row,
          VS.ai_center,
          VS.pv_17,
          VS.ph_21,
          VS.jc_space_between,
          CommonStyle.bgPrimary,
          ComponentStyles.modalHeader,
          Styles.supplierTypeHeader,
        ]}>
        <Text
          fontWeight="bold"
          style={[TS.fs_18, CommonStyle.textWhite, TS.lh_22]}>
          {t('status')}
        </Text>
        <TouchableOpacity
          hitSlop={{top: 20, left: 20, right: 20, bottom: 20}}
          onPress={onClose}
          activeOpacity={0.8}>
          <Icons.Close color={Colors.white} size={Scale(16)} />
        </TouchableOpacity>
      </View>

      <View style={[VS.pv_8]}>
        {statusData.map((item, index) => {
          return (
            <ItemView
              key={index}
              isSelected={selectedStatus && selectedStatus.value === item.value}
              title={item.label || ''}
              onPressItem={() => onPressItem(item)}
            />
          );
        })}
      </View>
    </View>
  );
}
