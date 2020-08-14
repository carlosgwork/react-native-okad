import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MapView from 'react-native-maps';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import {gql, useQuery} from '@apollo/client';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';

import {
  AppHeader,
  NavBackBtn,
  AppText,
  AppTextButton,
  AppDataTable,
} from '@root/components';
import {ContactsNavProps, AppRouteEnum} from '@root/routes/types';
import {Agreement, TableHeaderType, TableSortOps} from '@utils/types';

const HEADERS: TableHeaderType[] = [
  {label: 'NUMBER', value: 'id', sortable: true, style: {width: 100}},
  {label: 'Contact', value: 'contact', sortable: true, style: {width: 220}},
  {
    label: 'AMOUNT',
    value: 'shipping_address',
    sortable: true,
    style: {width: 150},
  },
  {
    label: 'TYPE',
    value: 'agreement_template_id',
    sortable: true,
    style: {width: 150},
  },
  {label: 'DATE', value: 'created', sortable: true, style: {flex: 1}},
];

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

export const FETCH_AGREEMENTS = gql`
  query AgreementQuery($offset: Int!) {
    agreements(limit: 20, offset: $offset) {
      created
      agreement_template_id
      number
      last_modified
      id
      public_id
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

export default function ContactDetails({
  route,
  navigation,
}: ContactsNavProps<AppRouteEnum.ContactDetails>) {
  const {styles} = useStyles(getStyles);
  const {themeStyle} = useTheme();
  const {parent = 'Contacts', itemTitle = ''} = route.params || {};

  const agreementsSortOps: TableSortOps = {sortBy: 'id', sortOrder: 'ASC'};
  useQuery(FETCH_AGREEMENTS, {
    onCompleted: (data) => {
      const newData = data.agreements.slice();
      setVisibleAgreements(newData);
    },
  });
  const [visibleAgreements, setVisibleAgreements] = useState<Agreement[]>([]);

  const renderCell = (header: TableHeaderType, row: Agreement) =>
    cellContent(header, row, styles);

  const onSortChanged = (sortOp: TableSortOps) => {
    let sorted = sortAgreement(visibleAgreements, sortOp);
    setVisibleAgreements(sorted);
  };

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn title={parent} onClick={() => navigation.pop()} />
        }
        rightContent={null}
        pageTitle={itemTitle}
        toolbarCenterContent={
          <View style={[styles.rowLayout, styles.topBarCenterView]}>
            <TouchableOpacity style={styles.rowLayout}>
              <View style={styles.iconBtn}>
                <FontAwesome5Icon
                  solid
                  name="comment"
                  size={15}
                  color={'white'}
                />
              </View>
              <AppText color={'textLightPurple'} size={14} font={'anSemiBold'}>
                Message
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rowLayout}>
              <View style={styles.iconBtn}>
                <FontAwesome5Icon
                  solid
                  name="phone-alt"
                  size={15}
                  color={'white'}
                />
              </View>
              <AppText color={'textLightPurple'} size={14} font={'anSemiBold'}>
                Call
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rowLayout}>
              <View style={styles.iconBtn}>
                <FontAwesome5Icon
                  solid
                  name="envelope"
                  size={15}
                  color={'white'}
                />
              </View>
              <AppText color={'textLightPurple'} size={14} font={'anSemiBold'}>
                Email
              </AppText>
            </TouchableOpacity>
          </View>
        }
        sameSize={true}
        toolbarRightContent={
          <View style={styles.alignRight}>
            <AppText
              style={styles.lineHeight15}
              color={'textBlack2'}
              size={14}
              font={'anMedium'}>
              12405 Montague St
            </AppText>
            <AppText
              style={styles.lineHeight15}
              color={'textBlack2'}
              size={14}
              font={'anMedium'}>
              Pacoima CA 91331
            </AppText>
          </View>
        }
      />
      <View style={styles.mainContent}>
        <View style={styles.mapView}>
          <MapView
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            style={
              {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }
            }
          />
        </View>
        <View style={[styles.rowLayout, styles.datalistTitleView]}>
          <AppText size={20} color={'textBlack2'} font={'anSemiBold'}>
            Agreements
          </AppText>
          <AppTextButton
            style={{...styles.cellLayout, ...styles.agreementsBtn}}
            onPress={
              () => {}
              // navigation.navigate('NewAgreement', {
              //   parent: 'Contacts',
              //   contact: row,
              //   itemTitle: `${row.name_first} ${row.name_last}`,
              // })
            }
            leftIconContent={
              <Icon
                color={themeStyle.textLightPurple}
                name={'pluscircleo'}
                type={'antdesign'}
                size={18}
              />
            }>
            <AppText
              style={styles.noSpacing}
              color={'textLightPurple'}
              size={16}
              font={'anSemiBold'}>
              New agreement
            </AppText>
          </AppTextButton>
        </View>
        <View style={styles.rowLayout}>
          <AppDataTable
            headers={HEADERS}
            key={visibleAgreements.length}
            sortOp={agreementsSortOps}
            renderCell={renderCell}
            rows={visibleAgreements}
            onSortChanged={onSortChanged}
          />
        </View>
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

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  logo: {
    resizeMode: 'stretch',
    maxWidth: 230,
    height: themeStyle.scale(24),
  },
  mainContent: {
    paddingVertical: themeStyle.scale(10),
    paddingHorizontal: themeStyle.scale(15),
    flex: 1,
  },
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarCenterView: {
    justifyContent: 'space-between',
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  lineHeight15: {
    lineHeight: 19,
    height: 19,
  },
  iconBtn: {
    backgroundColor: themeStyle.textLightPurple,
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
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
  agreementsBtn: {
    justifyContent: 'flex-end',
  },
  mapView: {
    height: 400,
  },
  datalistTitleView: {
    justifyContent: 'space-between',
  },
});
