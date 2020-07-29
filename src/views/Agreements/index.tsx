/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {View, Text, ScrollView, NativeScrollEvent} from 'react-native';
import {gql, useQuery} from '@apollo/client';

import {useSelector} from 'react-redux';
import {setAction} from '@redux/actions';
import moment from 'moment';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';

import {Agreement, TableHeaderType, TableSortOps} from '@utils/types';

import {
  AppHeader,
  AppSearchInput,
  AppTextButton,
  AppText,
  AppDataTable,
  CircularLoading,
} from '@root/components';

const HEADERS: TableHeaderType[] = [
  {label: 'Id', value: 'id', sortable: true, style: {width: 100}},
  {label: 'Contact', value: 'contact', sortable: true, style: {width: 220}},
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

const FETCH_COUNT = 20;

export const FETCH_AGREEMENTS = gql`
  query AgreementQuery($offset: Int!) {
    agreements(limit: 20, offset: $offset) {
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

export default function Agreements() {
  const {styles} = useStyles(getStyles);

  const agreements = useSelector((state: any) => state.agreements);
  const agreementsSortOps = agreements.sortOp;
  const [offset, setOffset] = useState<number>(0);
  const {error, loading} = useQuery(FETCH_AGREEMENTS, {
    variables: {offset},
    onCompleted: (data) => {
      const newData = agreements.agreements.concat(data.agreements);
      setAction('agreements', {
        agreements: newData,
      });
      setVisibleAgreements(newData);
    },
  });
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [visibleAgreements, setVisibleAgreements] = useState<Agreement[]>(
    agreements.agreements,
  );

  const onSortChanged = (sortOp: TableSortOps) => {
    let sorted = sortAgreement(agreements.agreements, sortOp);
    setVisibleAgreements(sorted);
    setAction('agreements', {sortOp});
  };

  const onFilterAgreement = (text: string) => {
    const filteredAgreements = agreements.agreements.filter(
      (agreement: Agreement) =>
        `${agreement.contact?.name_first || ''} ${
          agreement.contact?.name_last || ''
        }`
          .toLowerCase()
          .indexOf(text.toLowerCase()) > -1,
    );
    let sorted = sortAgreement(filteredAgreements, agreementsSortOps);
    setVisibleAgreements(sorted);
    setSearchText(text);
  };

  const onContainerScroll = ({
    nativeEvent,
  }: {
    nativeEvent: NativeScrollEvent;
  }): void => {
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent;
    if (loading) {
      return;
    }
    if (layoutMeasurement.height > contentSize.height) {
      if (contentOffset.y > 60) {
        setOffset(offset + FETCH_COUNT);
      }
    } else {
      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height + 60
      ) {
        setOffset(offset + FETCH_COUNT);
      }
    }
  };

  const renderCell = React.useCallback(
    (header: TableHeaderType, row: Agreement) =>
      cellContent(header, row, styles),
    [agreements],
  );

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Loading Error</Text>
      </View>
    );
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
      <ScrollView
        onScroll={onContainerScroll}
        scrollEventThrottle={300}
        style={styles.container}>
        <AppDataTable
          headers={HEADERS}
          key={visibleAgreements.length || agreementsSortOps}
          sortOp={agreementsSortOps}
          renderCell={renderCell}
          rows={visibleAgreements}
          onSortChanged={onSortChanged}
        />
        <CircularLoading loading={loading} />
      </ScrollView>
    </View>
  );
}

const sortAgreement = (arr: Agreement[], sortOp: TableSortOps) => {
  const sorted = arr.sort((a: Agreement, b: Agreement) => {
    let cmpA, cmpB;
    switch (sortOp.sortBy) {
      case 'contact':
        cmpA = `${a.contact?.name_first || ''} ${
          a.contact?.name_last || ''
        }`.toUpperCase();
        cmpB = `${b.contact?.name_first || ''} ${
          b.contact?.name_last || ''
        }`.toUpperCase();
        break;
      case 'shipping_address':
        cmpA = `${a.address?.city || ''}${a.address?.city ? ', ' : ''}${
          a.address?.us_state || ''
        }`.toUpperCase();
        cmpB = `${b.address?.city || ''}${b.address?.city ? ', ' : ''}${
          b.address?.us_state || ''
        }`.toUpperCase();
        break;
      case 'agreement_template_id':
        cmpA = a.agreement_template_id;
        cmpB = b.agreement_template_id;
        break;
      case 'created':
        cmpA = `${a.created}`.toUpperCase();
        cmpB = `${b.created}`.toUpperCase();
        break;
      default:
        cmpA = a.id;
        cmpB = b.id;
    }
    let comparison = 0;
    if (cmpA > cmpB) {
      comparison = 1;
    } else if (cmpA < cmpB) {
      comparison = -1;
    }
    return comparison;
  });
  if (sortOp.sortOrder === 'DESC') {
    sorted.reverse();
  }
  return sorted;
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
              {row.contact?.name_first || ''} {row.contact?.name_last || ''}
            </>
          </AppText>
        </AppTextButton>
      );
    case 'shipping_address':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {`${row.address?.city || ''}${row.address?.city ? ', ' : ''}${
              row.address?.us_state || ''
            }`}
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
            {`${row.agreement_template_id}`}
          </AppText>
        </View>
      );
    case 'id':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={20}>
            {`${row.id}`}
          </AppText>
        </View>
      );
    default:
      return <></>;
  }
};

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
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 250,
  },
});
