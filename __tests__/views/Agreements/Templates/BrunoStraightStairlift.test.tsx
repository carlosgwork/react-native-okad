import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import BrunoStraightStairlift from '@root/views/Agreements/Templates/BrunoStraightStairlift';
import {ELAN_PRODUCTS} from '@root/views/Agreements/Templates/BrunoStraightStairlift/data';

let wrapper: ReactWrapper;

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

const navigation = {navigate: jest.fn()};

describe('Bruno Straight Stairlift Page', () => {
  beforeEach(() => {
    wrapper = mount(
      <ThemeContext.Provider value={currentTheme}>
        <BrunoStraightStairlift
          navigation={navigation as any}
          route={{} as any}
        />
      </ThemeContext.Provider>,
    );
  });

  it('renders successfully.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader).toHaveLength(1);
    expect(appHeader.find('Text').contains('Bruno Straight Stairlift')).toEqual(
      true,
    );
  });

  it('should have a cancel button.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader.find('TouchableOpacity').contains('Cancel')).toEqual(true);
  });

  it('should have a IndoorOutdoorSwitch component.', () => {
    const indoorOutdoorSwitch = wrapper.find('Memo(IndoorOutdoorSwitch)');
    expect(indoorOutdoorSwitch).toHaveLength(1);
    expect(indoorOutdoorSwitch.prop('isIndoor')).toBeTruthy();
  });

  it('should have a Carousel with 4 items.', () => {
    const carousel = wrapper.find('Carousel');
    expect(carousel).toHaveLength(1);
    expect(carousel.prop('data')).toEqual(ELAN_PRODUCTS.indoor);
  });
});
