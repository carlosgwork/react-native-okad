/**
 * @jest-environment jsdom
 */

import React from 'react';
import {Provider} from 'react-redux';
import {mount, ReactWrapper} from 'enzyme';
import {ThemeContext, ThemeContextType} from '@global/Context';
import getThemeStyle from '@root/utils/styles';
import configureStore from 'redux-mock-store';
import ContactDetails from '@root/views/Contacts/Details';
import {CONTACT_DETAILS_MOCKDATA} from '../../__mocks__/ContactDetails';
import wait from 'waait';

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
    contacts: [CONTACT_DETAILS_MOCKDATA],
  },
  agreements: {
    agreements: [],
    sortOp: {
      sortBy: 'number',
      sortOrder: 'ASC',
    },
  },
});

const navigation = {navigate: jest.fn()};
const route = {
  params: {
    itemTitle: 'Irving Marvin',
    itemId: 1,
  },
};

describe('Contacts Details Page', () => {
  beforeEach(async () => {
    wrapper = mount(
      <Provider store={store}>
        <ThemeContext.Provider value={currentTheme}>
          <ContactDetails navigation={navigation as any} route={route as any} />
        </ThemeContext.Provider>
      </Provider>,
    );
    await wait(0);
    wrapper.update();
  });

  it('renders successfully.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader).toHaveLength(1);
    expect(appHeader.find('Text').contains('Irving Marvin')).toEqual(true);
  });

  it('should have message, call and email buttons.', () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(appHeader.find('Memo(AppText)').contains('Message')).toEqual(true);
    expect(appHeader.find('Memo(AppText)').contains('Call')).toEqual(true);
    expect(appHeader.find('Memo(AppText)').contains('Email')).toEqual(true);
  });

  it("should have contact users's address on the Header.", () => {
    const appHeader = wrapper.find('Memo(AppHeader)');
    expect(
      appHeader
        .find('Memo(AppText)')
        .contains(CONTACT_DETAILS_MOCKDATA.address.line1),
    ).toEqual(true);
    expect(
      appHeader
        .find('Memo(AppText)')
        .contains(CONTACT_DETAILS_MOCKDATA.address.line1),
    ).toEqual(true);
    expect(
      appHeader
        .find('Memo(AppText)')
        .contains(
          `${CONTACT_DETAILS_MOCKDATA.address.city} ${CONTACT_DETAILS_MOCKDATA.address.us_state} ${CONTACT_DETAILS_MOCKDATA.address.postal_code}`,
        ),
    ).toEqual(true);
  });

  it('should have a MapView and Directions button', () => {
    const mapView = wrapper.find('MapView');
    expect(mapView).toHaveLength(1);
    expect(mapView.prop('initialRegion')).toBeTruthy();
    const mapViewContainer = mapView.parents().at(0);
    expect(
      mapViewContainer.find('TouchableOpacity').contains('DIRECTIONS'),
    ).toBeTruthy();
  });

  it('should have a New agreement button', () => {
    expect(
      wrapper.find('Memo(AppText)').contains('New agreement'),
    ).toBeTruthy();
  });

  it('should have one Table component with 4 columns', async () => {
    const dataTable = wrapper.find('Memo(AppDataTable)');
    expect(dataTable).toHaveLength(1);
    expect(dataTable.prop('sortOp')).toEqual({
      sortBy: 'number',
      sortOrder: 'ASC',
    });
    expect(dataTable.text()).toContain('NUMBER');
    expect(dataTable.text()).toContain('DATE');
    expect(dataTable.text()).toContain('AMOUNT');
    expect(dataTable.text()).toContain('TYPE');
  });
});
