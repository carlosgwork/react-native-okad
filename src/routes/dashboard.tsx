import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Dashboard from '@root/views/Dashboard';
import AgreementDetails from '@root/views/Agreements/Details';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function DashboardStackNavigation() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Dashboard" component={Dashboard} />
    </Stack.Navigator>
  );
}

type NavigationProps = {
  navigation: any;
  route: any;
};

export default function RootStackScreen({navigation, route}: NavigationProps) {
  navigation.setOptions({
    tabBarVisible: route.state ? (route.state.index > 0 ? false : true) : null,
  });
  return (
    <RootStack.Navigator
      mode="modal"
      headerMode="none"
      screenOptions={{
        headerShown: false,
        cardStyle: {backgroundColor: 'transparent'},
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      }}>
      <RootStack.Screen
        name="DashboardRoutes"
        component={DashboardStackNavigation}
        options={{headerShown: false}}
      />
      <RootStack.Screen
        name="DashboardAgreementDetails"
        component={AgreementDetails}
      />
    </RootStack.Navigator>
  );
}
