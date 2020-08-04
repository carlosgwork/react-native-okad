import React from 'react';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import * as ThemeContextModules from '@global/Hooks';
import {LineItem} from '@root/components';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

const mockItem = {
  id: 1,
  name: 'Manual Swivel Seat',
  price_total: 729,
  price_monthly: 12.15,
  category: 'seat',
};

describe('LineItem Component', () => {
  it('renders successfully', () => {
    const mockCallback = jest.fn();
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <LineItem item={mockItem} active={false} setActive={mockCallback} />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should have a "Test" text', () => {
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const mockCallback = jest.fn();
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <LineItem item={mockItem} active={false} setActive={mockCallback} />
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('Memo(AppText)').contains(mockItem.name)).toBeTruthy();
    expect(wrapper.find('Icon').prop('name')).toBe('play-outline');
  });
});
