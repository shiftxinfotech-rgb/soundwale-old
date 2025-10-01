import {Colors} from '@theme';
import {hexToRgbA, Scale, width} from '@util';
import {StyleSheet} from 'react-native';

export const Styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    height: Scale(270),
    position: 'relative',
  },
  carouselContainer: {
    width: '100%',
    height: Scale(270),
  },
  paginationContainer: {
    position: 'absolute',
    bottom: Scale(25),
    left: 0,
    right: 0,
  },
  dotStyle: {
    width: Scale(20),
    height: Scale(8),
    borderRadius: Scale(100),
    backgroundColor: Colors.gradientEnd,
  },
  image: {
    overflow: 'hidden',
  },
  backButton: {
    position: 'absolute',
    top: Scale(40),
    left: Scale(16),
    zIndex: 2,
  },
  iconButton: {
    backgroundColor: hexToRgbA(Colors.white, '0.34'),
    borderRadius: Scale(39),
    width: Scale(39),
    height: Scale(39),
  },
  iconRow: {
    position: 'absolute',
    top: Scale(40),
    right: Scale(16),
    zIndex: 2,
  },
  pioneerImageContainer: {
    width: Scale(41),
    height: Scale(41),
  },
  pioneerImage: {
    width: Scale(41),
    height: Scale(41),
  },
  productContainer: {
    position: 'absolute',
    bottom: Scale(30),
    left: 0,
    right: 0,
  },
  statusContainer: {
    borderRadius: Scale(100),
  },
  budgetContainer: {
    position: 'absolute',
    right: 0,
    top: -15,
  },
  infoCardContainer: {
    borderRadius: Scale(20),
    marginTop: Scale(-15),
    overflow: 'hidden',
  },
  userImageContainer: {
    width: Scale(49),
    height: Scale(49),
  },
  ratingContainer: {
    backgroundColor: hexToRgbA(Colors.amber, '0.14'),
    borderRadius: Scale(100),
  },
  buttonContainer: {
    borderRadius: Scale(100),
  },
  relatedPostContainer: {
    width: width * 0.9,
  },
});
