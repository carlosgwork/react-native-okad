/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {NavigationContainer, NavigationState} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {Alert} from 'react-native';
import {useMutation, useApolloClient} from '@apollo/client';

import Splash from '@root/views/Splash';
import Login from '@root/views/Login';

import {useBackHandler} from '@global/Hooks';

import {MainTabRoutes} from './main';
import {Agreement, LineItemType, Contact} from '@root/utils/types';
import {
  CREATE_AGREEMENT,
  UPDATE_AGREEMENT,
  UPDATE_LINE_ITEM,
  REMOVE_LINE_ITEM,
  ADD_AGREEMENT_EVENT,
  DELETE_AGREEMENT,
  CREATE_LINE_ITEM,
} from '@root/views/Agreements/graphql';
import {CREATE_CONTACT} from '@root/views/Contacts/graphql';
import {setAction} from '@root/redux/actions';
import {
  FETCH_All_AGREEMENTS,
  LOAD_AGREEMENT_TEMPLATES,
} from '@root/views/Agreements/graphql';
import {
  FETCH_ALL_CATALOGS,
  FETCH_ALL_VENDORS,
} from '@root/views/Catalogs/graphql';
import {FETCH_ALL_CONTACTS} from '@root/views/Contacts/graphql';

// Gets the current screen from navigation state
const getActiveRouteName = (state: NavigationState): string | undefined => {
  const route = state.routes[state.index];
  if (route.state) {
    // Dive into nested navigators
    return getActiveRouteName(route.state as NavigationState);
  }
  return route.name;
};

const SplashStack = createStackNavigator();
function SplashRoutes() {
  return (
    <SplashStack.Navigator initialRouteName="Splash" headerMode="none">
      <SplashStack.Screen
        name="Splash"
        component={Splash}
        options={{
          gestureEnabled: false,
        }}
      />
    </SplashStack.Navigator>
  );
}

const AuthStack = createStackNavigator();
function AuthRoutes() {
  return (
    <AuthStack.Navigator initialRouteName="Login" headerMode="none">
      <AuthStack.Screen name="Login" component={Login} />
    </AuthStack.Navigator>
  );
}

const Stack = createStackNavigator();
export default function Routes() {
  const routeNameRef = React.useRef<string>();
  const {
    offline_mutations,
    contacts,
    agreements,
    network,
    isStoreReady,
    userInfo,
    sync,
  } = useSelector((state: any) => ({
    offline_mutations: state.offline_mutations.data,
    contacts: state.contacts.contacts,
    agreements: state.agreements.agreements,
    network: state.network,
    isStoreReady: state._persist ? state._persist.rehydrated : false,
    userInfo: state.user,
    sync: state.sync,
  }));
  const [templatesLoaded, setTemplatesLoaded] = React.useState<boolean>(false);
  const [agreementsLoaded, setAgreementsLoaded] = React.useState<boolean>(
    false,
  );
  const [catalogsLoaded, setCatalogsLoaded] = React.useState<boolean>(false);
  const [contactsLoaded, setContactsLoaded] = React.useState<boolean>(false);
  const [vendorsLoaded, setVendorsLoaded] = React.useState<boolean>(false);
  const [mutationIndex, setMutationIndex] = React.useState<number>(0);

  const [insert_agreement] = useMutation(CREATE_AGREEMENT);
  const [update_agreement] = useMutation(UPDATE_AGREEMENT);
  const [update_line_items] = useMutation(UPDATE_LINE_ITEM);
  const [delete_line_items] = useMutation(REMOVE_LINE_ITEM);
  const [insert_contacts] = useMutation(CREATE_CONTACT);
  const [insert_agreement_events_one] = useMutation(ADD_AGREEMENT_EVENT);
  const [delete_agreements] = useMutation(DELETE_AGREEMENT);
  const [insert_line_items_one] = useMutation(CREATE_LINE_ITEM);

  const client = useApolloClient();

  const startDataSync = () => {
    setTemplatesLoaded(false);
    setAgreementsLoaded(false);
    setCatalogsLoaded(false);
    setContactsLoaded(false);
    setVendorsLoaded(false);

    client.query({query: LOAD_AGREEMENT_TEMPLATES}).then(({data}: any) => {
      setAction('agreement_templates', {
        templates: data.agreement_templates,
      });
      setTemplatesLoaded(true);
    });
    client
      .query({
        query: FETCH_All_AGREEMENTS,
        variables: {
          user_id: userInfo.id,
        },
      })
      .then(({data}: any) => {
        setAction('agreements', {
          agreements: data.agreements,
        });
        setAction('user', {
          lastAgreementNumber: parseInt(data.agreements[0].number, 10),
        });
        setAgreementsLoaded(true);
      });
    client.query({query: FETCH_ALL_CATALOGS}).then(({data}: any) => {
      setAction('catalogs', {
        catalogs: data.catalog_items,
      });
      setCatalogsLoaded(true);
    });
    client.query({query: FETCH_ALL_CONTACTS}).then(({data}: any) => {
      setAction('contacts', {
        contacts: data.contacts,
      });
      setContactsLoaded(true);
    });
    client.query({query: FETCH_ALL_VENDORS}).then(({data}: any) => {
      setAction('vendors', {
        vendors: data.vendors,
      });
      setVendorsLoaded(true);
    });
  };

  let offlineAgreements = agreements ? agreements.slice() : [];
  let offlineContacts = contacts ? contacts.slice() : [];

  React.useEffect(() => {
    if (
      templatesLoaded &&
      agreementsLoaded &&
      contactsLoaded &&
      vendorsLoaded &&
      catalogsLoaded
    ) {
      Alert.alert('Data Synced');
      setAction('sync', {
        status: true,
        loading: false,
      });
      setAction('loading', {state: false});
    }
  }, [
    templatesLoaded,
    agreementsLoaded,
    contactsLoaded,
    vendorsLoaded,
    catalogsLoaded,
  ]);

  const runOfflineMutation = async () => {
    console.log('------- run offline mutation ');
    const mutation = offline_mutations[mutationIndex];
    let data: any;
    if (mutation.type !== 'CREATE_CONTACT') {
      const itemIndex = offlineAgreements.findIndex(
        (ag: Agreement) => ag.id === mutation.itemId,
      );
      if (itemIndex > -1) {
        data = offlineAgreements[itemIndex];
      }
    } else {
      const itemIndex = offlineContacts.findIndex(
        (co: Contact) => co.id === mutation.itemId,
      );
      data = offlineContacts[itemIndex];
    }
    switch (mutation.type) {
      case 'CREATE_AGREEMENT':
        console.log('----------- creating agreement: ');
        const lineItems = data.line_items.map((item: any) => ({
          catalog_item_id: item.catalog_item_id,
          current_cost: item.current_cost,
          price: item.price,
          qty: item.qty,
          taxable: item.taxable,
          discount: item.discount,
        }));
        const result = await insert_agreement({
          variables: {
            billing_address_id: data.billing_address_id,
            agreement_template_id: data.agreement_template_id,
            contact_id: data.contact_id,
            shipping_address_id: data.shipping_address_id,
            line_items: lineItems,
            sales_tax_rate: data.sales_tax_rate,
            number: data.number,
            user_id: data.user_id,
          },
        });
        offlineAgreements = offlineAgreements.map((ag: Agreement) => {
          if (ag.id === mutation.itemId) {
            return Object.assign(
              {},
              result.data.insert_agreements.returning[0],
            );
          }
          return Object.assign({}, ag);
        });
        offlineContacts = offlineContacts.map((ct: Contact) => {
          if (ct.id === data.contact_id) {
            const newCt = Object.assign({}, ct);
            const newCtAgreements = newCt.agreements?.slice() || [];
            const agIndex2 = newCtAgreements.findIndex(
              (ag2: Agreement) => ag2.id === mutation.itemId,
            );
            newCtAgreements[agIndex2] =
              result.data.insert_agreements.returning[0];
            newCt.agreements = newCtAgreements;
            return newCt;
          }
          return Object.assign({}, ct);
        });
        setMutationIndex(mutationIndex + 1);
        break;
      case 'UPDATE_AGREEMENT':
        const updatingAgreement = {
          agreement_template_id: data.agreement_template_id,
          billing_address_id: data.billing_address_id,
          contact_id: data.contact_id,
          last_modified: new Date(),
          number: data.number,
          revision: data.revision,
          sales_tax_rate: data.sales_tax_rate,
          shipping_address_id: data.shipping_address_id,
          signature: data.signature,
        };
        const result3 = await update_agreement({
          variables: {
            _set: updatingAgreement,
            id: data.id,
          },
        });
        offlineAgreements = offlineAgreements.map((ag: Agreement) => {
          if (ag.id === mutation.itemId) {
            return Object.assign(
              {},
              result3.data.update_agreements.returning[0],
            );
          }
          return Object.assign({}, ag);
        });
        offlineContacts = offlineContacts.map((ct: Contact) => {
          if (ct.id === data.contact_id) {
            const newCt = Object.assign({}, ct);
            const newCtAgreements = newCt.agreements?.slice() || [];
            const agIndex2 = newCtAgreements.findIndex(
              (ag2: Agreement) => ag2.id === mutation.itemId,
            );
            newCtAgreements[agIndex2] =
              result3.data.update_agreements.returning[0];
            newCt.agreements = newCtAgreements;
            return newCt;
          }
          return Object.assign({}, ct);
        });
        setMutationIndex(mutationIndex + 1);
        break;
      case 'CREATE_LINEITEM':
        console.log('-------- creating line item');
        const lineItIndex3 = data.line_items.findIndex(
          (lineItem: LineItemType) => lineItem.id === mutation.lineItemId,
        );
        const newLineItem = data.line_items[lineItIndex3];
        const result4 = await insert_line_items_one({
          variables: {
            object: {
              agreement_id: mutation.itemId,
              catalog_item_id: newLineItem.catalog_item_id,
              current_cost: newLineItem.current_cost,
              discount: 0,
              order: newLineItem.line_items
                ? newLineItem.line_items.length - 1
                : 0,
              price: newLineItem.price,
              qty: 1,
              taxable: newLineItem.taxable,
            },
          },
        });
        let newAg = offlineAgreements[0];
        offlineAgreements = offlineAgreements.map((ag: Agreement) => {
          if (ag.id === mutation.itemId) {
            newAg = Object.assign({}, ag);
            const lineIts = newAg.line_items?.slice() || [];
            const activeIndex = lineIts.findIndex(
              (lineItem: any) => lineItem.id === mutation.lineItemId,
            );
            lineIts[activeIndex] = result4.data.insert_line_items_one;
            newAg.line_items = lineIts;
            return newAg;
          }
          return Object.assign({}, ag);
        });
        offlineContacts = offlineContacts.map((ct: Contact) => {
          if (ct.id === data.contact_id) {
            const newCt = Object.assign({}, ct);
            const newCtAgreements = newCt.agreements?.slice() || [];
            const agIndex2 = newCtAgreements.findIndex(
              (ag2: Agreement) => ag2.id === mutation.itemId,
            );
            newCtAgreements[agIndex2] = newAg;
            newCt.agreements = newCtAgreements;
            return newCt;
          }
          return Object.assign({}, ct);
        });
        setMutationIndex(mutationIndex + 1);
        break;
      case 'UPDATE_LINEITEM':
        console.log('---------- updating line item');
        const lineItIndex = data.line_items.findIndex(
          (lineItem: LineItemType) => lineItem.id === mutation.lineItemId,
        );
        const updatingLineItem = data.line_items[lineItIndex];
        const lineItem = {
          qty: updatingLineItem.qty,
          last_modified: new Date(),
          discount: updatingLineItem.discount,
          order: updatingLineItem.order,
        };
        await update_line_items({
          variables: {
            _set: lineItem,
            id: mutation.lineItemId,
          },
        });
        setMutationIndex(mutationIndex + 1);
        break;
      case 'DELETE_LINEITEM':
        const lineItIndex2 = data.line_items.findIndex(
          (lineItem2: LineItemType) => lineItem2.id === mutation.lineItemId,
        );
        const deletingLineItem = data.line_items[lineItIndex2];
        await delete_line_items({
          variables: {
            id: deletingLineItem.id,
          },
        });
        setMutationIndex(mutationIndex + 1);
        break;
      case 'CREATE_CONTACT':
        console.log('----------- creating contact: ');
        const result2 = await insert_contacts({
          variables: {
            company: data.company,
            email: data.email,
            name_first: data.name_first,
            name_last: data.name_last,
            phone_mobile: data.phone_mobile,
            phone_office: data.phone_office,
            title: data.title,
            city: data.address.city,
            line1: data.address.line1,
            line2: data.address.line2,
            postal_code: data.address.postal_code,
            us_state: data.address.us_state,
            organization_id: 1,
          },
        });
        const {id, address_id} = result2.data.insert_contacts.returning[0];
        offlineAgreements = offlineAgreements.map((ag: Agreement) => {
          if (ag.contact_id === mutation.itemId) {
            ag.contact_id = id;
            ag.billing_address_id = address_id;
            ag.shipping_address_id = address_id;
          }
          return Object.assign({}, ag);
        });
        offlineContacts = offlineContacts.map((ct: Contact) => {
          if (ct.id === mutation.itemId) {
            return result2.data.insert_contacts.returning[0];
          }
          return Object.assign({}, ct);
        });
        setMutationIndex(mutationIndex + 1);
        break;
      case 'INSERT_ACCEPT_AGREEMENT_EVENT':
        await insert_agreement_events_one({
          variables: {
            id: data.id,
            event_type: 'accepted',
          },
        });
        setMutationIndex(mutationIndex + 1);
        break;
      case 'DELETE_AGREEMENT':
        await delete_agreements({
          variables: {
            id: mutation.itemId,
          },
        });
        setMutationIndex(mutationIndex + 1);
        break;
      default:
    }
  };

  React.useEffect(() => {
    if (network.online && offline_mutations.length > 0) {
      if (mutationIndex < offline_mutations.length) {
        runOfflineMutation();
      } else {
        setAction('offline_mutations', {data: []});
        setTimeout(() => {
          setAction('loading', {state: true});
          setAction('sync', {status: false});
          setMutationIndex(0);
        }, 3000);
      }
    }
  }, [network.online, mutationIndex]);

  React.useEffect(() => {
    if (isStoreReady) {
      if (offline_mutations.length === 0 && userInfo.id > 0 && !sync.status) {
        startDataSync();
      }
    }
  }, [isStoreReady, userInfo.id, sync, offline_mutations]);

  useBackHandler();
  return (
    <NavigationContainer
      onStateChange={async (state) => {
        const currentScreen = getActiveRouteName(state as NavigationState);
        routeNameRef.current = currentScreen;
      }}>
      <Stack.Navigator initialRouteName="Splash" headerMode="none">
        <Stack.Screen name="Splash" component={SplashRoutes} />
        <Stack.Screen name="Auth" component={AuthRoutes} />
        <Stack.Screen name="Main" component={MainTabRoutes} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
