/**
 * @format
 */

import {AppWrapper} from '@core';
import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppWrapper);
