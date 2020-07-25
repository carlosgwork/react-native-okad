import React from 'react';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {AppSearchInput} from '@root/components';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('AppSearchInput Component', () => {
  it('renders a input box', () => {
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <AppSearchInput value={'searching'} />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
