import React from 'react';
import NavBackBtn from '@components/NavBackBtn';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import renderer from 'react-test-renderer';
import {shallow} from 'enzyme';
import * as ThemeContextModules from '@global/Hooks';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('NavBack Button Component', () => {
  it('renders a back button for stack navigation', () => {
    const mockPressEvent = jest.fn();
    const tree = renderer.create(
      <ThemeContext.Provider value={currentTheme}>
        <NavBackBtn title="Back" onClick={mockPressEvent} />
      </ThemeContext.Provider>,
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('should have a "Back" text', () => {
    const mockPressEvent = jest.fn();
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <NavBackBtn title="Back" onClick={mockPressEvent} />
      </ThemeContext.Provider>,
    ).dive();
    expect(wrapper.find('Memo(AppText)').length).toBe(1);
    expect(wrapper.find('Memo(AppText)').text()).toEqual('Back');
    wrapper.find('TouchableOpacity').simulate('press');
    expect(mockPressEvent).toHaveBeenCalled();
  });

  it('should fire an event when it is clicked', () => {
    const mockPressEvent = jest.fn();
    jest
      .spyOn(ThemeContextModules, 'useTheme')
      .mockImplementation(() => currentTheme);
    const wrapper = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <NavBackBtn title="Back" onClick={mockPressEvent} />
      </ThemeContext.Provider>,
    ).dive();
    wrapper.find('TouchableOpacity').simulate('press');
    expect(mockPressEvent).toHaveBeenCalled();
  });
});
