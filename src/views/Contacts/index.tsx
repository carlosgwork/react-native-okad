/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {View} from 'react-native';

import {useSelector} from 'react-redux';
import {setAction} from '@redux/actions';
import {Icon} from 'react-native-elements';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';

import {Contact, TableHeaderType} from '@utils/types';

import {
  AppHeader,
  AppGradButton,
  AppSearchInput,
  AppTextButton,
  AppText,
  AppDataTable,
} from '@root/components';

const HEADERS: TableHeaderType[] = [
  {label: 'Name', value: 'name', sortable: false, style: {width: 150}},
  {label: 'Location', value: 'location', sortable: true, style: {flex: 1}},
  {
    label: 'Phone Number',
    value: 'phoneNumber',
    sortable: true,
    style: {flex: 1},
  },
  {label: '', value: 'actions', sortable: false, style: {flex: 1}},
];

const mockContacts = [
  {
    name_first: 'Song',
    name_last: 'Bao',
    phone_mobile: '(555) 555-5555',
    location: 'Charlotte, NC',
    count: undefined,
  },
  {
    name_first: 'Roy',
    name_last: 'Smith',
    phone_mobile: '(555) 555-5555',
    location: 'Chrotte, NC',
    count: 1,
  },
  {
    name_first: 'Ben',
    name_last: 'Smith',
    phone_mobile: '(555) 555-5555',
    location: 'Chrotte, NC',
    count: 2,
  },
];

export default function Contacts() {
  const {themeStyle} = useTheme();
  const {styles} = useStyles(getStyles);

  const contacts = useSelector((state: any) => state.contacts);
  const contactsSortOps = contacts.sortOp;

  const [searchText, setSearchText] = React.useState<string | undefined>('');

  React.useEffect(() => {
    // fetchContact()
    setAction('contacts', {
      contacts: mockContacts,
    });
  }, [contactsSortOps]);

  const onNamePress = React.useCallback(() => {
    // handler
  }, []);
  const onSortChanged = React.useCallback((sortOp) => {
    setAction('contacts', {sortOp});
  }, []);
  const cellContent = (header: TableHeaderType, row: Contact) => {
    switch (header.value) {
      case 'name':
        return (
          <AppTextButton style={styles.cellLayout} onPress={onNamePress}>
            <AppText
              style={styles.noSpacing}
              color={'textPurple'}
              size={20}
              font={'anSemiBold'}>
              <>
                {row.name_first} {row.name_last}
              </>
            </AppText>
          </AppTextButton>
        );
      case 'location':
        return (
          <View style={styles.cellLayout}>
            <AppText style={styles.noSpacing} size={20}>
              {row.location}
            </AppText>
          </View>
        );
      case 'phoneNumber':
        return (
          <View style={styles.cellLayout}>
            <AppText style={styles.noSpacing} size={20}>
              {row.phone_mobile}
            </AppText>
          </View>
        );
      case 'actions':
        if (row.count) {
          return (
            <AppTextButton
              style={{...styles.cellLayout, ...styles.agreementsBtn}}
              leftIconContent={<></>}>
              <AppText
                style={styles.noSpacing}
                color={'textPurple'}
                size={20}
                font={'anSemiBold'}>
                {`${row.count} agreements`}
              </AppText>
            </AppTextButton>
          );
        }
        return (
          <AppTextButton
            style={{...styles.cellLayout, ...styles.agreementsBtn}}
            leftIconContent={
              <Icon
                color={themeStyle.textPurple}
                name={'pluscircleo'}
                type={'antdesign'}
                size={20}
              />
            }>
            <AppText
              style={styles.noSpacing}
              color={'textPurple'}
              size={20}
              font={'anSemiBold'}>
              New agreement
            </AppText>
          </AppTextButton>
        );
      default:
        return <></>;
    }
  };

  const renderCell = React.useCallback(
    (header: TableHeaderType, row: Contact) => cellContent(header, row),
    [contacts],
  );

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={null}
        rightContent={null}
        pageTitle={'Contacts'}
        toolbarCenterContent={
          <View style={styles.flexlayout}>
            <AppGradButton
              title={'NEW'}
              leftIconContent={
                <Icon
                  color={themeStyle.textWhite}
                  name={'pluscircle'}
                  type={'antdesign'}
                  size={22}
                />
              }
            />
          </View>
        }
        toolbarRightContent={
          <AppSearchInput
            value={searchText}
            onChange={(text: string) => setSearchText(text)}
          />
        }
      />

      <AppDataTable
        headers={HEADERS}
        sortOp={contactsSortOps}
        renderCell={renderCell}
        rows={contacts.contacts}
        onSortChanged={onSortChanged}
      />
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18,
    }),
  },
  agreementsBtn: {
    justifyContent: 'flex-end',
  },
  flexlayout: {
    flexDirection: 'row',
  },
  cellLayout: {
    paddingTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 5,
    height: 40,
  },
  noSpacing: {
    letterSpacing: 0,
  },
});
