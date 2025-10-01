import {SafeAreaView} from 'react-native-safe-area-context';
import React from 'react';
import {AppStyle, CommonStyle} from '@theme';

const DrawerSceneWrapper = ({children}: {children: React.ReactNode}) => {
  return (
    <SafeAreaView
      edges={['left', 'right']}
      style={[AppStyle.fullSize, CommonStyle.bgWhite]}>
      {children}
    </SafeAreaView>
  );
};
export {DrawerSceneWrapper};
