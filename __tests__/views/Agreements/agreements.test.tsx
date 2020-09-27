/**
 * @jest-environment jsdom
 */

import React from 'react';
import {Alert} from 'react-native';
import Agreements from '@root/views/Agreements';
import {Provider} from 'react-redux';
import {mount, ReactWrapper} from 'enzyme';
import wait from 'waait';
import configureStore from 'redux-mock-store';

import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import {TouchElementProps} from '@root/utils/types';

let wrapper: ReactWrapper;

const mockStore = configureStore([]);
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;
const store = mockStore({
  agreements: {
    agreements: [],
    sortOp: {
      sortBy: '',
      sortOrder: 'ASC',
    },
  },
});
const store2 = mockStore({
  agreements: {
    agreements: [],
    sortOp: {
      sortBy: 'id',
      sortOrder: 'DESC',
    },
  },
});

const navigation = {navigate: jest.fn()};
jest.spyOn(Alert, 'alert');

describe('Agreements Page', () => {
  it('renders successfully', async () => {
    wrapper = mount(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Agreements navigation={navigation as any} route={{} as any} />
        </ThemeContext.Provider>
      </Provider>,
    );
    await wait(0);
    wrapper.update();
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader).toHaveLength(1);
    expect(appHeader.find('Memo(AppSearchInput)')).toHaveLength(1);
  });

  it('should have one Table component with 5 columns', async () => {
    wrapper = mount(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Agreements navigation={navigation as any} route={{} as any} />
        </ThemeContext.Provider>
      </Provider>,
    );
    await wait(0);
    wrapper.update();
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    expect(dataTable.prop('sortOp')).toEqual({
      sortBy: '',
      sortOrder: 'ASC',
    });
    expect(dataTable.text()).toContain('Name');
    expect(dataTable.text()).toContain('Contact');
    expect(dataTable.text()).toContain('Shipping Address');
    expect(dataTable.text()).toContain('Template');
    expect(dataTable.text()).toContain('Created');
  });

  it('sorts rows by Contact/Shipping Address/Template/Created fields', async () => {
    wrapper = mount(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Agreements navigation={navigation as any} route={{} as any} />
        </ThemeContext.Provider>
      </Provider>,
    );
    await wait(0);
    wrapper.update();
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    const nameField = dataTable.find('Memo(TableHeader)');
    const field = nameField.find('TouchableOpacity');
    const ele1 = field.filterWhere((x) => x.text() === 'Name');
    (ele1.first().props() as TouchElementProps).onPress();
    const ele2 = field.filterWhere((x) => x.text() === 'Contact');
    (ele2.first().props() as TouchElementProps).onPress();
    const ele3 = field.filterWhere((x) => x.text() === 'Shipping Address');
    (ele3.first().props() as TouchElementProps).onPress();
    const ele4 = field.filterWhere((x) => x.text() === 'Template');
    (ele4.first().props() as TouchElementProps).onPress();
    const ele5 = field.filterWhere((x) => x.text() === 'Created');
    (ele5.first().props() as TouchElementProps).onPress();
  });

  it('update table rows when state.sortOp is changed', async () => {
    wrapper = mount(
      <Provider store={store2}>
        <ThemeContext.Provider value={currentTheme}>
          <Agreements navigation={navigation as any} route={{} as any} />
        </ThemeContext.Provider>
      </Provider>,
    );
    await wait(0);
    wrapper.update();
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable.prop('sortOp')).toEqual({
      sortBy: 'id',
      sortOrder: 'DESC',
    });
  });
});
