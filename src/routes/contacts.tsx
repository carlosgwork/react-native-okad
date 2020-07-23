import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Main from '@root/views/Contacts';
import NewContact from '@root/views/Contacts/New';
import NewAgreement from '@root/views/Contacts/NewAgreement';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

function ContactsStackNavigation() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="MainContacts" component={Main} />
      <Stack.Screen name="NewAgreement" component={NewAgreement} />
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
