/**
 * @jest-environment jsdom
 */

import React from 'react';
import {Provider} from 'react-redux';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import configureStore from 'redux-mock-store';
import ElanTemplate from '@root/views/Agreements/Templates/BrunoStraightStairlift/Elan';
import {createMockClient} from 'mock-apollo-client';

let wrapper: ReactWrapper;

const mockStore = configureStore([]);
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;
const store = mockStore({
  contacts: {
    contacts: [],
    sortOp: {
      sortBy: '',
      sortOrder: 'ASC',
    },
  },
  user: {
    id: 1,
    default_sales_tax_rate: 8,
    lastAgreementNumber: 0,
  },
  cart: {
    items: [],
  },
  agreements: {
    agreements: [],
    sortOp: {
      sortBy: '',
      sortOrder: 'ASC',
    },
  },
  offlineMutations: {
    data: [],
  },
  network: {
    online: true,
  },
});

const navigation = {navigate: jest.fn()};
let mockClient: any;
mockClient = createMockClient();

describe('Elan Template Page', () => {
  beforeEach(() => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <ElanTemplate
              navigation={navigation as any}
              route={{params: {itemTitle: 'Elan SRE-3050'}} as any}
            />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
  });

  it('renders successfully.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader).toHaveLength(1);
    expect(appHeader.find('Text').contains('Elan SRE-3050')).toEqual(true);
  });

  it('should have a cancel button.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader.find('TouchableOpacity').contains('Cancel')).toEqual(true);
  });

  it('should have a section named "Seat".', () => {
    expect(wrapper.find('Memo(AppText)').contains('Seat')).toEqual(true);
  });

  it('should have a section named "Footrest".', () => {
    expect(wrapper.find('Memo(AppText)').contains('Footrest')).toEqual(true);
  });

  it('should have a section named "Rail".', () => {
    expect(wrapper.find('Memo(AppText)').contains('Rail')).toEqual(true);
  });

  it('should have a section named "Additional Rail Options".', () => {
    expect(
      wrapper.find('Memo(AppText)').contains('Additional Rail Options'),
    ).toEqual(true);
  });
});
