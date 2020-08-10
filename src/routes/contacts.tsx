import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Main from '@root/views/Contacts';
import NewContact from '@root/views/Contacts/New';
import ContactDetails from '@root/views/Contacts/Details';
import NewAgreement from '@root/views/Contacts/NewAgreement';
import AgreementDetails from '@root/views/Agreements/Details';
import AgreementSummary from '@root/views/Agreements/Details/summary';
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
      <Stack.Screen name="AgreementDetails" component={AgreementDetails} />
      <Stack.Screen name="AgreementSummary" component={AgreementSummary} />
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

export default function RootStackScreen() {
  return (
    <RootStack.Navigator mode="modal" headerMode="none">
      <RootStack.Screen
        name="Main"
        component={ContactsStackNavigation}
        options={{headerShown: false}}
      />
      <RootStack.Screen name="NewContactModal" component={NewContact} />
    </RootStack.Navigator>
  );
}
