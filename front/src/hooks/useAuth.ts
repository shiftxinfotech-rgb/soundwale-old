import {AuthData} from '@data';
import {getIsLogin, getUserInfo} from '@features';
import {shallowEqual, useSelector} from 'react-redux';

export const useAuthStatus = () => {
  return useSelector(getIsLogin, shallowEqual);
};

export const useUserId = (): string | undefined => {
  const user = useUserInfo();
  return user?.id?.toString();
};
export const useUserInfo = (): AuthData | undefined => {
  return useSelector(getUserInfo, shallowEqual);
};
