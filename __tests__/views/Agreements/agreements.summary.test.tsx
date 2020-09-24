/**
 * @jest-environment jsdom
 */

import React from 'react';
import {Provider} from 'react-redux';
import {createMockClient} from 'mock-apollo-client';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import configureStore from 'redux-mock-store';
import AgreementSummary from '@root/views/Agreements/Details/summary';

import {AGREEMENT_DETAILS_MOCKDATA} from '../../__mocks__/AgreementDetails';
import {CONTACT_DETAILS_MOCKDATA} from '../../__mocks__/ContactDetails';

let wrapper: ReactWrapper;

const mockStore = configureStore([]);
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;
const store = mockStore({
  agreements: {
    agreements: [],
  },
  contacts: {
    contacts: [],
  },
  offline_mutations: {
    data: [],
  },
  user: {
    prefix: 'LH',
  },
  network: {
    online: true,
  },
});

let mockClient: any;
const navigation = {navigate: jest.fn()};
const route: any = {
  params: {
    agreement: AGREEMENT_DETAILS_MOCKDATA,
    contact: CONTACT_DETAILS_MOCKDATA,
    itemTitle: 'Quote LH0001',
  },
};

describe('Agreement Summary Page', () => {
  beforeEach(() => {
    mockClient = createMockClient();
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <AgreementSummary navigation={navigation as any} route={route} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
  });

  it('renders successfully AppHeader.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader).toHaveLength(1);
    expect(appHeader.find('Text').contains(route.params.itemTitle)).toEqual(
      true,
    );
  });

  it('should render "Sales Tax", "Subtotal" and "Total" section.', () => {
    expect(wrapper.find('Memo(AppText)').contains('SALES TAX')).toBeTruthy();
    expect(wrapper.find('Memo(AppText)').contains('SUBTOTAL')).toBeTruthy();
    expect(wrapper.find('Memo(AppText)').contains('TOTAL')).toBeTruthy();
  });

  it('should render "Accept Quote" button.', () => {
    expect(
      wrapper.find('TouchableOpacity').contains('ACCEPT QUOTE'),
    ).toBeTruthy();
  });
});
