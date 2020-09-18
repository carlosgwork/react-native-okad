/**
 * @jest-environment jsdom
 */

import React from 'react';
import {mount, ReactWrapper} from 'enzyme';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import VendorRow from '@root/views/Catalogs/vendorRow';
import {TableSortOps, Catalog, TouchElementProps} from '@root/utils/types';

let wrapper: ReactWrapper;

const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;

const MockData = {
  id: 1,
  logo_uri: null,
  name: 'Bruno Independent Living Aids, Inc.',
  short_name: 'Bruno',
  catalog_items: [
    {
      id: 1,
      name: 'Elan SRE-3050',
      price: 270000,
      sku: 'SRE-3050',
      cost: 155000,
      category: 'Stairlifts',
      taxable: true,
    },
    {
      id: 2,
      name: 'Elite SRE-2010',
      price: 430000,
      sku: 'SRE-2010',
      cost: 239400,
      category: 'Stairlifts',
      taxable: true,
    },
  ] as Catalog[],
  sortOps: {
    sortBy: '',
    sortOrder: 'ASC',
  } as TableSortOps,
};
const mockCallback = jest.fn();
const navigation = {navigate: jest.fn()};

describe('VendorRow Component in Catalogs page', () => {
  beforeEach(() => {
    wrapper = mount(
      <ThemeContext.Provider value={currentTheme}>
        <VendorRow
          navigation={navigation}
          vendorName={MockData.name}
          catalogSortOps={MockData.sortOps}
          catalogs={MockData.catalog_items}
          sortChanged={mockCallback}
        />
      </ThemeContext.Provider>,
    );
  });

  it('renders a dataTable with 2 rows', () => {
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    expect(dataTable.prop('rows')).toBe(MockData.catalog_items);
  });

  it('sorts rows by name/sku/cost/price fields', () => {
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    const nameField = dataTable.find('Memo(TableHeader)');
    const field = nameField.find('TouchableOpacity');
    const ele = field.filterWhere((x) => x.text() === 'Sku');
    expect(ele).toHaveLength(1);
    (ele.first().props() as TouchElementProps).onPress();
    expect(mockCallback).toBeCalledWith({
      sortBy: 'sku',
      sortOrder: 'ASC',
    });
    const ele2 = field.filterWhere((x) => x.text() === 'Name');
    (ele2.first().props() as TouchElementProps).onPress();
    expect(mockCallback).toBeCalledWith({
      sortBy: 'name',
      sortOrder: 'ASC',
    });
    const ele3 = field.filterWhere((x) => x.text() === 'Cost');
    (ele3.first().props() as TouchElementProps).onPress();
    expect(mockCallback).toBeCalledWith({
      sortBy: 'cost',
      sortOrder: 'ASC',
    });
    const ele4 = field.filterWhere((x) => x.text() === 'Price');
    (ele4.first().props() as TouchElementProps).onPress();
    expect(mockCallback).toBeCalledWith({
      sortBy: 'price',
      sortOrder: 'ASC',
    });
  });
});
