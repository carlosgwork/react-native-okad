import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

export enum AppRouteEnum {
  MAIN = 'MAIN',
  MainContacts = 'MainContacts',
  ContactDetails = 'ContactDetails',
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
  [AppRouteEnum.MainContacts]: {};
  [AppRouteEnum.ContactDetails]: Partial<{
    parent: string;
    itemTitle: string;
    itemId: number;
  }>;
  [AppRouteEnum.NewAgreement]: Partial<{
    parent: string;
    itemTitle: string;
    itemId: number;
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
