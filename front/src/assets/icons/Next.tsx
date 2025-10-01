import {Scale} from '@util';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SVGComponent = () => (
  <Svg
    width={Scale(30)}
    height={Scale(30)}
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">
    <Path
      d="M19.7368 25.2632L18.182 26.818C16.4246 28.5754 13.5754 28.5754 11.818 26.818L3.18198 18.182C1.42462 16.4246 1.42462 13.5754 3.18198 11.818L11.818 3.18198C13.5754 1.42462 16.4246 1.42462 18.182 3.18198L26.818 11.818C28.5754 13.5754 28.5754 16.4246 26.818 18.182L23.7281 21.2719"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <Path
      d="M9.10767 15.3812H19.5609C19.6175 15.3812 19.6458 15.4496 19.6058 15.4896L15.6588 19.4366M18.5565 12.7228L16.0609 10.2271"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);
export {SVGComponent as Next};
