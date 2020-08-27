import React from 'react';
import Login from '@root/views/Login';
import {createMockClient} from 'mock-apollo-client';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';
import wait from 'waait';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';

let wrapper: ReactWrapper;
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

let mockClient: any;

describe('Login Page', () => {
  it('renders Loading component while fetching data', () => {
    mockClient = createMockClient();
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <ThemeContext.Provider value={currentTheme}>
          <Login />
        </ThemeContext.Provider>
      </ApolloProvider>,
    );
    const loadingEle = wrapper.find('Memo(CircularLoading)');
    expect(loadingEle).toHaveLength(1);
    expect(loadingEle.prop('loading')).toEqual(false);
  });

  it('should render GoogleSignin Button.', async () => {
    mockClient = createMockClient();
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <ThemeContext.Provider value={currentTheme}>
          <Login />
        </ThemeContext.Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    const googleSignin = wrapper.find('GoogleSigninButton');
    expect(googleSignin).toHaveLength(1);
  });
});
