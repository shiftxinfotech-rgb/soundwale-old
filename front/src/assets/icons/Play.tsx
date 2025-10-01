import {Scale} from '@util';
import * as React from 'react';
import Svg, {G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const SVGComponent = ({color = 'white'}) => (
  <Svg
    width={Scale(14)}
    height={Scale(14)}
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <G clipPath="url(#clip0_229_11076)">
      <Path
        d="M2.9781 0.308689C1.71592 -0.415315 0.692627 0.177798 0.692627 1.63238V12.3666C0.692627 13.8226 1.71592 14.415 2.9781 13.6917L12.3603 8.31101C13.6229 7.58675 13.6229 6.41334 12.3603 5.68925L2.9781 0.308689Z"
        fill={color}
      />
    </G>
    <Defs>
      <ClipPath id="clip0_229_11076">
        <Rect width={14} height={14} fill={color} />
      </ClipPath>
    </Defs>
  </Svg>
);
export {SVGComponent as Play};
