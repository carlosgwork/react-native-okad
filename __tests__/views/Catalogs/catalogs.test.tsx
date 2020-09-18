/**
 * @jest-environment jsdom
 */

import React from 'react';
import {Provider} from 'react-redux';
import {createMockClient} from 'mock-apollo-client';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';
import wait from 'waait';
import configureStore from 'redux-mock-store';

import Catalogs from '@root/views/Catalogs';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import {VENDORS_MOCKDATA} from '../../__mocks__/Vendors';
import {FETCH_VENDORS} from '@root/views/Catalogs/graphql';

let wrapper: ReactWrapper;
let queryHandler;

const mockStore = configureStore([]);
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;
const store = mockStore({
  vendors: {
    vendors: [],
    searchText: '',
    sortOptions: [],
  },
});

let mockClient: any;
const navigation = {navigate: jest.fn()};

describe('Catalogs Page Component', () => {
  beforeEach(() => {
    mockClient = createMockClient();
    queryHandler = jest.fn().mockResolvedValue({
      data: VENDORS_MOCKDATA,
    });
    mockClient.setRequestHandler(FETCH_VENDORS, queryHandler);
  });

  it('renders Loading component while fetching data', () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Catalogs navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    const loadingEle = wrapper.find('Memo(CircularLoading)');
    expect(loadingEle).toHaveLength(1);
    expect(loadingEle.prop('loading')).toEqual(true);
  });

  it('renders Loading Error text if Data Fetch is failed', async () => {
    mockClient = createMockClient();
    mockClient.setRequestHandler(FETCH_VENDORS, () =>
      Promise.resolve({errors: [{message: 'GraphQL Error'}]}),
    );
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Catalogs navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    expect(wrapper.text()).toContain('Loading Error');
  });

  it('renders successfully', async () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Catalogs navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    const loadingEle = wrapper.find('Memo(CircularLoading)');
    expect(loadingEle).toHaveLength(1);
    expect(loadingEle.prop('loading')).toEqual(false);
  });

  it('should have one vendorRow component and valid props', async () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Catalogs navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    const vendorRowEle = wrapper.find('VendorRow');
    expect(vendorRowEle).toHaveLength(1);
    expect(vendorRowEle.prop('vendorName')).toEqual(
      'Bruno Independent Living Aids, Inc.',
    );
    expect(vendorRowEle.prop('catalogs')).toEqual(
      VENDORS_MOCKDATA.vendors[0].catalog_items,
    );
    expect(vendorRowEle.prop('catalogSortOps')).toEqual({
      sortBy: '',
      sortOrder: 'ASC',
    });
    const dataTable = vendorRowEle.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    expect(dataTable.text()).toContain('Sku');
    expect(dataTable.text()).toContain('Name');
    expect(dataTable.text()).toContain('Cost');
    expect(dataTable.text()).toContain('Price');
    expect(dataTable.text()).toContain('Taxable');
  });
});
