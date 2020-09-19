import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Main from '@root/views/Contacts';
import NewContact from '@root/views/Contacts/New';
import ContactDetails from '@root/views/Contacts/Details';
import AgreementDetails from '@root/views/Agreements/Details';
import CatalogDetails from '@root/views/Catalogs/Details';
import AgreementSummary from '@root/views/Agreements/Details/summary';

import NewAgreement from '@root/views/Agreements/New';
import BrunoStraightStairlift from '@root/views/Agreements/Templates/BrunoStraightStairlift';
import BrunoCustomStairlift from '@root/views/Agreements/Templates/BrunoCustomStairlift';
import ElanTemplate from '@root/views/Agreements/Templates/BrunoStraightStairlift/Elan';
import EliteCRE2110Template from '@root/views/Agreements/Templates/BrunoCustomStairlift/EliteCRE2110';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function ContactsStackNavigation() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="MainContacts" component={Main} />
      <Stack.Screen name="ContactDetails" component={ContactDetails} />
      <Stack.Screen name="NewAgreement" component={NewAgreement} />
      <Stack.Screen
        name="BrunoStraightStairlift"
        component={BrunoStraightStairlift}
      />
      <Stack.Screen
        name="BrunoCustomStairlift"
        component={BrunoCustomStairlift}
      />
      <Stack.Screen name="ElanTemplate" component={ElanTemplate} />
      <Stack.Screen
        name="EliteCRE2110Template"
        component={EliteCRE2110Template}
      />
    </Stack.Navigator>
  );
}

type NavigationProps = {
  navigation: any;
  route: any;
};

export default function RootStackScreen({navigation, route}: NavigationProps) {
  if (route.state && route.state.index > 0) {
    navigation.setOptions({
      tabBarVisible: false,
    });
  } else if (
    route.state.routes &&
    route.state.routes[0].state &&
    route.state.routes[0].state.index > 1
  ) {
    navigation.setOptions({
      tabBarVisible: false,
    });
  } else {
    navigation.setOptions({
      tabBarVisible: true,
    });
  }
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
        name="ContactRoutes"
        component={ContactsStackNavigation}
        options={{headerShown: false}}
      />
      <RootStack.Screen name="NewContactModal" component={NewContact} />
      <RootStack.Screen name="CatalogDetails" component={CatalogDetails} />
      <RootStack.Screen
        name="ContactAgreementDetails"
        component={AgreementDetails}
      />
      <RootStack.Screen name="AgreementSummary" component={AgreementSummary} />
    </RootStack.Navigator>
  );
}
