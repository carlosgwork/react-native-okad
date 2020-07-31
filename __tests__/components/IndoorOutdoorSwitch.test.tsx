import React from 'react';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import * as ThemeContextModules from '@global/Hooks';
import {IndoorOutdoorSwitch} from '@root/components';
import {TouchElementProps} from '@root/utils/types';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('IndoorOutdoorSwitch Component', () => {
  it('renders successfully', () => {
    const mockCallback = jest.fn();
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <IndoorOutdoorSwitch isIndoor={true} setIsIndoor={mockCallback} />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should have "Indoor" and "Outdoor" touchable sections', () => {
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <IndoorOutdoorSwitch isIndoor={true} setIsIndoor={mockCallback} />
      </ThemeContext.Provider>,
    ).dive();
    const textElements = wrapper.find('Memo(AppText)');
    expect(textElements.length).toBe(2);
    expect(textElements.at(0).contains('Indoor')).toBeTruthy();
    expect(textElements.at(1).contains('Outdoor')).toBeTruthy();
  });

  it('"Indoor" and "Outdoor" sections should be touchable', () => {
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <IndoorOutdoorSwitch isIndoor={true} setIsIndoor={mockCallback} />
      </ThemeContext.Provider>,
    ).dive();
    const textElements = wrapper.find('ForwardRef');
    expect(textElements.length).toBe(2);
    (textElements.at(0).props() as TouchElementProps).onPress();
    expect(mockCallback).toHaveBeenCalledWith(true);
    (textElements.at(1).props() as TouchElementProps).onPress();
    expect(mockCallback).toHaveBeenCalledWith(false);
  });
});
