import React from 'react';
import CircularLoading from '@components/CircularLoading';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('CircularLoading Component', () => {
  it('renders null if loading props is false', () => {
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <CircularLoading loading={false} />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('renders a component with a ActivityIndicator', () => {
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <CircularLoading loading={true} />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
