import {NoInternetConnection} from '@components';
import {useNetworkStatus, useUserId, useUserInfo} from '@hooks';
import Navigator from '@navigator';
import {ChatHelper, ChatUnreadCountService, monitorAppState} from '@util';
import React, {useEffect} from 'react';
import '../locale';

const App = () => {
  const {isReachable} = useNetworkStatus();

  const uId = useUserId();
  const userInfo = useUserInfo();

  useEffect(() => {
    if (uId) {
      ChatHelper.setPresence(uId);
      monitorAppState(uId);
      // Start real-time listener for chat unread count
      ChatUnreadCountService.startRealtimeListener(uId);
      if (userInfo) {
        ChatHelper.createUserProfile(userInfo);
      }
    }
  }, [uId, userInfo]);

  return isReachable ? <Navigator /> : <NoInternetConnection />;
};

export default App;
