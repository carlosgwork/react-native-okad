/**
 * @jest-environment jsdom
 */

import React from 'react';
import {Provider} from 'react-redux';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';
import {createMockClient} from 'mock-apollo-client';
import wait from 'waait';
import configureStore from 'redux-mock-store';

import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import NewContact from '@root/views/Contacts/New';

let wrapper: ReactWrapper;

const mockStore = configureStore([]);
const store = mockStore({
  contacts: {
    contacts: [],
  },
  offlineMutations: {
    data: [],
  },
  network: {
    online: true,
  },
});
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

const navigation = {navigate: jest.fn()};
let mockClient: any;

describe('New Contact Page', () => {
  it('renders successfully', async () => {
    mockClient = createMockClient();
    wrapper = mount(
      <ApolloProvider client={mockClient as any}>
        <Provider store={store}>
          <ThemeContext.Provider value={currentTheme}>
            <NewContact navigation={navigation as any} route={{} as any} />
          </ThemeContext.Provider>
        </Provider>
      </ApolloProvider>,
    );
    await wait(0);
    wrapper.update();
    const inputElements = wrapper.find('Input');
    expect(inputElements).toHaveLength(12);
    expect(inputElements.at(0).prop('label')).toEqual('Title');
    expect(inputElements.at(1).prop('label')).toEqual('First Name');
    expect(inputElements.at(2).prop('label')).toEqual('Last Name');
    expect(inputElements.at(3).prop('label')).toEqual('Company');
    expect(inputElements.at(4).prop('label')).toEqual('Address');
    expect(inputElements.at(9).prop('label')).toEqual('PHONE (MOBILE)');
    expect(inputElements.at(10).prop('label')).toEqual('PHONE (OFFICE)');
    expect(inputElements.at(11).prop('label')).toEqual('Email');
    expect(wrapper.find('Memo(AppGradButton)')).toHaveLength(1);
    expect(wrapper.find('Memo(AppGradButton)').prop('title')).toBe(
      'Create Contact',
    );
  });
});
