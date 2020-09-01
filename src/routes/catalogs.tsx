import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';

import Catalogs from '@root/views/Catalogs';
import CatalogDetails from '@root/views/Catalogs/Details';

const RootStack = createStackNavigator();

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
      <RootStack.Screen name="MainCatalogs" component={Catalogs} />
      <RootStack.Screen name="CatalogDetails" component={CatalogDetails} />
    </RootStack.Navigator>
  );
}
