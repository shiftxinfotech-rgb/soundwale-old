import {TabTitleItem, Text} from '@components';
import {Category} from '@data';

import {TS, VS} from '@theme';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';

type ProductTypeProps = {
  onSelect: (id: string) => void;
  productTypeData: Category[];
  selectedType: number;
};
export default function ProductType({
  onSelect,
  productTypeData,
  selectedType,
}: ProductTypeProps) {
  const {t} = useTranslation('tabNavigator');

  return (
    <View style={[VS.mt_15, VS.ph_15, VS.fd_row, VS.gap_10]}>
      <Text style={[VS.flex_1, TS.fs_15, TS.tt_capitalize]} fontWeight="bold">
        {t('productType')}
      </Text>
      {productTypeData?.map((item, index) => {
        return (
          <View style={[VS.flex_1]} key={index}>
            <TabTitleItem
              key={index}
              title={item.name ?? ''}
              isSelected={selectedType === item.id}
              onPress={() => {
                if (selectedType === item?.id) {
                  onSelect('');
                } else {
                  onSelect(item?.id?.toString() ?? '');
                }
              }}
            />
          </View>
        );
      })}
    </View>
  );
}
