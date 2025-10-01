import {Colors} from '@theme';
import {hexToRgbA, Scale} from '@util';
import {StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  downloader: {
    width: Scale(45),
    height: Scale(45),
    borderRadius: Scale(45),
    backgroundColor: hexToRgbA(Colors.primary, '0.2'),
  },
  catalogueImage: {
    height: Scale(87),
    width: Scale(98),
  },
  favoriteContainer: {
    position: 'absolute',
    width: Scale(21),
    height: Scale(21),
    borderRadius: Scale(21),
    backgroundColor: hexToRgbA(Colors.white, '0.34'),
    top: Scale(3),
    right: Scale(3),
  },
});
