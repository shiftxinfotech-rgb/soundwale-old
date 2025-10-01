import {createDrawerNavigator} from '@react-navigation/drawer';
import React from 'react';

import {CustomDrawer} from '@components';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Platform, View} from 'react-native';
import {VS} from '../theme';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerContent = (props: any) => {
  return <CustomDrawer {...props} />;
};

const Screens = () => {
  return (
    // <DrawerSceneWrapper>
    <Stack.Navigator>
      <Stack.Screen name="TabNavigator" options={{headerShown: false}}>
        {() => <TabNavigator />}
      </Stack.Screen>
    </Stack.Navigator>
    // </DrawerSceneWrapper>
  );
};

const DrawerNavigator = () => {
  return (
    <View style={[VS.flex_1]}>
      <Drawer.Navigator
        drawerContent={DrawerContent}
        screenOptions={{
          headerShown: false,
          drawerActiveBackgroundColor: 'transparent',
          drawerInactiveBackgroundColor: 'transparent',
          drawerActiveTintColor: 'transparent',
          drawerInactiveTintColor: 'transparent',
          drawerHideStatusBarOnOpen: Platform.OS === 'ios' ? false : false,
          overlayColor: 'rgba(0, 0, 0, 0.1)',
          drawerStyle: {
            width: '80%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            height: '100%',
          },
        }}>
        <Drawer.Screen
          name="DrawerNav"
          component={Screens}
          options={{drawerLabel: 'TabNavigator', headerShown: false}}
        />
      </Drawer.Navigator>
    </View>
  );
};

export default DrawerNavigator;
