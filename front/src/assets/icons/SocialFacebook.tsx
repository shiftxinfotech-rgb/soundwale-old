import {Scale} from '@util';
import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SvgComponent = () => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={Scale(26)}
    height={Scale(26)}
    fill="none"
    viewBox="0 0 26 26">
    <Path
      fill="#54C8B9"
      d="M10.12 14.726H7.546c-.416 0-.546-.156-.546-.546v-3.146c0-.416.156-.546.546-.546h2.574V8.2c0-1.04.182-2.028.702-2.938.546-.936 1.326-1.56 2.314-1.924.65-.234 1.3-.338 2.002-.338h2.548c.364 0 .52.156.52.52v2.964c0 .364-.156.52-.52.52-.702 0-1.404 0-2.106.026-.702 0-1.066.338-1.066 1.066-.026.78 0 1.534 0 2.34h3.016c.416 0 .572.156.572.572v3.146c0 .416-.13.546-.572.546h-3.016v8.476c0 .442-.13.598-.598.598h-3.25c-.39 0-.546-.156-.546-.546z"
    />
  </Svg>
);
export {SvgComponent as SocialFacebook};
