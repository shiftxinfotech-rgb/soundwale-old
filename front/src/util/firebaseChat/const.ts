import {DEV_URL} from '@env';
import {ApiConstants} from '@services';

export const isDev = () => {
  if (ApiConstants.BASE_URL === DEV_URL) {
    return true;
  }
  return false;
};
