/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {NavigationContainer, NavigationState} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector} from 'react-redux';
import {useMutation} from '@apollo/client';

import Splash from '@root/views/Splash';
import Login from '@root/views/Login';

import {useBackHandler} from '@global/Hooks';
import NewAgreementNavigationStack from './newAgreement';

import {MainTabRoutes} from './main';
import {OfflineMutationType, Agreement, LineItemType} from '@root/utils/types';
import {
  CREATE_AGREEMENT,
  UPDATE_AGREEMENT,
  UPDATE_LINE_ITEM,
  REMOVE_LINE_ITEM,
} from '@root/views/Agreements/graphql';
import {setAction} from '@root/redux/actions';

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
  const {offlineMutations, agreements, network} = useSelector((state: any) => ({
    offlineMutations: state.offlineMutations.data,
    agreements: state.agreements.agreements,
    network: state.network,
  }));

  const [inset_agreement] = useMutation(CREATE_AGREEMENT);
  const [update_agreement] = useMutation(UPDATE_AGREEMENT);
  const [update_line_items] = useMutation(UPDATE_LINE_ITEM);
  const [delete_line_items] = useMutation(REMOVE_LINE_ITEM);

  React.useEffect(() => {
    const mutations = offlineMutations.slice();
    if (network.online && mutations.length > 0) {
      mutations.map((mutation: OfflineMutationType) => {
        const updatedAgreements = agreements.slice();
        const itemIndex = updatedAgreements.findIndex(
          (ag: Agreement) => ag.id === mutation.itemId,
        );
        const data = updatedAgreements[itemIndex];
        switch (mutation.type) {
          case 'CREATE_AGREEMENT':
            const lineItems = data.line_items.map((item: any) => ({
              catalog_item_id: item.catalog_item_id,
              current_cost: item.current_cost,
              price: item.price,
              qty: item.qty,
              taxable: item.taxable,
              discount: item.discount,
            }));
            inset_agreement({
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
            update_agreement({
              variables: {
                _set: updatingAgreement,
                id: data.id,
              },
            });
            break;
          case 'UPDATE_LINEITEM':
            const lineItIndex = data.line_items.findIndex(
              (lineItem: LineItemType) => lineItem.id === mutation.lineItemId,
            );
            const updatingLineItem = data.line_items[lineItIndex];
            const lineItem = {
              qty: updatingLineItem.qty,
              last_modified: new Date(),
              discount: updatingLineItem.discount,
            };
            update_line_items({
              variables: {
                _set: lineItem,
                id: data.id,
              },
            });
            break;
          case 'DELETE_AGREEMENT':
            const lineItIndex2 = data.line_items.findIndex(
              (lineItem2: LineItemType) => lineItem2.id === mutation.lineItemId,
            );
            const deletingLineItem = data.line_items[lineItIndex2];
            delete_line_items({
              variables: {
                id: deletingLineItem.id,
              },
            });
            break;
          default:
        }
      });
      setAction('offlineMutations', {data: []});
    }
  }, [network]);

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
        <Stack.Screen
          name="NewAgreements"
          component={NewAgreementNavigationStack}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
