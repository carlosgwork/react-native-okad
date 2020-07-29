/**
 * @jest-environment jsdom
 */

import React from 'react';
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

describe('Agreements Page', () => {
  beforeEach(() => {
    mockClient = createMockClient();
    queryHandler = jest.fn().mockResolvedValue({
      data: AGREEMENTS_MOCKDATA,
    });
    mockClient.setRequestHandler(FETCH_AGREEMENTS, queryHandler);
  });

  it('renders Loading component while fetching data', () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Agreements />
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
    mockClient.setRequestHandler(FETCH_AGREEMENTS, () =>
      Promise.resolve({errors: [{message: 'GraphQL Error'}]}),
    );
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Agreements />
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
            <Agreements />
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

  it('should have one Table component with 5 columns', async () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <Agreements />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    expect(dataTable.prop('rows')).toEqual(AGREEMENTS_MOCKDATA.agreements);
    expect(dataTable.prop('sortOp')).toEqual({
      sortBy: '',
      sortOrder: 'ASC',
    });
    expect(dataTable.text()).toContain('Id');
    expect(dataTable.text()).toContain('Contact');
    expect(dataTable.text()).toContain('Shipping Address');
    expect(dataTable.text()).toContain('Template Id');
    expect(dataTable.text()).toContain('Created');
  });

  it('sorts rows by Id/Contact/Shipping Address/Template Id/Created fields', () => {
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    const nameField = dataTable.find('Memo(TableHeader)');
    const field = nameField.find('TouchableOpacity');
    const ele = field.filterWhere((x) => x.text() === 'Id');
    expect(ele).toHaveLength(1);
    (ele.first().props() as TouchElementProps).onPress();
    const ele2 = field.filterWhere((x) => x.text() === 'Contact');
    (ele2.first().props() as TouchElementProps).onPress();
    const ele3 = field.filterWhere((x) => x.text() === 'Shipping Address');
    (ele3.first().props() as TouchElementProps).onPress();
    const ele4 = field.filterWhere((x) => x.text() === 'Template Id');
    (ele4.first().props() as TouchElementProps).onPress();
    const ele5 = field.filterWhere((x) => x.text() === 'Created');
    (ele5.first().props() as TouchElementProps).onPress();
  });

  it('update table rows when state.sortOp is changed', async () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store2}>
          <ThemeContext.Provider value={currentTheme}>
            <Agreements />
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
