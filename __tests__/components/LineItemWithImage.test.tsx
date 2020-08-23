import React from 'react';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import * as ThemeContextModules from '@global/Hooks';
import {LineItemWithImage} from '@root/components';
import {TouchElementProps} from '@root/utils/types';
import {BurnoEliteCreImg180Turn} from '@assets/assets';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

const mockItem = {
  id: 2,
  name: '180° Turn',
  price: 400000,
  image: BurnoEliteCreImg180Turn,
  type: 'image',
};

describe('LineItemWithImage Component', () => {
  it('renders successfully', () => {
    const mockCallback = jest.fn();
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <LineItemWithImage
          item={mockItem}
          active={false}
          setActive={mockCallback}
        />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should have an Image view', () => {
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <LineItemWithImage
          item={mockItem}
          active={false}
          setActive={mockCallback}
        />
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('ForwardRef')).toHaveLength(1);
    expect(wrapper.find('Image')).toHaveLength(1);
  });

  it('should call the setActive callback', () => {
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <LineItemWithImage
          item={mockItem}
          active={false}
          setActive={mockCallback}
        />
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('ForwardRef')).toHaveLength(1);
    (wrapper.find('ForwardRef').at(0).props() as TouchElementProps).onPress();
    expect(mockCallback).toHaveBeenCalled();
  });
});
