import {Colors} from '@theme';
import {Scale} from '@util';
import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const SvgComponent = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={Scale(50)}
    height={Scale(50)}
    fill="none"
    viewBox="0 0 50 50">
    <Circle cx={24.789} cy={24.789} r={24.789} fill={Colors.white} />
    <Path
      stroke={Colors.primary}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 25h21M29 18l7 7-7 7"
    />
  </Svg>
);
export {SvgComponent as CircleArrowRight};
