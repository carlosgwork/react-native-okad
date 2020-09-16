import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Agreements from '@root/views/Agreements';
import AgreementDetails from '@root/views/Agreements/Details';
import AgreementSummary from '@root/views/Agreements/Details/summary';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function AgreementsStackNavigation() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Agreements" component={Agreements} />
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
        name="AgreementRoutes"
        component={AgreementsStackNavigation}
        options={{headerShown: false}}
      />
      <RootStack.Screen name="AgreementDetails" component={AgreementDetails} />
      <RootStack.Screen name="AgreementSummary" component={AgreementSummary} />
    </RootStack.Navigator>
  );
}
