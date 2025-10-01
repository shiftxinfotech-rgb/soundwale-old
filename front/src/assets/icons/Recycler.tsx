import {Colors} from '@theme';
import {Scale} from '@util';
import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';
const SvgComponent = ({
  color = Colors.primary,
  size = 18,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={Scale(size)}
    height={Scale(size)}
    fill="none"
    viewBox="0 0 18 18">
    <G clipPath="url(#a)">
      <Path
        fill={color}
        d="M9 5.291a2.64 2.64 0 0 1-2.637-2.637A2.64 2.64 0 0 1 9 .018a2.64 2.64 0 0 1 2.637 2.636A2.64 2.64 0 0 1 9 5.291M.352 15.082a2.64 2.64 0 0 1 .966-3.602 2.636 2.636 0 1 1 2.637 4.567 2.636 2.636 0 0 1-3.603-.965m13.693.965a2.636 2.636 0 1 1 2.637-4.567 2.636 2.636 0 1 1-2.637 4.567M2.155 9.69 1.102 9.63a7.94 7.94 0 0 1 3.565-6.178l.579.882a6.89 6.89 0 0 0-3.091 5.354m13.69 0a6.89 6.89 0 0 0-3.09-5.354l.578-.882a7.94 7.94 0 0 1 3.565 6.178zM9 17.982a7.8 7.8 0 0 1-3.566-.847l.476-.941a6.9 6.9 0 0 0 6.18 0l.476.941A7.8 7.8 0 0 1 9 17.982"
      />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M0 0h18v18H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export {SvgComponent as Recycler};
