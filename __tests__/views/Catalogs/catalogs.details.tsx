/**
 * @jest-environment jsdom
 */

import React from 'react';
import {Provider} from 'react-redux';
import {mount, ReactWrapper} from 'enzyme';
import numeral from 'numeral';
import moment from 'moment';

import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import configureStore from 'redux-mock-store';
import {VENDORS_MOCKDATA} from '../../__mocks__/Vendors';
import CatalogDetails from '@root/views/Catalogs/Details';

const mockStore = configureStore([]);
const theme = 'normal';
const currentTheme = {
  setTheme: jest.fn(),
  theme,
  themeStyle: getThemeStyle(theme),
} as ThemeContextType;
const store = mockStore({
  vendors: {
    vendors: [],
    searchText: '',
    sortOptions: [],
  },
});

let wrapper: ReactWrapper;
const navigation = {navigate: jest.fn()};
const Catalog_MOCKDATA = VENDORS_MOCKDATA.vendors[0].catalog_items[0];
const routeParam = {
  params: {
    vendor: '',
    data: Catalog_MOCKDATA,
  },
};

describe('Catalogs Details Page Component', () => {
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <CatalogDetails
            navigation={navigation as any}
            route={routeParam as any}
          />
        </ThemeContext.Provider>
      </Provider>,
    );
    wrapper.update();
  });

  it('renders successfully AppHeader.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader).toHaveLength(1);
    expect(appHeader.find('Text').contains('Elan SRE-3050')).toEqual(true);
  });

  it('renders fields of Catalog item.', () => {
    expect(wrapper.find('Text').contains('CATEGORY')).toEqual(true);
    expect(wrapper.find('Text').contains('SKU')).toEqual(true);
    expect(wrapper.find('Text').contains('COST')).toEqual(true);
    expect(wrapper.find('Text').contains('PRICE')).toEqual(true);
    expect(wrapper.find('Text').contains('TAXABLE')).toEqual(true);
    expect(wrapper.find('Text').contains('INSTALLATION FEE')).toEqual(true);
    expect(
      wrapper.find('Text').contains(Catalog_MOCKDATA.category),
    ).toBeTruthy();
    expect(
      wrapper
        .find('Text')
        .contains(`$${numeral(Catalog_MOCKDATA.cost / 100).format('0,0.00')}`),
    ).toEqual(true);
    expect(wrapper.find('Text').contains(Catalog_MOCKDATA.sku)).toEqual(true);
  });

  it('renders lastUpdated section.', () => {
    expect(wrapper.find('Text').contains('LAST UPDATED')).toEqual(true);
    expect(
      wrapper
        .find('Text')
        .contains(
          `${moment(Catalog_MOCKDATA.created).format(
            'MMMM DD, YYYY',
          )} at ${moment(Catalog_MOCKDATA.created).format('H:mm A')}`,
        ),
    ).toEqual(true);
  });

  it('renders description section.', () => {
    expect(wrapper.find('Text').contains('DESCRIPTION')).toEqual(true);
    expect(wrapper.find('Text').contains(Catalog_MOCKDATA.description)).toEqual(
      true,
    );
  });
});
