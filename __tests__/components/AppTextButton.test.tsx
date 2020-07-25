import React from 'react';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import * as ThemeContextModules from '@global/Hooks';
import {AppTextButton} from '@root/components';
import {Text} from 'react-native';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('AppTextButton Button Component', () => {
  it('renders a button with "App Text Button" text', () => {
    const mockPressEvent = jest.fn();
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <AppTextButton onPress={mockPressEvent}>
          <Text>App Text Button</Text>
        </AppTextButton>
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should have a "App Text Button" text', () => {
    const mockPressEvent = jest.fn();
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <AppTextButton onPress={mockPressEvent}>
          <Text>App Text Button</Text>
        </AppTextButton>
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('Text').length).toBe(1);
    expect(wrapper.find('Text').at(0).contains('App Text Button')).toBeTruthy();
  });

  it('should fire an event when it is clicked', () => {
    const mockPressEvent = jest.fn();
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <AppTextButton onPress={mockPressEvent}>
          <Text>App Text Button</Text>
        </AppTextButton>
      </ThemeContext.Provider>,
    ).dive();
    wrapper.find('ForwardRef').simulate('press');
    expect(mockPressEvent).toHaveBeenCalled();
  });
});
