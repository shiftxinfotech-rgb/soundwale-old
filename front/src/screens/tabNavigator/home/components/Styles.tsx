import {Colors} from '@theme';
import {hexToRgbA, Scale, width} from '@util';
import {StyleSheet} from 'react-native';
const CARD_HEIGHT = Scale(136);
const CARD_RADIUS = Scale(18);
const BITE_RADIUS = Scale(30);
export const Styles = StyleSheet.create({
  imageSlider: {
    height: Scale(145),
    width: width - Scale(30),
    borderRadius: Scale(10),
  },
  carouselContainer: {
    height: Scale(145),
    width: '100%',
  },
  relatedPostContainer: {
    width: width * 0.9,
  },
  brandContainer: {
    backgroundColor: hexToRgbA('#FF592B', '0.2'),
    borderRadius: 10,
    width: width * 0.44,
    minHeight: Scale(120),
    overflow: 'hidden',
  },
  topRectangle: {
    width: Scale(45),
    height: Scale(3),
    borderBottomLeftRadius: Scale(10),
    borderBottomRightRadius: Scale(10),
    backgroundColor: '#FF592B',
  },
  brandBg: {
    width: Scale(56),
    height: Scale(56),
    borderRadius: Scale(28),
    backgroundColor: '#FFC9BA',
  },
  brandLogo: {
    height: Scale(50),
    width: Scale(50),
    borderRadius: Scale(25),
    overflow: 'hidden',
  },
  labelMaxWidth: {
    maxWidth: Scale(120),
    marginTop: -5,
  },
  rightView: {
    height: Scale(57),
    width: Scale(57),
    borderTopLeftRadius: Scale(44),
    backgroundColor: hexToRgbA('#FF592B', '0.15'),
    position: 'absolute',
    right: -11,
    bottom: -12,
  },
  adImage: {
    width: Scale(154),
    height: Scale(186),
  },
  addButton: {
    width: Scale(120),
    height: Scale(37),
  },
  topPickImage: {
    width: Scale(80),
    height: Scale(80),
    borderRadius: Scale(10),
  },
  clickNowButton: {
    height: Scale(21),
    borderRadius: Scale(100),
    width: Scale(73),
  },
  container: {
    overflow: 'hidden',
  },
  imageBackground: {
    height: Scale(85),
  },
  getVerifiedBusiness: {
    height: Scale(136),
  },
  getVerifiedToday: {
    position: 'absolute',
    bottom: 3,
    right: Scale(10),
    backgroundColor: Colors.primary,
    width: Scale(145),
    height: Scale(37),
    borderRadius: Scale(15),
  },
  image: {
    borderRadius: Scale(20),
  },
  popularizedCard: {
    backgroundColor: hexToRgbA(Colors.darkPink, '0.98'),
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#000', // for visibility
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    height: CARD_HEIGHT,
    backgroundColor: '#54ccc4',
    borderRadius: CARD_RADIUS,
    overflow: 'hidden',
    position: 'relative',
  },
  bite: {
    position: 'absolute',
    width: Scale(145),
    height: Scale(70),
    borderRadius: BITE_RADIUS,
    backgroundColor: Colors.white, // match wrapper background
    bottom: -BITE_RADIUS / 2,
    right: 0,
  },
  getVerifiedText: {
    width: '70%',
  },
});
