import {ProductBean} from '@data';
import {VS} from '@theme';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import HeaderWithViewAll from '../../components/HeaderWithViewAll';
import {BuyerItem, GenericFlatList} from '@components';
import {Styles} from './Styles';

import {useNavigation} from '@react-navigation/native';

type Props = {
  data: ProductBean[];
};

export default function RecentRequirement({data}: Props) {
  const navigation = useNavigation();
  const _renderRecentRequirement = useCallback(
    ({item, index}: {item: ProductBean; index: number}) => {
      return (
        <BuyerItem
          key={index}
          productBean={item}
          containerStyle={[Styles.relatedPostContainer, VS.mt_0, VS.mh_0]}
        />
      );
    },
    [],
  );
  return (
    <View style={[VS.mt_15, VS.ph_15]}>
      <HeaderWithViewAll
        title={'Recent Requirements'}
        withRight={true}
        rightTitle={'View All'}
        onPress={() => {
          navigation.navigate('Buyers');
        }}
      />

      <GenericFlatList
        horizontal
        data={data ?? []}
        contentContainerStyle={[VS.gap_15, VS.mb_15]}
        renderItem={_renderRecentRequirement}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}
