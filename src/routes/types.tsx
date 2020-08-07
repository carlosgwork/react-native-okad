import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {Contact} from '@root/utils/types';

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
  TEMPLATES = 'Templates',
}

type TemplatesParamsType = {
  parent: string;
  itemTitle: string;
  contact: Contact;
  templateId: number;
};

export type ContactsStackParamList = {
  [AppRouteEnum.NewContactModal]: Partial<{
    itemId: number;
    itemTitle: string;
    parent: string;
  }>;
  [AppRouteEnum.TEMPLATES]: TemplatesParamsType;
  [AppRouteEnum.MainContacts]: {};
  [AppRouteEnum.ContactDetails]: Partial<{
    parent: string;
    itemTitle: string;
    itemId: number;
  }>;
  [AppRouteEnum.NewAgreement]: {
    parent?: string;
    itemTitle?: string;
    contact: Contact;
  };
};

type SettingsStackParamList = {};

type AppStackParamList = ContactsStackParamList & SettingsStackParamList;

export type ContactsNavProps<T extends keyof AppStackParamList> = {
  navigation: StackNavigationProp<
    AppStackParamList,
    AppRouteEnum.NewContactModal
  >;
  route: RouteProp<AppStackParamList, T>;
};
