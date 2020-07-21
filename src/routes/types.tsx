import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

export enum AppRouteEnum {
  MAIN = 'MAIN',
  NewContact = 'NewContact',
  SETTINGS = 'SETTINGS',
}

type ContactsStackParamList = {
  [AppRouteEnum.NewContact]: undefined;
};

type SettingsStackParamList = {};

type AppStackParamList = ContactsStackParamList & SettingsStackParamList;

export type ContactsProps = {
  navigation: StackNavigationProp<AppStackParamList, AppRouteEnum.NewContact>;
  route: RouteProp<AppStackParamList, AppRouteEnum.NewContact>;
};
