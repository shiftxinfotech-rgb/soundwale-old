import * as React from 'react';
import Svg, {Circle, G, Path, Defs, ClipPath, Rect} from 'react-native-svg';
const SVGComponent = () => (
  <Svg
    width={45}
    height={45}
    viewBox="0 0 45 45"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Circle cx={22.5} cy={22.5} r={22.5} fill="#54C8B9" />
    <G clipPath="url(#clip0_101_905)">
      <Path
        d="M28.5 12H17.5C14.42 12 12 14.42 12 17.5V28.5C12 31.58 14.42 34 17.5 34H28.5C31.58 34 34 31.58 34 28.5V17.5C34 14.42 31.58 12 28.5 12ZM31.8 28.5C31.8 30.37 30.37 31.8 28.5 31.8H17.5C15.63 31.8 14.2 30.37 14.2 28.5V17.5C14.2 15.63 15.63 14.2 17.5 14.2H28.5C30.37 14.2 31.8 15.63 31.8 17.5V28.5Z"
        fill="white"
      />
      <Path
        d="M23 17.5C19.92 17.5 17.5 19.92 17.5 23C17.5 26.08 19.92 28.5 23 28.5C26.08 28.5 28.5 26.08 28.5 23C28.5 19.92 26.08 17.5 23 17.5ZM23 26.3C21.13 26.3 19.7 24.87 19.7 23C19.7 21.13 21.13 19.7 23 19.7C24.87 19.7 26.3 21.13 26.3 23C26.3 24.87 24.87 26.3 23 26.3Z"
        fill="white"
      />
      <Path
        d="M28.5 18.6004C29.1075 18.6004 29.6 18.1079 29.6 17.5004C29.6 16.8929 29.1075 16.4004 28.5 16.4004C27.8925 16.4004 27.4 16.8929 27.4 17.5004C27.4 18.1079 27.8925 18.6004 28.5 18.6004Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_101_905">
        <Rect
          width={22}
          height={22}
          fill="white"
          transform="translate(12 12)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export {SVGComponent as RoundInstagram};
