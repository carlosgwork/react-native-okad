/**
 * @jest-environment jsdom
 */

import React from 'react';
import NewContact from '@root/views/Contacts/New';
import {ApolloProvider} from '@apollo/client';
import {mount, ReactWrapper} from 'enzyme';
import wait from 'waait';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import {createMockClient} from 'mock-apollo-client';

let wrapper: ReactWrapper;

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
        <ThemeContext.Provider value={currentTheme}>
          <NewContact navigation={navigation as any} route={{} as any} />
        </ThemeContext.Provider>
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
