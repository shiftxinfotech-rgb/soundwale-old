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
    <G clipPath="url(#clip0_101_917)">
      <Path
        d="M33.8728 16.4517C33.5919 15.4075 32.7685 14.5843 31.7244 14.3031C29.817 13.7812 22.1872 13.7812 22.1872 13.7812C22.1872 13.7812 14.5577 13.7812 12.6502 14.2834C11.6262 14.5643 10.7829 15.4077 10.502 16.4517C10 18.359 10 22.3145 10 22.3145C10 22.3145 10 26.2898 10.502 28.1772C10.7831 29.2212 11.6062 30.0444 12.6504 30.3256C14.5777 30.8476 22.1875 30.8476 22.1875 30.8476C22.1875 30.8476 29.817 30.8476 31.7244 30.3455C32.7687 30.0645 33.5919 29.2413 33.873 28.1972C34.3748 26.2898 34.3748 22.3345 34.3748 22.3345C34.3748 22.3345 34.3949 18.3589 33.8728 16.4517ZM19.758 25.9686V18.6602L26.1026 22.3144L19.758 25.9686Z"
        fill="white"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_101_917">
        <Rect
          width={26}
          height={26}
          fill="white"
          transform="translate(10 14)"
        />
      </ClipPath>
    </Defs>
  </Svg>
);
export {SVGComponent as RoundYouTube};
