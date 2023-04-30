import React, {useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import NewsScreen from '../screens/DashboardScreen/News';
import TipsScreen from '../screens/DashboardScreen/Tips';
import CustomTabComponent from '../components/CustomUIComponents/CustomTabComponent';
import {navigationRef} from './NavigationService';
import SplashScreen from '../screens/AuthScreen/Splash';
import LoginScreen from '../screens/AuthScreen/Login';
import SettingScreen from '../screens/DashboardScreen/News/Setting';
import ChangePasswordScreen from '../screens/AuthScreen/ChangePassword';
import ChatScreen from '../screens/DashboardScreen/Chat';

import CreateNewsScreen from '../screens/DashboardScreen/News/CreateNews';
import {Dimensions, View} from 'react-native';
import styles from '../assets/styles';

import colors from '../assets/colors';
import {withIAPContext}from "react-native-iap"
import SignUpScreen from '../screens/AuthScreen/SignUp';


const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const Maintack = createNativeStackNavigator();
const TabStack = createBottomTabNavigator();
const {width} = Dimensions.get('window');
// ******************************* Auth STACK SCREEN *******************************
const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator
      initialRouteName="Splash"
      headerMode="none"
      screenOptions={{
        animationTypeForReplace: 'pop',
        animationEnabled: true,
        headerShown: false,
        gestureEnabled: true,
      }}>
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Splash"
        component={SplashScreen}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="Login"
        component={LoginScreen}
      />
      <AuthStack.Screen
        options={{headerShown: false}}
        name="SignUp"
        component={SignUpScreen}
      />
    </AuthStack.Navigator>
  );
};

// ******************************* Tab STACK SCREEN *******************************
const TabStackScreen = () => {
  return (
    <TabStack.Navigator
      initialRouteName="Tips"
      screenOptions={{
        headerMode: 'none',
      }}
      tabBar={props => (
        <View
          style={[
            styles.width(width),
            styles.backgroundColor(colors.tabBottomColor),
          ]}>
          <CustomTabComponent {...props} />
        </View>
      )}>
      <TabStack.Screen
        options={{headerShown: false}}
        name="Tips"
        component={TipsScreen}
      />
      <TabStack.Screen
        options={{headerShown: false}}
        name="News"
        component={NewsScreen}
      />
    </TabStack.Navigator>
  );
};
// ******************************* MainApp STACK SCREEN *******************************
const MainStackScreen = () => {
  return (
    <Maintack.Navigator
      initialRouteName="Setting"
      screenOptions={{
        headerMode: 'none',
      }}>
      <Maintack.Screen
        options={{headerShown: false}}
        name="Setting"
        component={SettingScreen}
      />
      <Maintack.Screen
        options={{headerShown: false}}
        name="ChangePassword"
        component={ChangePasswordScreen}
      />
   

      <Maintack.Screen
        options={{headerShown: false}}
        name="ChatScreen"
        component={ChatScreen}
      />
      <Maintack.Screen
        options={{headerShown: false}}
        name="CreateNewsScreen"
        component={CreateNewsScreen}
      />
    </Maintack.Navigator>
  );
};

// ******************************* Root STACK SCREEN *******************************
const RootNavigator = props => {
  return (
    <AppStack.Navigator
      headerMode="none"
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="AuthStackScreen">
      <AppStack.Screen
        {...props}
        options={{headerShown: false}}
        name="AuthStackScreen"
        component={AuthStackScreen}
      />
      <AppStack.Screen
        {...props}
        options={{headerShown: false}}
        name="MainStackScreen"
        component={MainStackScreen}
      />
      <AppStack.Screen
        {...props}
        name="TabStackScreen"
        options={{headerShown: false}}
        component={TabStackScreen}
      />
    </AppStack.Navigator>
  );
};

const AppNavigator = () => {
  const routeNameRef = useRef();
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() =>
        (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
      }
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;

        if (previousRouteName !== currentRouteName) {
          // await analytics().logScreenView({
          //   screen_name: currentRouteName,
          //   screen_class: currentRouteName,
          // });
          // await analytics().logEvent(currentRouteName);
        }

        routeNameRef.current = currentRouteName;
      }}>
      <RootNavigator />
    </NavigationContainer>
  );
};

export {AppNavigator};
