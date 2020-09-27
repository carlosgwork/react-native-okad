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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';

import Dashboard from '@root/views/Dashboard';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import {DASHBOARD_MOCKDATA} from '../../__mocks__/Dashboard';
import {FETCH_10_AGREEMENTS} from '@root/views/Dashboard/graphql';
import {AGREEMENTS_MOCKDATA} from '../../__mocks__/Agreements';

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
    agreements: AGREEMENTS_MOCKDATA.agreements,
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
    mockClient.setRequestHandler(FETCH_10_AGREEMENTS, queryHandler);
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
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader).toHaveLength(1);
    expect(appHeader.find('Memo(AppSearchInput)')).toHaveLength(1);
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
    expect(wrapper.find('Memo(AppText)').at(1).text()).toEqual(
      'Recent Open Agreements',
    );
    const AgreementTile = wrapper.find('AgreementTile');
    expect(AgreementTile).toHaveLength(2);
  });
});
