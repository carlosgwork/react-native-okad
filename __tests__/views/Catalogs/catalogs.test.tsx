/**
 * @jest-environment jsdom
 */

import React from 'react';
import {Provider} from 'react-redux';
import {mount, ReactWrapper} from 'enzyme';
import wait from 'waait';
import configureStore from 'redux-mock-store';

import Catalogs from '@root/views/Catalogs';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import {VENDORS_MOCKDATA} from '../../__mocks__/Vendors';

let wrapper: ReactWrapper;

const mockStore = configureStore([]);
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;
const store = mockStore({
  vendors: {
    vendors: VENDORS_MOCKDATA.vendors,
    searchText: '',
    sortOptions: [],
  },
});

const navigation = {navigate: jest.fn()};

describe('Catalogs Page Component', () => {
  it('renders successfully', async () => {
    wrapper = mount(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Catalogs navigation={navigation as any} route={{} as any} />
        </ThemeContext.Provider>
      </Provider>,
    );
    await wait(0);
    wrapper.update();
    const header = wrapper.find('Memo(AppHeader)');
    expect(header).toHaveLength(1);
    expect(header.find('Memo(AppSearchInput)')).toHaveLength(1);
  });

  it('should have one vendorRow component and valid props', async () => {
    wrapper = mount(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <Catalogs navigation={navigation as any} route={{} as any} />
        </ThemeContext.Provider>
      </Provider>,
    );
    await wait(0);
    wrapper.update();
    const vendorRowEle = wrapper.find('VendorRow');
    expect(vendorRowEle).toHaveLength(1);
    expect(vendorRowEle.prop('vendorName')).toEqual(
      'Bruno Independent Living Aids, Inc.',
    );
    expect(vendorRowEle.prop('catalogs')).toEqual(
      VENDORS_MOCKDATA.vendors[0].catalog_items,
    );
    expect(vendorRowEle.prop('catalogSortOps')).toEqual({
      sortBy: '',
      sortOrder: 'ASC',
    });
    const dataTable = vendorRowEle.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    expect(dataTable.text()).toContain('Sku');
    expect(dataTable.text()).toContain('Name');
    expect(dataTable.text()).toContain('Cost');
    expect(dataTable.text()).toContain('Price');
    expect(dataTable.text()).toContain('Taxable');
  });
});
