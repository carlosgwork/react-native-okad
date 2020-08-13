import * as React from 'react';
import {NavigationContainer, NavigationState} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import Splash from '@root/views/Splash';
import Login from '@root/views/Login';

import {useBackHandler} from '@global/Hooks';

import {MainTabRoutes} from './main';

// Gets the current screen from navigation state
const getActiveRouteName = (state: NavigationState): string | undefined => {
  const route = state.routes[state.index];
  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state as NavigationState);
  }
  return route.name;
};

const SplashStack = createStackNavigator();
function SplashRoutes() {
  return (
    <SplashStack.Navigator initialRouteName="Splash" headerMode="none">
      <SplashStack.Screen
        name="Splash"
        component={Splash}
        options={{
          gestureEnabled: false,
        }}
      />
    </SplashStack.Navigator>
  );
}

const AuthStack = createStackNavigator();
function AuthRoutes() {
  return (
    <AuthStack.Navigator initialRouteName="Login" headerMode="none">
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
}

const Stack = createStackNavigator();
export default function Routes() {
  const routeNameRef = React.useRef<string>();
  useBackHandler();
  return (
    <NavigationContainer
      onStateChange={async (state) => {
        const currentScreen = getActiveRouteName(state as NavigationState);
        routeNameRef.current = currentScreen;
      }}>
      <Stack.Navigator initialRouteName="Splash" headerMode="none">
        <Stack.Screen name="Splash" component={SplashRoutes} />
        <Stack.Screen name="Auth" component={AuthRoutes} />
        <Stack.Screen name="Main" component={MainTabRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
