import {TabTitleItem} from '@components';
import {AppStyle, VS} from '@theme';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, View} from 'react-native';

type CategoryProps = {
  selectedCategory: number;
  onPress: (id: number) => void;
};
export default function Category({onPress, selectedCategory}: CategoryProps) {
  const {t} = useTranslation(['generic']);
  return (
    <View style={[VS.mt_15, VS.ph_15, VS.fd_row, VS.ai_center, VS.as_center]}>
      <ScrollView
        style={[VS.flex_1]}
        showsHorizontalScrollIndicator={false}
        horizontal
        contentContainerStyle={[
          VS.gap_10,
          VS.ai_center,
          VS.jc_center,
          AppStyle.flexGrow,
          VS.flex_1,
        ]}>
        {[
          {title: t('generic:buyerPost'), id: 1},
          {title: t('generic:sellerPost'), id: 2},
        ].map((item, index) => {
          return (
            <View key={index} style={[VS.flex_1]}>
              <TabTitleItem
                key={index}
                title={item.title}
                isSelected={selectedCategory === item.id}
                onPress={() => onPress(item.id)}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
