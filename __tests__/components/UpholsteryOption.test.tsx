import React from 'react';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import * as ThemeContextModules from '@global/Hooks';
import {SUPPORTED_COLORS, UpholsteryOption} from '@root/components';
import {TouchElementProps} from '@root/utils/types';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

const mockItem = {
  id: 40,
  name: 'Maroon Vinyl',
  price: 35000,
  type: 'color',
  color: undefined,
  category: 'Upholstery Options',
};

describe('UpholsteryOption Component', () => {
  it('renders successfully', () => {
    const mockCallback = jest.fn();
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <UpholsteryOption item={mockItem} setActive={mockCallback} />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should have a "Cream Vinyl" text', () => {
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <UpholsteryOption item={mockItem} setActive={mockCallback} />
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('Memo(AppText)').contains('Cream Vinyl')).toBeTruthy();
  });

  it('should call the setActive callback', () => {
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <UpholsteryOption item={mockItem} setActive={mockCallback} />
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('ForwardRef')).toHaveLength(
      SUPPORTED_COLORS.length + 1,
    );
    (wrapper.find('ForwardRef').at(0).props() as TouchElementProps).onPress();
    expect(mockCallback).toHaveBeenCalledWith({
      category: 'Upholstery Options',
      color: '#BEAB90',
      id: 40,
      name: 'Cream',
      price: 0,
      type: 'color',
    });
  });
});
