/**
 * @jest-environment jsdom
 */

import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import AgreementTile from '@root/views/Dashboard/AgreementTile';
import {TILE_MOCKDATA} from '../../__mocks__/Dashboard';

let wrapper: ReactWrapper;

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('Agreement Component in Dashboard page', () => {
  beforeEach(() => {
    wrapper = mount(
      <ThemeContext.Provider value={currentTheme}>
        <AgreementTile
          agreement={TILE_MOCKDATA.agreement as any}
          color={TILE_MOCKDATA.color}
        />
      </ThemeContext.Provider>,
    );
  });

  it('renders successfully', () => {
    const textEle = wrapper.find('Memo(AppText)');
    expect(textEle.text()).toBe('Linnie Lindgren (Harmar Straight Stairlift)');
    expect(textEle.prop('style')).toEqual({color: TILE_MOCKDATA.color});
  });
});
