import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Main from '@root/views/Contacts';
import NewContact from '@root/views/Contacts/New';
import ContactDetails from '@root/views/Contacts/Details';
import AgreementDetails from '@root/views/Agreements/Details';
import AgreementSummary from '@root/views/Agreements/Details/summary';
import CatalogDetails from '@root/views/Catalogs/Details';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function ContactsStackNavigation() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="MainContacts" component={Main} />
      <Stack.Screen name="ContactDetails" component={ContactDetails} />
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
        name="ContactRoutes"
        component={ContactsStackNavigation}
        options={{headerShown: false}}
      />
      <RootStack.Screen name="NewContactModal" component={NewContact} />
      <RootStack.Screen name="CatalogDetails" component={CatalogDetails} />
      <RootStack.Screen name="AgreementDetails" component={AgreementDetails} />
      <RootStack.Screen name="AgreementSummary" component={AgreementSummary} />
    </RootStack.Navigator>
  );
}
