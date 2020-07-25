import React from 'react';
import SocialLoginButton from '@components/SocialLoginButton';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import * as ThemeContextModules from '@global/Hooks';
import {shallow} from 'enzyme';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('SocialLoginButton Component', () => {
  it('renders a Google SigIn button', () => {
    const mockPressEvent = jest.fn();
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <SocialLoginButton provider="google" onPress={mockPressEvent} />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should have a "Sign in with Google" text', () => {
    const mockPressEvent = jest.fn();
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <SocialLoginButton provider="google" onPress={mockPressEvent} />
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('Text').length).toBe(1);
    expect(
      wrapper.find('Text').at(0).contains('Sign in with Google'),
    ).toBeTruthy();
  });

  it('should fire an event when it is clicked', () => {
    const mockPressEvent = jest.fn();
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <SocialLoginButton provider="google" onPress={mockPressEvent} />
      </ThemeContext.Provider>,
    ).dive();
    wrapper.find('ForwardRef').simulate('press');
    expect(mockPressEvent).toHaveBeenCalled();
  });
});
