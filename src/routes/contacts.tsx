import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Main from '@root/views/Contacts';
import NewAgreement from '@root/views/Contacts/NewAgreement';

const Stack = createStackNavigator();

export default function Contacts() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="MainContacts" component={Main} />
      <Stack.Screen name="NewAgreement" component={NewAgreement} />
    </Stack.Navigator>
  );
}
