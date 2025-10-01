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
      fillRule="evenodd"
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19.071 19.07c-3.055 3.056-7.581 3.717-11.285 2.004-.546-.22-4.085.76-4.853-.007-.767-.768.213-4.307-.007-4.854-1.713-3.702-1.052-8.23 2.004-11.286 3.901-3.903 10.24-3.903 14.141 0 3.91 3.909 3.901 10.241 0 14.143"
      clipRule="evenodd"
    />
    <Path
      stroke="#5D5D5D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M15.94 12.413h.008M11.93 12.413h.01M7.921 12.413h.01"
    />
  </Svg>
);
export {SvgComponent as ShortComment};
