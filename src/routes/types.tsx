import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

export enum AppRouteEnum {
  MAIN = 'MAIN',
  NewContactModal = 'NewContactModal',
  NewAgreement = 'NewAgreement',
  BrunoStraightStairlift = 'BrunoStraightStairlift',
  ElanTemplate = 'ElanTemplate',
  EliteCRE2110Template = 'EliteCRE2110Template',
  SETTINGS = 'SETTINGS',
}

export type ContactsStackParamList = {
  [AppRouteEnum.NewContactModal]: Partial<{
    itemId: number;
    itemTitle: string;
    parent: string;
  }>;
  [AppRouteEnum.BrunoStraightStairlift]: Partial<{
    parent: string;
  }>;
  [AppRouteEnum.ElanTemplate]: Partial<{
    parent: string;
    itemTitle: string;
  }>;
  [AppRouteEnum.EliteCRE2110Template]: Partial<{
    parent: string;
    itemTitle: string;
  }>;
};

type SettingsStackParamList = {};

type AppStackParamList = ContactsStackParamList & SettingsStackParamList;

export type ContactsNavProps = {
  navigation: StackNavigationProp<
    AppStackParamList,
    AppRouteEnum.NewContactModal
  >;
  route: RouteProp<AppStackParamList, AppRouteEnum.NewContactModal>;
};
