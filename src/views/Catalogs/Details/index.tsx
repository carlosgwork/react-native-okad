import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {AppRouteEnum, AppNavProps} from '@root/routes/types';
import IonIcon from 'react-native-vector-icons/Ionicons';
import numeral from 'numeral';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {AppHeader, AppText} from '@root/components';
import {Catalog} from '@root/utils/types';
import moment from 'moment';
import {setAction} from '@root/redux/actions';

export default function CatalogDetails({
  route,
  navigation,
}: AppNavProps<AppRouteEnum.CatalogDetails>) {
  const {styles} = useStyles(getStyles);
  const {data, vendor}: {data: Catalog; vendor: string} = route.params || {};

  const showCatalogsByVendor = () => {
    setAction('vendors', {searchText: vendor});
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <TouchableOpacity onPress={() => navigation.pop()}>
            <AppText size={16} color={'textLightPurple'} font="anMedium">
              Cancel
            </AppText>
          </TouchableOpacity>
        }
        rightContent={null}
        pageTitle={data.name}
        toolbarCenterContent={null}
        toolbarRightContent={
          <TouchableOpacity onPress={showCatalogsByVendor}>
            <AppText size={14} color={'textLightPurple'} font="anMedium">
              {vendor}
            </AppText>
          </TouchableOpacity>
        }
      />
      <View style={styles.mainContent}>
        <View style={styles.block}>
          <View style={[styles.rowLayout, styles.tableHeader]}>
            <View style={styles.cell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                CATEGORY
              </AppText>
            </View>
            <View style={styles.cell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                SKU
              </AppText>
            </View>
            <View style={styles.cell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                COST
              </AppText>
            </View>
            <View style={styles.priceCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                PRICE
              </AppText>
            </View>
            <View style={styles.cell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                INSTALLATION FEE
              </AppText>
            </View>
            <View style={styles.taxCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                TAXABLE
              </AppText>
            </View>
          </View>
          <View style={[styles.rowLayout, styles.rowFront]}>
            <View style={styles.cell}>
              <AppText color={'textBlack1'} size={16} font={'anRegular'}>
                {`${data.category}`}
              </AppText>
            </View>
            <View style={styles.cell}>
              <AppText color={'textBlack1'} size={16} font={'anRegular'}>
                {data.sku}
              </AppText>
            </View>
            <View style={styles.cell}>
              <AppText color={'textBlack1'} size={16} font={'anRegular'}>
                {`$${numeral(data.cost / 100).format('0,0.00')}`}
              </AppText>
            </View>
            <View style={styles.priceCell}>
              <AppText color={'textBlack1'} size={16} font={'anRegular'}>
                {`$${numeral(data.price / 100).format('0,0.00')}`}
              </AppText>
            </View>
            <View style={styles.cell}>
              <AppText color={'textBlack1'} size={16} font={'anRegular'}>
                {`$${numeral(data.installation_fee / 100).format('0,0.00')}`}
              </AppText>
            </View>
            <View style={styles.taxCell}>
              {data.taxable ? (
                <IonIcon name={'checkmark-sharp'} color={'#55465F'} size={22} />
              ) : (
                <></>
              )}
            </View>
          </View>
        </View>
        <View style={styles.block}>
          <View style={[styles.rowLayout, styles.tableHeader]}>
            <View style={styles.priceCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                LAST UPDATED
              </AppText>
            </View>
          </View>
          <View style={[styles.rowLayout, styles.rowFront]}>
            <View style={styles.priceCell}>
              <AppText color={'textBlack1'} size={16} font={'anRegular'}>
                {`${moment(data.created).format('MMMM DD, YYYY')} at ${moment(
                  data.created,
                ).format('H:mm A')}`}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.block}>
          <View style={[styles.rowLayout, styles.tableHeader]}>
            <View style={styles.priceCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                DESCRIPTION
              </AppText>
            </View>
          </View>
          <View style={[styles.rowLayout, styles.rowFront]}>
            <View style={styles.priceCell}>
              <Text style={styles.descText}>{`${data.description}`}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  mainContent: {
    paddingVertical: themeStyle.scale(10),
    paddingHorizontal: themeStyle.scale(15),
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: themeStyle.scale(30),
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taxCell: {
    width: 60,
    alignItems: 'flex-end',
  },
  cell: {
    width: 150,
  },
  priceCell: {
    flex: 1,
  },
  block: {
    paddingTop: 40,
    paddingHorizontal: 0,
  },
  tableHeader: {
    paddingBottom: 10,
  },
  rowFront: {
    height: 40,
    backgroundColor: themeStyle.backgroundWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  descText: {
    ...themeStyle.getTextStyle({
      color: 'textBlack1',
      size: 16,
      font: 'anRegular',
    }),
  },
});
