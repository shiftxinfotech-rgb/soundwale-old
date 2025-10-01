import {GenericFlatList, ProgressImage} from '@components';
import {TopPicksData} from '@data';
import {AppStyle, VS} from '@theme';
import React, {useCallback} from 'react';
import {TouchableOpacity, View} from 'react-native';
import HeaderWithViewAll from '../../components/HeaderWithViewAll';
import {Styles} from './Styles';

type Props = {
  data: TopPicksData[];
};

export default function TopPick({data}: Props) {
  const _renderTopPick = useCallback(
    ({item, index}: {item: TopPicksData; index: number}) => {
      return (
        <TouchableOpacity
          key={index}
          activeOpacity={0.9}
          style={[Styles.topPickImage, VS.ai_center]}>
          <ProgressImage
            source={{uri: item.image_url}}
            mode="cover"
            containerStyle={[AppStyle.fullSize]}
          />
        </TouchableOpacity>
      );
    },
    [],
  );

  return (
    <View style={[VS.mh_15]}>
      <HeaderWithViewAll
        title={'Our Top Pick'}
        withRight={false}
        rightTitle={'View All'}
        onPress={() => {}}
      />
      <GenericFlatList
        horizontal
        data={data ?? []}
        contentContainerStyle={[VS.gap_15, VS.mb_15]}
        renderItem={_renderTopPick}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
}
