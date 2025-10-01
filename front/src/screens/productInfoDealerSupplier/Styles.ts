import {Colors} from '@theme';
import {hexToRgbA, Scale} from '@util';
import {StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  shopImageDelete: {
    backgroundColor: hexToRgbA(Colors.primary, '0.6'),
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{translateX: -Scale(14)}],
    width: Scale(28),
    height: Scale(28),
    borderTopLeftRadius: Scale(50),
    borderTopRightRadius: Scale(50),
  },
  descriptionInput: {
    height: Scale(82),
    textAlignVertical: 'top',
  },
  shopImageContainer: {
    width: Scale(107),
    height: Scale(94),
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,

    right: 10,
    bottom: 0,
  },
  primaryText: {
    color: Colors.primary,
  },
});
