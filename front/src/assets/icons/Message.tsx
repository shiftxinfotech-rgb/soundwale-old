import {Colors} from '@theme';
import {Scale} from '@util';
import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';
const SvgComponent = ({
  color = Colors.white,
  size = 34,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={Scale(size)}
    height={Scale(size)}
    fill="none"
    viewBox="0 0 34 34">
    <G fill={color} clipPath="url(#a)">
      <Path d="M23.318 2.538H4.232A3.736 3.736 0 0 0 .5 6.27v16.726c0 .792.896 1.238 1.528.787l5.316-3.793c.446-.318.97-.486 1.518-.486h11.691a3.736 3.736 0 0 0 3.732-3.732V3.505a.967.967 0 0 0-.967-.967M18.622 14.25H7.452a.967.967 0 1 1 0-1.934h11.17a.967.967 0 0 1 0 1.934m0-4.512H7.452a.967.967 0 1 1 0-1.933h11.17a.967.967 0 0 1 0 1.933" />
      <Path d="M33.5 13.77v16.724a.967.967 0 0 1-1.528.787l-5.316-3.792a2.6 2.6 0 0 0-1.518-.486H13.447a3.736 3.736 0 0 1-3.732-3.732v-1.833h10.838a5.67 5.67 0 0 0 5.666-5.666v-5.735h3.55a3.736 3.736 0 0 1 3.731 3.732" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill={color} d="M.5.5h33v33H.5z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export {SvgComponent as Message};
