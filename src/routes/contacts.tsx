import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Main from '@root/views/Contacts';
import NewContact from '@root/views/Contacts/New';

const Stack = createStackNavigator();

export default function Contacts() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="MainContacts" component={Main} />
      <Stack.Screen name="NewContact" component={NewContact} />
    </Stack.Navigator>
  );
}
