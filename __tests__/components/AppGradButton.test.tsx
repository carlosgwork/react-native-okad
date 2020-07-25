import React from 'react';
import AppGradButton from '@components/AppGradButton';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {View} from 'react-native';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('AppGradButton Component', () => {
  it('renders a gradient button with "NEW" title', () => {
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <AppGradButton title={'NEW'} leftIconContent={<View />} />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
