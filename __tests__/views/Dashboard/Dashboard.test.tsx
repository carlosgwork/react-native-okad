/**
 * @jest-environment jsdom
 */

import React from 'react';
import Dashboard, {FETCH_AGREEMENTS} from '@root/views/Dashboard';
import {Provider} from 'react-redux';
import {createMockClient} from 'mock-apollo-client';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';
import wait from 'waait';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import configureStore from 'redux-mock-store';
import {DASHBOARD_MOCKDATA} from '../../__mocks__/Dashboard';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

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

let mockClient: any;
const MainTab = createBottomTabNavigator();

describe('Dashboard Page', () => {
  beforeEach(() => {
    mockClient = createMockClient();
    queryHandler = jest.fn().mockResolvedValue({
      data: DASHBOARD_MOCKDATA,
    });
    mockClient.setRequestHandler(FETCH_AGREEMENTS, queryHandler);
  });

  it('renders Loading component while fetching data', () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <NavigationContainer>
              <MainTab.Navigator>
                <MainTab.Screen name="Home" component={Dashboard} />
              </MainTab.Navigator>
            </NavigationContainer>
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
            <NavigationContainer>
              <MainTab.Navigator>
                <MainTab.Screen name="Home" component={Dashboard} />
              </MainTab.Navigator>
            </NavigationContainer>
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
            <NavigationContainer>
              <MainTab.Navigator>
                <MainTab.Screen name="Home" component={Dashboard} />
              </MainTab.Navigator>
            </NavigationContainer>
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

  it('should have 2 AgreementTiles', async () => {
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <NavigationContainer>
              <MainTab.Navigator>
                <MainTab.Screen name="Home" component={Dashboard} />
              </MainTab.Navigator>
            </NavigationContainer>
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    expect(wrapper.find('Memo(AppText)').first().text()).toEqual(
      'Recent Open Agreements',
    );
    const AgreementTile = wrapper.find('AgreementTile');
    expect(AgreementTile).toHaveLength(2);
  });
});
