import {ProgressImage} from '@components';
import {SliderDatum} from '@data';
import {AppStyle, VS} from '@theme';
import {Scale, width} from '@util';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {Styles} from './Styles';

type Props = {
  slider: SliderDatum[];
};

export default function ImageSlider({slider}: Props) {
  const _renderCarouselItem = useCallback(
    ({item, index}: {item: SliderDatum; index: number}) => {
      return (
        <View
          key={index}
          style={[
            Styles.imageSlider,
            AppStyle.hideOverFlow,
            VS.ai_center,
            VS.as_center,
          ]}>
          <ProgressImage
            source={{uri: item.image_url}}
            containerStyle={[AppStyle.fullSize, VS.br_15]}
            mode={'cover'}
          />
        </View>
      );
    },
    [],
  );

  return (
    <View style={[Styles.carouselContainer]}>
      <Carousel
        loop={false}
        autoPlay={false}
        autoPlayInterval={5000}
        pagingEnabled={true}
        width={width}
        height={Scale(145)}
        data={slider ?? []}
        renderItem={_renderCarouselItem}
        style={{width: width}}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.97,
          parallaxScrollingOffset: 58,
          parallaxAdjacentItemScale: 0.87,
        }}
        // inactiveSlideOpacity={1}
        // inactiveSlideScale={1}
        // lockScrollWhileSnapping={true}
        // enableMomentum={false}
        // decelerationRate={0.25}
      />
    </View>
  );
}
