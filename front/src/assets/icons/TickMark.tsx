import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SvgComponent = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={21}
    height={16}
    fill="none"
    viewBox="0 0 21 16">
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={2}
      d="M19.756 1.756 7.092 14.419 1.336 8.664"
    />
  </Svg>
);
export {SvgComponent as TickMark};
