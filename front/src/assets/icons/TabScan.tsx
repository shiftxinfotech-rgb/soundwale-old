import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SvgComponent = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={25}
    height={24}
    fill="none"
    viewBox="0 0 25 24">
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={2}
      d="M4.167 12h16.666"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.5 2h5v5M7.5 2h-5v5M7.5 22h-5v-5M17.5 22h5v-5"
    />
  </Svg>
);
export {SvgComponent as TabScan};
