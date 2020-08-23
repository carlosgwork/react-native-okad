/**
 * @jest-environment jsdom
 */

import React from 'react';
import {Alert} from 'react-native';
import Agreements, {FETCH_AGREEMENTS} from '@root/views/Agreements';
import {Provider} from 'react-redux';
import {createMockClient} from 'mock-apollo-client';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';
import wait from 'waait';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import configureStore from 'redux-mock-store';
import {AGREEMENTS_MOCKDATA} from '../../__mocks__/Agreements';
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
  agreements: {
    agreements: [],
    sortOp: {
      sortBy: '',
      sortOrder: 'ASC',
    },
  },
});
const store2 = mockStore({
  agreements: {
    agreements: [],
    sortOp: {
      sortBy: 'id',
      sortOrder: 'DESC',
    },
  },
});

let mockClient: any;
const navigation = {navigate: jest.fn()};
jest.spyOn(Alert, 'alert');

describe('Agreements Page', () => {
  it('renders Loading component while fetching data', () => {
    mockClient = createMockClient();
    queryHandler = jest.fn().mockResolvedValue({
      data: AGREEMENTS_MOCKDATA,
    });
    mockClient.setRequestHandler(FETCH_AGREEMENTS, queryHandler);
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Agreements navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    const loadingEle = wrapper.find('Memo(CircularLoading)');
    expect(loadingEle).toHaveLength(1);
    expect(loadingEle.prop('loading')).toEqual(true);
  });

  it('shows an Alert and hides Loading Indicator if Data Fetch is failed', async () => {
    mockClient = createMockClient();
    mockClient.setRequestHandler(FETCH_AGREEMENTS, () =>
      Promise.resolve({errors: [{message: 'GraphQL Error'}]}),
    );
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Agreements navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    expect(Alert.alert).toHaveBeenCalled();
    const loadingEle = wrapper.find('Memo(CircularLoading)');
    expect(loadingEle).toHaveLength(1);
    expect(loadingEle.prop('loading')).toEqual(false);
  });

  it('should have one Table component with 5 columns', async () => {
    mockClient = createMockClient();
    queryHandler = jest.fn().mockResolvedValue({
      data: AGREEMENTS_MOCKDATA,
    });
    mockClient.setRequestHandler(FETCH_AGREEMENTS, queryHandler);
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Agreements navigation={navigation as any} route={{} as any} />
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
    expect(dataTable.text()).toContain('Contact');
    expect(dataTable.text()).toContain('Shipping Address');
    expect(dataTable.text()).toContain('Template');
    expect(dataTable.text()).toContain('Created');
  });

  it('sorts rows by Contact/Shipping Address/Template/Created fields', () => {
    mockClient = createMockClient();
    queryHandler = jest.fn().mockResolvedValue({
      data: AGREEMENTS_MOCKDATA,
    });
    mockClient.setRequestHandler(FETCH_AGREEMENTS, queryHandler);
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    const nameField = dataTable.find('Memo(TableHeader)');
    const field = nameField.find('TouchableOpacity');
    const ele1 = field.filterWhere((x) => x.text() === 'Name');
    (ele1.first().props() as TouchElementProps).onPress();
    const ele2 = field.filterWhere((x) => x.text() === 'Contact');
    (ele2.first().props() as TouchElementProps).onPress();
    const ele3 = field.filterWhere((x) => x.text() === 'Shipping Address');
    (ele3.first().props() as TouchElementProps).onPress();
    const ele4 = field.filterWhere((x) => x.text() === 'Template');
    (ele4.first().props() as TouchElementProps).onPress();
    const ele5 = field.filterWhere((x) => x.text() === 'Created');
    (ele5.first().props() as TouchElementProps).onPress();
  });

  it('update table rows when state.sortOp is changed', async () => {
    mockClient = createMockClient();
    queryHandler = jest.fn().mockResolvedValue({
      data: AGREEMENTS_MOCKDATA,
    });
    mockClient.setRequestHandler(FETCH_AGREEMENTS, queryHandler);
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store2}>
          <ThemeContext.Provider value={currentTheme}>
            <Agreements navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable.prop('sortOp')).toEqual({
      sortBy: 'id',
      sortOrder: 'DESC',
    });
  });
});
