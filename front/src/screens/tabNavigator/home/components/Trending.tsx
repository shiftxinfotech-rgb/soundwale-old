import {TopPicksData} from '@data';
import {VS} from '@theme';
import React from 'react';
import {View} from 'react-native';
import HeaderWithViewAll from '../../components/HeaderWithViewAll';
import TrendingCard from './TrendingCard';

type Props = {
  data: TopPicksData[];
};

export default function Trending({data}: Props) {
  return (
    <View style={[VS.ph_15]}>
      <HeaderWithViewAll
        title={"Look Who's Trending"}
        withRight={false}
        rightTitle={'View All'}
        onPress={() => {}}
      />

      <View style={[VS.fd_row, VS.fw_wrap, VS.gap_15]}>
        {data?.map((el, li) => {
          return <TrendingCard key={li} bean={el} />;
        })}
      </View>
    </View>
  );
}
