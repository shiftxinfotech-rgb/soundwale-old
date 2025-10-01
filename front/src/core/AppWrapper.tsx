import {persistedStore, store} from '@features';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {SnackbarProvider} from '@providers';
import * as Sentry from '@sentry/react-native';
import {ApiConstants} from '@services';
import {VS} from '@theme';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import {Provider as StoreProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import '../locale';

import NotificationWrapper from './NotificationWrapper';
Sentry.init({
  dsn: ApiConstants.SENTRY_URL,
  sendDefaultPii: true,
});

const AppWrapper = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <KeyboardProvider>
        <GestureHandlerRootView style={[VS.flex_1]}>
          <StoreProvider store={store}>
            <PersistGate persistor={persistedStore}>
              <SnackbarProvider>
                <BottomSheetModalProvider>
                  <NotificationWrapper />
                </BottomSheetModalProvider>
              </SnackbarProvider>
            </PersistGate>
          </StoreProvider>
        </GestureHandlerRootView>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
};

export default Sentry.wrap(AppWrapper);
