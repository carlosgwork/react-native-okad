import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';

import Home from '@root/views/Home';
import Contacts from '@root/views/Contacts';
import Agreements from '@root/views/Agreements';
import Catalog from '@root/views/Catalogs';

const MainTab = createBottomTabNavigator();
import {useTheme} from '@global/Hooks';
export function MainTabRoutes() {
  const {themeStyle} = useTheme();

  return (
    <MainTab.Navigator
      initialRouteName="Contacts"
      headerMode="none"
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          let iconName;

          iconName = 'ios-home';
          if (route.name === 'Home') {
            // iconName = focused
            //   ? 'ios-information-circle'
            //   : 'ios-information-circle-outline'
          } else if (route.name === 'Settings') {
          }

          return <Icon name={iconName} type="ionicon" color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: themeStyle.purple,
        inactiveTintColor: themeStyle.gray,
      }}>
      <MainTab.Screen name="Home" component={Home} />
      <MainTab.Screen name="Contacts" component={Contacts} />
      <MainTab.Screen name="Agreements" component={Agreements} />
      <MainTab.Screen name="Catalog" component={Catalog} />
    </MainTab.Navigator>
  );
}
