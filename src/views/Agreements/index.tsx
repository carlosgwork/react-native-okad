/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, NativeScrollEvent, Alert} from 'react-native';
import {gql, useQuery} from '@apollo/client';
import numeral from 'numeral';

import {useSelector} from 'react-redux';
import {setAction} from '@redux/actions';
import moment from 'moment';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {ContactsNavProps, AppRouteEnum} from '@root/routes/types';
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
  {label: 'Name', value: 'name', sortable: true, style: {width: 120}},
  {label: 'Contact', value: 'contact', sortable: true, style: {width: 220}},
  {
    label: 'Shipping Address',
    value: 'shipping_address',
    sortable: true,
    style: {width: 250},
  },
  {
    label: 'Template',
    value: 'agreement_template_id',
    sortable: true,
    style: {flex: 1},
  },
  {label: 'Created', value: 'created', sortable: true, style: {width: 150}},
];

const FETCH_COUNT = 20;

export const FETCH_AGREEMENTS = gql`
  query AgreementQuery($offset: Int!) {
    agreements(limit: 20, offset: $offset, order_by: {id: desc}) {
      id
      agreement_template_id
      agreement_events {
        type
        id
      }
      address {
        city
        county
        id
        line1
        line2
        us_state
        postal_code
      }
      addressByShippingAddressId {
        city
        county
        id
        line2
        line1
        us_state
        postal_code
      }
      contact {
        name_first
        name_last
        id
      }
      contact_id
      line_items {
        agreement_id
        catalog_item_id
        current_cost
        discount
        price
        qty
        id
        catalog_item {
          name
        }
      }
      number
      revision
      sales_tax_rate
      shipping_address_id
      signature
      user {
        prefix
        pres
        public_id
        name_last
        name_first
        google_id
        email
        default_sales_tax_rate
        organization_id
      }
      user_id
      created
      last_modified
    }
  }
`;

export default function Agreements({
  navigation,
}: ContactsNavProps<AppRouteEnum.AgreementsMain>) {
  const {styles} = useStyles(getStyles);

  const agreements = useSelector((state: any) => state.agreements);
  const agreementsSortOps = agreements.sortOp;
  const [offset, setOffset] = useState<number>(0);
  const [showError, setShowError] = useState<boolean>(false);
  const {loading, error} = useQuery(FETCH_AGREEMENTS, {
    variables: {offset},
    onCompleted: (data) => {
      const newData = agreements.agreements.concat(data.agreements);
      setAction('agreements', {
        agreements: newData,
      });
    },
    onError: (err) => {
      Alert.alert(err.message);
    },
  });
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [visibleAgreements, setVisibleAgreements] = useState<Agreement[]>(
    agreements.agreements,
  );

  useEffect(() => {
    setVisibleAgreements(agreements.agreements);
  }, [agreements, navigation]);

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

  if (loading && error && !showError) {
    setShowError(true);
    Alert.alert(error.message);
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
      <View style={styles.mainContent}>
        <AppDataTable
          headers={HEADERS}
          key={visibleAgreements.length || agreementsSortOps}
          sortOp={agreementsSortOps}
          renderCell={renderCell}
          rows={visibleAgreements}
          onSortChanged={onSortChanged}
          onScroll={onContainerScroll}
        />
        <CircularLoading loading={loading && !error} />
      </View>
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
      case 'name':
        cmpA = `${a.user?.prefix || ''}${numeral(a.number).format(
          '00000',
        )}`.toUpperCase();
        cmpB = `${b.user?.prefix || ''}${numeral(b.number).format(
          '00000',
        )}`.toUpperCase();
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
          <AppText style={styles.noSpacing} size={16}>
            <>
              {row.contact?.name_first || ''} {row.contact?.name_last || ''}
            </>
          </AppText>
        </AppTextButton>
      );
    case 'name':
      return (
        <AppTextButton style={styles.cellLayout} onPress={() => {}}>
          <AppText
            style={styles.noSpacing}
            color={'textLightPurple'}
            size={16}
            font={'anSemiBold'}>
            {`${row.user?.prefix || ''}${numeral(row.number).format('00000')}`}
          </AppText>
        </AppTextButton>
      );
    case 'shipping_address':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={16}>
            {`${row.address?.city || ''}${row.address?.city ? ', ' : ''}${
              row.address?.us_state || ''
            }`}
          </AppText>
        </View>
      );
    case 'created':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={16}>
            {moment(row.created).format('MMM DD, YYYY')}
          </AppText>
        </View>
      );
    case 'agreement_template_id':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={16}>
            {'Bruno Straight Stairlift'}
          </AppText>
        </View>
      );
    case 'id':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={16}>
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
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
  },
  noSpacing: {
    letterSpacing: 0,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 250,
  },
  mainContent: {
    marginTop: 10,
    flex: 1,
  },
});
