import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import NewAgreement from '@root/views/Agreements/New';
import BrunoStraightStairlift from '@root/views/Agreements/Templates/BrunoStraightStairlift';
import BrunoCustomStairlift from '@root/views/Agreements/Templates/BrunoCustomStairlift';
import ElanTemplate from '@root/views/Agreements/Templates/BrunoStraightStairlift/Elan';
import EliteCRE2110Template from '@root/views/Agreements/Templates/BrunoCustomStairlift/EliteCRE2110';

const NewAgreementStack = createStackNavigator();

export default function NewAgreementStackScreen() {
  return (
    <NewAgreementStack.Navigator
      initialRouteName="NewAgreement"
      headerMode="none">
      <NewAgreementStack.Screen name="NewAgreement" component={NewAgreement} />
      <NewAgreementStack.Screen
        name="BrunoStraightStairlift"
        component={BrunoStraightStairlift}
      />
      <NewAgreementStack.Screen
        name="BrunoCustomStairlift"
        component={BrunoCustomStairlift}
      />
      <NewAgreementStack.Screen name="ElanTemplate" component={ElanTemplate} />
      <NewAgreementStack.Screen
        name="EliteCRE2110Template"
        component={EliteCRE2110Template}
      />
    </NewAgreementStack.Navigator>
  );
}
