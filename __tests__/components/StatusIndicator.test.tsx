import React from 'react';
import {shallow} from 'enzyme';

import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import {StatusIndicator} from '@root/components';

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

describe('StatusIndicator Component', () => {
  it('renders OPEN while status value is open', () => {
    const tree = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <StatusIndicator status={'open'} />
      </ThemeContext.Provider>,
    ).dive();
    expect(tree.find('Memo(AppText)')).toHaveLength(1);
    expect(tree.find('Memo(AppText)').text()).toEqual('OPEN');
    expect(tree.find('Image')).toHaveLength(1);
  });

  it('renders SENT while status value is sent', () => {
    const tree = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <StatusIndicator status={'sent'} />
      </ThemeContext.Provider>,
    ).dive();
    expect(tree.find('Memo(AppText)')).toHaveLength(1);
    expect(tree.find('Memo(AppText)').text()).toEqual('SENT');
    expect(tree.find('Image')).toHaveLength(1);
  });

  it('renders VIEWED while status value is viewed', () => {
    const tree = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <StatusIndicator status={'viewed'} />
      </ThemeContext.Provider>,
    ).dive();
    expect(tree.find('Memo(AppText)')).toHaveLength(1);
    expect(tree.find('Memo(AppText)').text()).toEqual('VIEWED');
    expect(tree.find('Image')).toHaveLength(1);
  });

  it('renders ACCEPTED while status value is accepted', () => {
    const tree = shallow(
      <ThemeContext.Provider value={currentTheme}>
        <StatusIndicator status={'accepted'} />
      </ThemeContext.Provider>,
    ).dive();
    expect(tree.find('Memo(AppText)')).toHaveLength(1);
    expect(tree.find('Memo(AppText)').text()).toEqual('ACCEPTED');
    expect(tree.find('Image')).toHaveLength(1);
  });
});
