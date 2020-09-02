/**
 * @jest-environment jsdom
 */

import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import wait from 'waait';

import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import AgreementTile from '@root/views/Dashboard/AgreementTile';
import {TILE_MOCKDATA} from '../../__mocks__/Dashboard';
import {TouchElementProps} from '@root/utils/types';

let wrapper: ReactWrapper;

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;
const jestMockCallback = jest.fn();

describe('Agreement Component in Dashboard page', () => {
  beforeEach(async () => {
    wrapper = mount(
      <ThemeContext.Provider value={currentTheme}>
        <AgreementTile
          onPress={jestMockCallback}
          agreement={TILE_MOCKDATA.agreement as any}
          color={TILE_MOCKDATA.color}
        />
      </ThemeContext.Provider>,
    );
    await wait(0);
  });

  it('renders successfully', () => {
    wrapper.update();
    expect(wrapper.find('Memo(AppText)').at(0).text()).toEqual(
      'Linnie Lindgren  ',
    );
    expect(
      wrapper.find('Text').contains('(Bruno Straight Stairlift)'),
    ).toBeTruthy();
    expect(wrapper.find('AgreementTile').prop('color')).toEqual(
      TILE_MOCKDATA.color,
    );
  });

  it('should fire a touch event when clicked', () => {
    const button = wrapper.find('ForwardRef');
    (button.at(0).props() as TouchElementProps).onPress();
    expect(jestMockCallback).toBeCalled();
  });
});
