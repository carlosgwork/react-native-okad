/**
 * @jest-environment jsdom
 */

import React from 'react';
import Contacts from '@root/views/Contacts';
import {FETCH_CONTACTS} from '@root/views/Contacts/graphql';
import {Provider} from 'react-redux';
import {createMockClient} from 'mock-apollo-client';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';
import wait from 'waait';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import configureStore from 'redux-mock-store';
import {CONTACTS_MOCKDATA} from '../../__mocks__/Contacts';
import {TouchElementProps} from '@root/utils/types';

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
  contacts: {
    contacts: [],
    sortOp: {
      sortBy: '',
      sortOrder: 'ASC',
    },
  },
});
const store2 = mockStore({
  contacts: {
    contacts: [],
    sortOp: {
      sortBy: 'name',
      sortOrder: 'DESC',
    },
  },
});

const navigation = {navigate: jest.fn()};
let mockClient: any;
mockClient = createMockClient();
queryHandler = jest.fn().mockResolvedValue({
  data: CONTACTS_MOCKDATA,
});
mockClient.setRequestHandler(FETCH_CONTACTS, queryHandler);

describe('Contacts Page', () => {
  it('renders Loading component while fetching data', () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Contacts navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    const loadingEle = wrapper.find('Memo(CircularLoading)');
    expect(loadingEle).toHaveLength(1);
    expect(loadingEle.prop('loading')).toEqual(true);
  });

  it('hides Loading Indicator if Data Fetch is failed', async () => {
    mockClient = createMockClient();
    mockClient.setRequestHandler(FETCH_CONTACTS, () =>
      Promise.resolve({errors: [{message: 'GraphQL Error'}]}),
    );
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Contacts navigation={navigation as any} route={{} as any} />
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

  it('renders successfully', async () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Contacts navigation={navigation as any} route={{} as any} />
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

  it('should have one Table component with 4 columns', async () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Contacts navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    expect(dataTable.prop('sortOp')).toEqual({
      sortBy: '',
      sortOrder: 'ASC',
    });
    expect(dataTable.text()).toContain('Name');
    expect(dataTable.text()).toContain('Location');
    expect(dataTable.text()).toContain('Phone Number');
  });

  it('sorts rows by Id/Contact/Shipping Address/Template Id/Created fields', () => {
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    const nameField = dataTable.find('Memo(TableHeader)');
    const field = nameField.find('TouchableOpacity');
    const ele = field.filterWhere((x) => x.text() === 'Name');
    expect(ele).toHaveLength(1);
    (ele.first().props() as TouchElementProps).onPress();
    const ele2 = field.filterWhere((x) => x.text() === 'Location');
    (ele2.first().props() as TouchElementProps).onPress();
    const ele3 = field.filterWhere((x) => x.text() === 'Phone Number');
    (ele3.first().props() as TouchElementProps).onPress();
  });

  it('update table rows when state.sortOp is changed', async () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store2}>
          <ThemeContext.Provider value={currentTheme}>
            <Contacts navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable.prop('sortOp')).toEqual({
      sortBy: 'name',
      sortOrder: 'DESC',
    });
  });
});
