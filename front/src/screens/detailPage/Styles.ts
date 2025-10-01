import {Colors} from '@theme';
import {hexToRgbA, Scale} from '@util';
import {StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  divider: {
    height: Scale(25),
    width: Scale(2),
  },
  absoluteBottom: {
    position: 'absolute',
    bottom: Scale(80),
    left: Scale(16),
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: Scale(70),
    right: Scale(16),
    backgroundColor: hexToRgbA(Colors.primary, '0.27'),
    height: Scale(64),
    width: Scale(64),
  },
  roundBorder: {
    borderRadius: Scale(50),
  },
  messageContainer: {
    height: Scale(54),
    width: Scale(54),
  },
});
