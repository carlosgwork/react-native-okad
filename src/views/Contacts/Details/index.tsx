/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Linking, Image} from 'react-native';
import MapView from 'react-native-maps';
import {Icon} from 'react-native-elements';
import moment from 'moment';
import numeral from 'numeral';
import {useSelector} from 'react-redux';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';
import {
  AppHeader,
  NavBackBtn,
  AppText,
  AppTextButton,
  AppDataTable,
  AppGradButton,
} from '@root/components';
import {AppNavProps, AppRouteEnum} from '@root/routes/types';
import {Agreement, TableHeaderType, TableSortOps, Contact} from '@utils/types';
import {emptyContact} from '@root/utils/constants';
import {MsgIcon, CallIcon, EnvelopIcon} from '@root/assets/assets';

const HEADERS: TableHeaderType[] = [
  {label: 'NUMBER', value: 'number', sortable: true, style: {width: 200}},
  {label: 'DATE', value: 'created', sortable: true, style: {width: 200}},
  {
    label: 'AMOUNT',
    value: 'amount',
    sortable: true,
    style: {width: 200},
  },
  {
    label: 'TEMPLATE',
    value: 'agreement_template_name',
    sortable: true,
    style: {flex: 1},
  },
];

const cellContent = (
  navigation: any,
  header: TableHeaderType,
  row: Agreement,
  contact: Contact,
  styles: any,
) => {
  switch (header.value) {
    case 'number':
      return (
        <AppTextButton
          style={styles.cellLayout}
          onPress={() => {
            navigation.navigate(AppRouteEnum.ContactAgreementDetails, {
              agreement: row,
              contact: contact,
              parent: `${contact.name_first} ${contact.name_last}`,
            });
          }}>
          <AppText
            style={styles.noSpacing}
            color={'textLightPurple'}
            size={16}
            font={'anSemiBold'}>
            {`${row.user?.prefix || ''}${numeral(row.number).format('00000')}`}
          </AppText>
        </AppTextButton>
      );
    case 'amount':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={16}>
            {row.amount ? `$${numeral(row.amount / 100).format('0,0.00')}` : ''}
          </AppText>
        </View>
      );
    case 'created':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={16}>
            {moment(row.created).format('M/DD/YYYY')}
          </AppText>
        </View>
      );
    case 'agreement_template_name':
      return (
        <View style={styles.cellLayout}>
          <AppText style={styles.noSpacing} size={16}>
            {row.agreement_template.name}
          </AppText>
        </View>
      );
    default:
      return <></>;
  }
};

export default function ContactDetails({
  route,
  navigation,
}: AppNavProps<AppRouteEnum.ContactDetails>) {
  const {styles} = useStyles(getStyles);
  const {themeStyle} = useTheme();
  const [contactData, setContactData] = useState<Contact>(emptyContact);
  const {parent = 'Contacts', itemTitle = '', itemId} = route.params || {};
  const [agreementsSortOps, setAgreementsSortOps] = useState<TableSortOps>({
    sortBy: 'number',
    sortOrder: 'ASC',
  });
  const {contacts, agreements} = useSelector((state: any) => ({
    contacts: state.contacts.contacts,
    agreements: state.agreements.agreements,
  }));
  const [visibleAgreements, setVisibleAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    const itemIndex = contacts.findIndex(
      (contact: Contact) => contact.id === itemId,
    );
    const newData = contacts[itemIndex];
    setContactData(newData);
    const temp: Agreement[] = [];
    newData.agreements?.forEach((ag: Agreement) => {
      const newAg = Object.assign({}, ag);
      let amount = 0;
      newAg.line_items?.map((item: any) => {
        amount += item.qty * item.price - item.discount;
      });
      amount = (amount * (100 + ag.sales_tax_rate)) / 100;
      newAg.amount = amount;
      temp.push(newAg);
    });
    newData.offlineAgreements?.forEach((ag: number) => {
      const agIndex = agreements.findIndex(
        (agreement: Agreement) => agreement.id === ag,
      );
      const newAg = Object.assign({}, agreements[agIndex]);
      let amount = 0;
      newAg.line_items?.map((item: any) => {
        amount += item.qty * item.price - item.discount;
      });
      amount = (amount * (100 + newAg.sales_tax_rate)) / 100;
      newAg.amount = amount;
      temp.push(newAg);
    });
    setVisibleAgreements(temp);
  }, [contacts, itemId]);

  const renderCell = (header: TableHeaderType, row: Agreement) =>
    cellContent(navigation, header, row, contactData, styles);

  const onSortChanged = (sortOp: TableSortOps) => {
    setAgreementsSortOps(sortOp);
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
              <Image source={MsgIcon} style={styles.iconBtn} />
              <AppText color={'textLightPurple'} size={14} font={'anSemiBold'}>
                Message
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rowLayout}
              onPress={() =>
                Linking.openURL(
                  `tel:${contactData.phone_mobile || contactData.phone_office}`,
                )
              }>
              <Image source={CallIcon} style={styles.iconBtn} />
              <AppText color={'textLightPurple'} size={14} font={'anSemiBold'}>
                Call
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rowLayout}
              onPress={() => Linking.openURL(`mailto:${contactData.email}`)}>
              <Image source={EnvelopIcon} style={styles.iconBtn} />
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
              {contactData.address.line1}
            </AppText>
            <AppText
              style={styles.lineHeight15}
              color={'textBlack2'}
              size={14}
              font={'anMedium'}>
              {`${contactData.address.city} ${contactData.address.us_state} ${contactData.address.postal_code}`}
            </AppText>
          </View>
        }
      />
      <View style={styles.mapView}>
        <MapView
          initialRegion={{
            latitude: contactData.address?.lat || 37.78825,
            longitude: contactData.address?.long || -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={styles.map}
        />
        <View style={styles.ctaBtn}>
          <AppGradButton
            btnStyle={styles.ctaInnerBtn}
            textStyle={styles.ctaInnerBtnText}
            title={'DIRECTIONS'}
            onPress={() => {}}
          />
        </View>
      </View>
      <View style={styles.mainContent}>
        <View style={[styles.rowLayout, styles.datalistTitleView]}>
          <AppText size={20} color={'textBlack2'} font={'anSemiBold'}>
            Agreements
          </AppText>
          <AppTextButton
            style={{...styles.cellLayout, ...styles.agreementsBtn}}
            onPress={() => {
              navigation.navigate(AppRouteEnum.NewAgreement, {
                parent: `${contactData.name_first} ${contactData.name_last}`,
                contact: contactData,
                itemTitle: `${contactData.name_first} ${contactData.name_last}`,
              });
            }}
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
        <View style={styles.fullRow}>
          <AppDataTable
            headers={HEADERS}
            key={`agreementslist-${visibleAgreements.length}`}
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
      case 'amount':
        cmpA = `${a.amount}`.toUpperCase();
        cmpB = `${b.amount}`.toUpperCase();
        break;
      case 'agreement_template_name':
        cmpA = a.agreement_template.name;
        cmpB = b.agreement_template.name;
        break;
      case 'created':
        cmpA = `${a.created}`.toUpperCase();
        cmpB = `${b.created}`.toUpperCase();
        break;
      default:
        cmpA = a.number;
        cmpB = b.number;
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
    paddingLeft: themeStyle.scale(15),
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
    width: 30,
    height: 30,
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
    marginRight: 15,
  },
  mapView: {
    height: 300,
  },
  datalistTitleView: {
    justifyContent: 'space-between',
    marginTop: 30,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fullRow: {
    marginLeft: -15,
    flex: 1,
  },
  ctaBtn: {
    textAlign: 'center',
    width: 160,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  ctaInnerBtn: {
    paddingRight: 0,
    paddingLeft: 20,
    paddingVertical: 1,
  },
  ctaInnerBtnText: {
    letterSpacing: 3,
  },
});
