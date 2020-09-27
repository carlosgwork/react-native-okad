/**
 * @jest-environment jsdom
 */

import React from 'react';
import Contacts from '@root/views/Contacts';
import {Provider} from 'react-redux';
import {mount, ReactWrapper} from 'enzyme';
import wait from 'waait';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import configureStore from 'redux-mock-store';
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
  contacts: {
    contacts: [],
    sortOp: {
      sortBy: '',
      sortOrder: 'ASC',
    },
  },
});
const store2 = mockStore({
  contacts: {
    contacts: [],
    sortOp: {
      sortBy: 'name',
      sortOrder: 'DESC',
    },
  },
});

const navigation = {navigate: jest.fn()};

describe('Contacts Page', () => {
  it('renders successfully', async () => {
    wrapper = mount(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Contacts navigation={navigation as any} route={{} as any} />
        </ThemeContext.Provider>
      </Provider>,
    );
    await wait(0);
    wrapper.update();
    const header = wrapper.find('Memo(AppHeader)');
    expect(header).toHaveLength(1);
    expect(header.find('Memo(AppSearchInput)')).toHaveLength(1);
  });

  it('should have one Table component with 4 columns', async () => {
    wrapper = mount(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Contacts navigation={navigation as any} route={{} as any} />
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
    expect(dataTable.text()).toContain('Location');
    expect(dataTable.text()).toContain('Phone Number');
  });

  it('sorts rows by Id/Contact/Shipping Address/Template Id/Created fields', () => {
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    const nameField = dataTable.find('Memo(TableHeader)');
    const field = nameField.find('TouchableOpacity');
    const ele = field.filterWhere((x) => x.text() === 'Name');
    expect(ele).toHaveLength(1);
    (ele.first().props() as TouchElementProps).onPress();
    const ele2 = field.filterWhere((x) => x.text() === 'Location');
    (ele2.first().props() as TouchElementProps).onPress();
    const ele3 = field.filterWhere((x) => x.text() === 'Phone Number');
    (ele3.first().props() as TouchElementProps).onPress();
  });

  it('update table rows when state.sortOp is changed', async () => {
    wrapper = mount(
      <Provider store={store2}>
        <ThemeContext.Provider value={currentTheme}>
          <Contacts navigation={navigation as any} route={{} as any} />
        </ThemeContext.Provider>
      </Provider>,
    );
    await wait(0);
    wrapper.update();
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable.prop('sortOp')).toEqual({
      sortBy: 'name',
      sortOrder: 'DESC',
    });
  });
});
