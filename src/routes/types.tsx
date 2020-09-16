import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import {
  Contact,
  Agreement,
  Catalog,
  AgreementTemplate,
} from '@root/utils/types';

export enum AppRouteEnum {
  MAIN = 'MAIN',
  NewAgreements = 'NewAgreements',
  MainContacts = 'MainContacts',
  ContactDetails = 'ContactDetails',
  NewContactModal = 'NewContactModal',
  NewAgreement = 'NewAgreement',
  BrunoStraightStairlift = 'BrunoStraightStairlift',
  ElanTemplate = 'ElanTemplate',
  EliteCRE2110Template = 'EliteCRE2110Template',
  SETTINGS = 'SETTINGS',
  TEMPLATES = 'Templates',
  AgreementDetails = 'AgreementDetails',
  ContactAgreementDetails = 'ContactAgreementDetails',
  DashboardAgreementDetails = 'DashboardAgreementDetails',
  AgreementSummary = 'AgreementSummary',
  AgreementsMain = 'AgreementsMain',
  Catalogs = 'Catalogs',
  CatalogDetails = 'CatalogDetails',
}

type TemplatesParamsType = {
  parent: string;
  itemTitle: string;
  contact: Contact;
  template: AgreementTemplate;
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
  [AppRouteEnum.AgreementDetails]: {
    parent?: string;
    itemTitle?: string;
    contact: Contact;
    agreement: Agreement;
  };
  [AppRouteEnum.ContactAgreementDetails]: {
    parent?: string;
    itemTitle?: string;
    contact: Contact;
    agreement: Agreement;
  };
  [AppRouteEnum.DashboardAgreementDetails]: {
    parent?: string;
    itemTitle?: string;
    contact: Contact;
    agreement: Agreement;
  };
  [AppRouteEnum.AgreementSummary]: {
    parent?: string;
    itemTitle?: string;
    agreement: Agreement;
    contact: Contact;
  };
  [AppRouteEnum.AgreementsMain]: {};
  [AppRouteEnum.NewAgreements]: {};
};

export type CatalogsStackParamList = {
  [AppRouteEnum.Catalogs]: {};
  [AppRouteEnum.CatalogDetails]: {
    data: Catalog;
    vendor: string;
  };
};

type SettingsStackParamList = {};

type AppStackParamList = ContactsStackParamList &
  CatalogsStackParamList &
  SettingsStackParamList;

export type AppNavProps<T extends keyof AppStackParamList> = {
  navigation: StackNavigationProp<
    AppStackParamList,
    AppRouteEnum.NewContactModal
  >;
  route: RouteProp<AppStackParamList, T>;
};
