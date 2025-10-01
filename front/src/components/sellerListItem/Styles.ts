import {Colors} from '@theme';
import {hexToRgbA, Scale} from '@util';
import {StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  statusContainer: {
    borderRadius: Scale(100),
    width: '20%',
  },
  profileContainer: {
    width: Scale(42),
    height: Scale(42),
    borderRadius: Scale(42),
  },
  carouselContainer: {
    width: '100%',
    height: Scale(190),
  },
  carouselItem: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  ratingContainer: {
    backgroundColor: hexToRgbA(Colors.amber, '0.14'),
    borderRadius: Scale(100),
  },
  absoluteViewCount: {
    position: 'absolute',
    right: 0,
    top: 12,
    backgroundColor: hexToRgbA(Colors.black, '0.5'),
    // borderRadius: Scale(100),
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  dotStyle: {
    width: Scale(10),
    height: Scale(10),
    borderRadius: Scale(100),
    backgroundColor: Colors.white,
  },
});
