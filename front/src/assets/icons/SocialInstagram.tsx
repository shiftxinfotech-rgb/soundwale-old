import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';
const SvgComponent = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={22}
    height={22}
    fill="none"
    viewBox="0 0 22 22">
    <G fill="#54C8B9" clipPath="url(#a)">
      <Path d="M16.5 0h-11C2.42 0 0 2.42 0 5.5v11C0 19.58 2.42 22 5.5 22h11c3.08 0 5.5-2.42 5.5-5.5v-11C22 2.42 19.58 0 16.5 0m3.3 16.5c0 1.87-1.43 3.3-3.3 3.3h-11c-1.87 0-3.3-1.43-3.3-3.3v-11c0-1.87 1.43-3.3 3.3-3.3h11c1.87 0 3.3 1.43 3.3 3.3z" />
      <Path d="M11 5.5c-3.08 0-5.5 2.42-5.5 5.5s2.42 5.5 5.5 5.5 5.5-2.42 5.5-5.5-2.42-5.5-5.5-5.5m0 8.8c-1.87 0-3.3-1.43-3.3-3.3S9.13 7.7 11 7.7s3.3 1.43 3.3 3.3-1.43 3.3-3.3 3.3M16.5 6.6a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h22v22H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export {SvgComponent as SocialInstagram};
