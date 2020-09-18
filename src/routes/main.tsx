import * as React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import CustomIcon from '@components/CustomIcon';

import ContactsRoutes from './contacts';
import CatalogsRoutes from './catalogs';
import AgreementsRoutes from './agreements';
import DashboardRoutes from './dashboard';
import {useTheme} from '@global/Hooks';

const MainTab = createBottomTabNavigator();
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
              return (
                <Icon name={iconName} type="ionicon" color={color} size={24} />
              );
            case 'Contacts':
              iconName = 'ios-people';
              return (
                <Icon name={iconName} type="ionicon" color={color} size={26} />
              );
            case 'Agreements':
              return (
                <CustomIcon name="agreements-glyph" size={26} color={color} />
              );
            case 'Catalog':
              return (
                <CustomIcon name="catalog-glyph" size={24} color={color} />
              );
            default:
              return (
                <Icon
                  name={'ios-people'}
                  type="ionicon"
                  color={color}
                  size={26}
                />
              );
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: themeStyle.textLightPurple,
        inactiveTintColor: themeStyle.gray,
        labelStyle: {
          fontSize: 13,
          fontFamily: 'Metropolis-Medium',
          letterSpacing: 0.5,
          paddingVertical: 5,
        },
        style: {
          backgroundColor: 'rgb(249, 249, 249)',
        },
      }}>
      <MainTab.Screen name="Home" component={DashboardRoutes} />
      <MainTab.Screen name="Contacts" component={ContactsRoutes} />
      <MainTab.Screen name="Agreements" component={AgreementsRoutes} />
      <MainTab.Screen name="Catalog" component={CatalogsRoutes} />
    </MainTab.Navigator>
  );
}
