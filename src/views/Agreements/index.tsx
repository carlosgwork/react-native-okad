/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {View, Text} from 'react-native';
import gql from 'graphql-tag';

import {useSelector} from 'react-redux';
import {setAction} from '@redux/actions';
import {useQuery} from '@apollo/react-hooks';
import moment from 'moment';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';

import {Agreement, TableHeaderType} from '@utils/types';

import {
  AppHeader,
  AppSearchInput,
  AppTextButton,
  AppText,
  AppDataTable,
  Loading,
} from '@root/components';

const HEADERS: TableHeaderType[] = [
  {label: 'Id', value: 'id', sortable: false, style: {width: 100}},
  {label: 'Contact', value: 'contact', sortable: true, style: {width: 200}},
  {
    label: 'Shipping Address',
    value: 'shipping_address',
    sortable: true,
    style: {flex: 1},
  },
  {
    label: 'Template Id',
    value: 'agreement_template_id',
    sortable: true,
    style: {width: 120},
  },
  {label: 'Created', value: 'created', sortable: true, style: {width: 150}},
];

export const FETCH_TODOS = gql`
  query {
    agreements {
      created
      agreement_template_id
      number
      last_modified
      id
      public_id
      addressByBillingAddressId {
        city
        us_state
      }
      contact {
        name_last
        name_first
      }
      address {
        city
        us_state
      }
    }
  }
`;

const sortAgreement = (arr: Agreement[], sortBy: string) => {
  return arr.sort((a: Agreement, b: Agreement) => {
    let cmpA = '',
      cmpB = '';
    switch (sortBy) {
      case 'contact':
        cmpA = `${a.contact?.name_first} ${a.contact?.name_last}`.toUpperCase();
        cmpB = `${b.contact?.name_first} ${b.contact?.name_last}`.toUpperCase();
        break;
      case 'shipping_address':
        cmpA = (a.address?.city + ', ' + a.address?.us_state).toUpperCase();
        cmpB = (b.address?.city + ', ' + b.address?.us_state).toUpperCase();
        break;
      case 'agreement_template_id':
        cmpA = `${a.agreement_template_id}`.toUpperCase();
        cmpB = `${b.agreement_template_id}`.toUpperCase();
        break;
      case 'created':
        cmpA = `${a.created}`.toUpperCase();
        cmpB = `${b.created}`.toUpperCase();
        break;
      default:
    }
    let comparison = 0;
    if (cmpA > cmpB) {
      comparison = 1;
    } else if (cmpA < cmpB) {
      comparison = -1;
    }
    return comparison;
  });
};

const cellContent = (header: TableHeaderType, row: Agreement, styles: any) => {
  switch (header.value) {
    case 'contact':
      return (
        <AppTextButton style={styles.cellLayout} onPress={() => {}}>
          <AppText
            style={styles.noSpacing}
            color={'textPurple'}
            size={20}
            font={'anSemiBold'}>
            <>
              {row.contact?.name_first} {row.contact?.name_last}
            </>
          </AppText>
        </AppTextButton>
      );
    case 'shipping_address':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {`${row.address?.city}, ${row.address?.us_state}`}
          </AppText>
        </View>
      );
    case 'created':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {moment(row.created).format('MMM DD, YYYY')}
          </AppText>
        </View>
      );
    case 'agreement_template_id':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {row.agreement_template_id}
          </AppText>
        </View>
      );
    case 'id':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {row.id}
          </AppText>
        </View>
      );
    default:
      return <></>;
  }
};

export default function Agreements() {
  const {themeStyle} = useTheme();
  const {styles} = useStyles(getStyles);

  const agreements = useSelector((state: any) => state.agreements);
  const agreementsSortOps = agreements.sortOp;
  const {data, error, loading} = useQuery(FETCH_TODOS);
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [visibleAgreements, setVisibleAgreements] = useState<Agreement[]>(
    agreements.agreements,
  );

  const onSortChanged = React.useCallback((sortOp) => {
    let sorted = sortAgreement(agreements.agreements, sortOp.sortBy);
    if (sortOp.sortOrder === 'DESC') {
      sorted = sorted.reverse();
    }
    setVisibleAgreements(sorted);
    setAction('agreements', {sortOp});
  }, []);

  const onFilterAgreement = (text) => setSearchText(text);

  const renderCell = React.useCallback(
    (header: TableHeaderType, row: Agreement) =>
      cellContent(header, row, styles, themeStyle),
    [agreements],
  );

  if (!agreements.agreements.length) {
    if (error) {
      console.error(error);
      return <Text>Error</Text>;
    }
    if (loading) {
      return <Loading />;
    }
    setAction('agreements', {
      agreements: data.agreements,
    });
    setVisibleAgreements(data.agreements);
  }

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={null}
        rightContent={null}
        pageTitle={'Agreements'}
        toolbarCenterContent={null}
        toolbarRightContent={
          <AppSearchInput value={searchText} onChange={onFilterAgreement} />
        }
      />

      <AppDataTable
        headers={HEADERS}
        key={visibleAgreements.length || agreementsSortOps}
        sortOp={agreementsSortOps}
        renderCell={renderCell}
        rows={visibleAgreements}
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
