import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Splash from '@views/Splash'

import Login from '@views/Login'

import { useBackHandler } from '@global/Hooks'
import { setAction } from '@redux/actions'

import { MainTabRoutes } from './main'
// Gets the current screen from navigation state
const getActiveRouteName = (state: { [key: string]: any }) => {
  const route = state.routes[state.index]
  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state)
  }
  return route.name
}

const SplashStack = createStackNavigator()
function SplashRoutes() {  
  return (
    <SplashStack.Navigator
      initialRouteName='Splash'
      headerMode='none'
    >
      <SplashStack.Screen
        name='Splash'
        component={Splash}
        options={{
          gestureEnabled: false
        }}
      />
    </SplashStack.Navigator>
  )
}

const AuthStack = createStackNavigator()
function AuthRoutes() {
  return (
    <AuthStack.Navigator
      initialRouteName='Login'
      headerMode='none'
    >
      <AuthStack.Screen
        name='Login'
        component={Login}
      />
    </AuthStack.Navigator>
  )
}


const Stack = createStackNavigator()
export default function Routes() {
  const routeNameRef = React.useRef()
  useBackHandler()
  return (
    <NavigationContainer
      onStateChange={async (state) => {
        const previousScreen = routeNameRef.current
        const currentScreen = getActiveRouteName(state)
        if (previousScreen !== currentScreen) {
          setAction('screens', { currentScreen, previousScreen })
        }
        routeNameRef.current = currentScreen
      }}>
      <Stack.Navigator
        initialRouteName='Splash'
        headerMode='none'
      >
        <Stack.Screen
          name='Splash'
          component={SplashRoutes}
        />
        <Stack.Screen
          name='Auth'
          component={AuthRoutes}
        />
        <Stack.Screen
          name='Main'
          component={MainTabRoutes}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
