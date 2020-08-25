/**
 * @jest-environment jsdom
 */

import React from 'react';
import NewAgreement from '@root/views/Contacts/NewAgreement';
import {mount, ReactWrapper} from 'enzyme';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';

let wrapper: ReactWrapper;

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

const navigation = {navigate: jest.fn()};

describe('New Agreement Page', () => {
  it('renders successfully.', () => {
    wrapper = mount(
      <ThemeContext.Provider value={currentTheme}>
        <NewAgreement navigation={navigation as any} route={{} as any} />
      </ThemeContext.Provider>,
    );
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader).toHaveLength(1);
    expect(appHeader.find('Text').contains('New Agreement')).toEqual(true);
  });

  it('should have a cancel button.', () => {
    wrapper = mount(
      <ThemeContext.Provider value={currentTheme}>
        <NewAgreement navigation={navigation as any} route={{} as any} />
      </ThemeContext.Provider>,
    );
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader.find('TouchableOpacity').contains('Cancel')).toEqual(true);
  });

  it('should have three templates.', () => {
    wrapper = mount(
      <ThemeContext.Provider value={currentTheme}>
        <NewAgreement navigation={navigation as any} route={{} as any} />
      </ThemeContext.Provider>,
    );
    expect(wrapper.find('TemplateTile')).toHaveLength(3);
  });
});
