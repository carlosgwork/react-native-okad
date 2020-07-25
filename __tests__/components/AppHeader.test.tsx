import React from 'react';
import AppHeader from '@components/AppHeader';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {Text} from 'react-native';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('AppHeader Component', () => {
  it('renders header with "Contacts" title', () => {
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <AppHeader
          leftContent={null}
          rightContent={null}
          pageTitle={'Contacts'}
          toolbarCenterContent={null}
          toolbarRightContent={null}
        />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders header without "Contacts" title. Title should be replaced with toolbarLeftContent component', () => {
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <AppHeader
          leftContent={null}
          rightContent={null}
          pageTitle={'Contacts'}
          toolbarLeftContent={<Text>Agreements</Text>}
          toolbarCenterContent={null}
          toolbarRightContent={null}
        />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
