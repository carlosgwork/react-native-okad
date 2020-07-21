import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';

import Home from '@root/views/Dashboard';
import ContactsRoutes from './contacts';
import Agreements from '@root/views/Agreements';
import Catalog from '@root/views/Catalogs';

const MainTab = createBottomTabNavigator();
import {useTheme} from '@global/Hooks';
export function MainTabRoutes() {
  const {themeStyle} = useTheme();

  return (
    <MainTab.Navigator
      initialRouteName="Contacts"
      screenOptions={({route}) => ({
        tabBarIcon: ({color}) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'ios-home';
              break;
            case 'Contacts':
              iconName = 'ios-people';
              break;
            case 'Agreements':
              iconName = 'ios-document';
              break;
            case 'Catalog':
              iconName = 'ios-pricetags';
              break;
            default:
              iconName = 'ios-people';
          }
          return (
            <Icon name={iconName} type="ionicon" color={color} size={26} />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: themeStyle.purple,
        inactiveTintColor: themeStyle.gray,
        labelStyle: {
          fontSize: 16,
          letterSpacing: 0.5,
          paddingVertical: 5,
        },
      }}>
      <MainTab.Screen name="Home" component={Home} />
      <MainTab.Screen name="Contacts" component={ContactsRoutes} />
      <MainTab.Screen name="Agreements" component={Agreements} />
      <MainTab.Screen name="Catalog" component={Catalog} />
    </MainTab.Navigator>
  );
}
