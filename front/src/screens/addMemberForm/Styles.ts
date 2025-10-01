import {Colors} from '@theme';
import {Scale} from '@util';
import {StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  descriptionInput: {
    height: Scale(82),
    textAlignVertical: 'top',
  },
  primaryText: {
    color: Colors.primary,
  },
  placeholderText: {
    color: Colors.dimGray,
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,

    right: 10,
    bottom: 0,
  },

  dimGrayText: {
    color: Colors.dimGray,
  },
  locationContainer: {
    maxHeight: Scale(150),
  },
  checkbox: {
    width: Scale(20),
    height: Scale(20),
    borderColor: Colors.primary,
  },
  checkedBox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
