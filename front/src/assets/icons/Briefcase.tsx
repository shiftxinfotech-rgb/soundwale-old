import {Colors} from '@theme';
import {Scale} from '@util';
import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const SvgComponent = ({
  color = Colors.white,
  size = 32,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={Scale(size)}
    height={Scale(size)}
    fill="none"
    viewBox="0 0 32 32">
    <Circle cx={16} cy={16} r={16} fill="#38B87C" />
    <Path fill={color} d="M15.006 15.969h2.988v.996h-2.988z" />
    <Path
      fill={color}
      d="M21.792 16.965H18.99v.498a.5.5 0 0 1-.498.498h-3.984a.5.5 0 0 1-.498-.498v-.498h-2.802a1.49 1.49 0 0 1-1.417-1.021L8 10.57v10.877c0 .824.67 1.495 1.494 1.495h14.012c.824 0 1.494-.67 1.494-1.495V10.571l-1.79 5.373a1.49 1.49 0 0 1-1.418 1.02"
    />
    <Path
      fill={color}
      d="M18.492 8h-3.984c-.824 0-1.494.67-1.494 1.494v.498H8.857l1.878 5.636a.5.5 0 0 0 .473.34h2.802v-.497c0-.276.223-.498.498-.498h3.984c.275 0 .498.222.498.498v.498h2.802a.5.5 0 0 0 .473-.34l1.878-5.637h-4.157v-.498c0-.824-.67-1.494-1.494-1.494M14.01 9.992v-.498c0-.275.223-.498.498-.498h3.984c.275 0 .498.223.498.498v.498z"
    />
  </Svg>
);
export {SvgComponent as Briefcase};
