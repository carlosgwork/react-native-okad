import React from 'react';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import * as ThemeContextModules from '@global/Hooks';
import {LineItemWithSwitch} from '@root/components';
import {TouchElementProps} from '@root/utils/types';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

const mockItem = {
  id: 8,
  name: 'Foot of Length',
  price: 10000,
  icon: undefined,
  type: 'switch',
  cost: 5000,
  taxable: true,
  subcategory: 'seat',
};

describe('LineItemWithSwitch Component', () => {
  it('renders successfully', () => {
    const mockCallback = jest.fn();
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <LineItemWithSwitch item={mockItem} qty={2} setQty={mockCallback} />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should have a "Foot of Length" text', () => {
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <LineItemWithSwitch item={mockItem} qty={2} setQty={mockCallback} />
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('Memo(AppText)').contains(mockItem.name)).toBeTruthy();
  });

  it('should call the setQty callback', () => {
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <LineItemWithSwitch item={mockItem} qty={2} setQty={mockCallback} />
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('Icon')).toHaveLength(2);
    (wrapper.find('ForwardRef').at(0).props() as TouchElementProps).onPress();
    expect(mockCallback).toHaveBeenCalledWith(1);
    (wrapper.find('ForwardRef').at(1).props() as TouchElementProps).onPress();
    expect(mockCallback).toHaveBeenCalledWith(3);
  });
});
