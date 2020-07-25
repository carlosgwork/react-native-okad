import React from 'react';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import * as ThemeContextModules from '@global/Hooks';
import {AppText} from '@root/components';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('AppText Component', () => {
  it('renders a button with "Test" text', () => {
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <AppText>Test</AppText>
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should have a "Test" text', () => {
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <AppText>Test</AppText>
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('Text').length).toBe(1);
    expect(wrapper.find('Text').at(0).contains('Test')).toBeTruthy();
  });
});
