import {Scale} from '@util';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SvgComponent = ({
  height = 24,
  width = 24,
}: {
  height?: number;
  width?: number;
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={Scale(width)}
    height={Scale(height)}
    fill="none"
    viewBox="0 0 24 24">
    <Path
      fill="#fff"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6"
    />
    <Path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"
    />
  </Svg>
);
export {SvgComponent as ShortShare};
