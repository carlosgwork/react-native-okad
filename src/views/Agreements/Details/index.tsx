import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ListRenderItemInfo,
  Alert,
} from 'react-native';
import {useMutation} from '@apollo/client';
import {SwipeListView, SwipeRow, RowMap} from 'react-native-swipe-list-view';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import numeral from 'numeral';
import Dialog from 'react-native-dialog';
import moment from 'moment';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';

import {AppHeader, NavBackBtn, AppText, AppGradButton} from '@root/components';
import {ContactsNavProps, AppRouteEnum} from '@root/routes/types';
import {AgreementLineItemType, Agreement} from '@root/utils/types';
import {UPDATE_AGREEMENT, UPDATE_LINE_ITEMS} from '../graphql';

export default function AgreementDetails({
  route,
  navigation,
}: ContactsNavProps<AppRouteEnum.AgreementDetails>) {
  const {styles} = useStyles(getStyles);
  const {parent = 'Contacts', contact, agreement} = route.params || {};
  const [activeAgreement, updateActiveAgreement] = useState<Agreement>(
    agreement,
  );
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const [listData, setListData] = useState<AgreementLineItemType[]>(
    activeAgreement.line_items || [],
  );

  const [showDiscount, setShowDiscount] = useState<boolean>(false);
  const [activeRow, setActiveRow] = useState<number>(-1);
  const [discount, setDiscount] = useState<string>('');
  const [showSalesTax, setShowSalesTax] = useState<boolean>(false);
  const [salesTax, setSalesTax] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    let total = 0;
    activeAgreement.line_items?.map((item) => {
      total += item.price * item.qty - item.discount;
    });
    setTotalPrice(total);
    let cost = 0;
    activeAgreement.line_items?.map((item) => {
      cost += item.current_cost * item.qty;
    });
    setTotalCost(cost);
  }, [activeAgreement.line_items]);

  const [update_agreement] = useMutation(UPDATE_AGREEMENT, {
    onCompleted() {
      // const updatedAgreement: Agreement = data.update_agreements.returning[0];
      Alert.alert('New Quote was successfully updated.');
    },
  });
  const [update_line_items] = useMutation(UPDATE_LINE_ITEMS, {
    onCompleted() {
      // const updatedAgreement: Agreement = data.update_agreements.returning[0];
      Alert.alert('New Line was successfully updated.');
    },
  });

  const deleteRow = (rowKey: number) => {
    const newData = [...listData];
    const prevIndex = listData.findIndex(
      (item: AgreementLineItemType) => item.id === rowKey,
    );
    newData.splice(prevIndex, 1);
    setListData(newData);
    const newAgreement = Object.assign({}, activeAgreement);
    newAgreement.line_items = newData;
    updateActiveAgreement(newAgreement);
  };

  const applyDiscount = () => {
    const newData = [...listData];
    const prevIndex = listData.findIndex(
      (item: AgreementLineItemType) => item.id === activeRow,
    );
    listData[prevIndex].discount = parseInt(discount, 10) * 100;
    setListData(newData);
    setDiscount('');
    const newAgreement = Object.assign({}, activeAgreement);
    newAgreement.line_items = newData;
    updateActiveAgreement(newAgreement);
  };

  const applySalesTax = () => {
    const newAgreement = Object.assign({}, activeAgreement);
    newAgreement.sales_tax_rate = parseFloat(salesTax);
    updateActiveAgreement(newAgreement);
  };

  const updateAgreementRevision = () => {
    const newAgreement = Object.assign({}, activeAgreement);
    newAgreement.revision = newAgreement.revision + 1;
    updateActiveAgreement(newAgreement);
  };

  const continueClicked = () => {
    activeAgreement.line_items?.map((item) => {
      const lineItem = {
        qty: item.qty,
        last_modified: new Date(),
        discount: item.discount,
      };
      update_line_items({
        variables: {
          _set: lineItem,
          id: item.id,
        },
      });
    });
    const updatingAgreement = {
      agreement_template_id: activeAgreement.agreement_template_id,
      billing_address_id: activeAgreement.billing_address_id,
      contact_id: activeAgreement.contact_id,
      last_modified: new Date(),
      number: activeAgreement.number,
      revision: activeAgreement.revision,
      sales_tax_rate: activeAgreement.sales_tax_rate,
      shipping_address_id: activeAgreement.shipping_address_id,
    };
    update_agreement({
      variables: {
        _set: updatingAgreement,
        id: activeAgreement.id,
      },
    });
  };

  const renderItem = (
    rowData: ListRenderItemInfo<AgreementLineItemType>,
    _: RowMap<AgreementLineItemType>,
  ): Element => (
    <SwipeRow
      disableLeftSwipe={false}
      disableRightSwipe={false}
      leftOpenValue={0}
      key={`swipe-row-${rowData.item.id}`}
      rightOpenValue={-195}>
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnLeft]}
          onPress={() => {
            setActiveRow(rowData.item.id);
            setShowDiscount(true);
          }}>
          <LinearGradient
            style={styles.gradientBtn}
            start={{x: 0.1, y: 0.8}}
            end={{x: 0.6, y: 1.0}}
            locations={[0, 1]}
            colors={['#7CB6C7', '#528DA4']}>
            <AppText color={'white'} size={16} font={'anSemiBold'}>
              Discount
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => deleteRow(rowData.item.id)}>
          <LinearGradient
            style={styles.gradientBtn}
            start={{x: 0.1, y: 0.9}}
            end={{x: 1.0, y: 0.4}}
            locations={[0, 1]}
            colors={['#C05252', '#A33333']}>
            <AppText color={'white'} size={16} font={'anSemiBold'}>
              Delete
            </AppText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={[styles.rowLayout, styles.rowFront]}>
        <View style={styles.qtyCell}>
          <AppText color={'lightPurple'} size={16} font={'anSemiBold'}>
            {`${rowData.item.qty}`}
          </AppText>
        </View>
        <View style={styles.descCell}>
          <AppText color={'textBlack1'} size={16} font={'anRegular'}>
            {rowData.item.catalog_item.name}
          </AppText>
        </View>
        <View style={styles.priceCell}>
          <AppText color={'textBlack1'} size={16} font={'anRegular'}>
            {`$${numeral(rowData.item.price / 100).format('0,0.00')}`}
          </AppText>
        </View>
        <View style={styles.discountCell}>
          <AppText color={'textBlack1'} size={16} font={'anRegular'}>
            {rowData.item.discount
              ? `$${numeral(rowData.item.discount / 100).format('0,0.00')}`
              : ''}
          </AppText>
        </View>
        <View style={styles.subTotalCell}>
          <AppText color={'textBlack1'} size={16} font={'anRegular'}>
            {`$${numeral(
              (rowData.item.qty * rowData.item.price - rowData.item.discount) /
                100,
            ).format('0,0.00')}`}
          </AppText>
        </View>
      </View>
    </SwipeRow>
  );

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn
            title={parent}
            onClick={() => {
              navigation.pop();
              navigation.navigate(AppRouteEnum.ContactDetails, {
                parent: 'Contacts',
                itemTitle: `${contact.name_first} ${contact.name_last}`,
                itemId: contact.id,
              });
            }}
          />
        }
        rightContent={
          <View style={styles.flexRow}>
            <Text style={styles.switchText}>Show details</Text>
            <Switch
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setShowDetails(!showDetails)}
              value={showDetails}
            />
          </View>
        }
        pageTitle={`Quote DHQ${agreement.id}`}
        toolbarCenterContent={null}
        toolbarRightContent={
          showDetails ? (
            <View style={styles.flexRow}>
              <AppText size={14} color={'textBlack2'} font={'anRegular'}>
                STATUS:
              </AppText>
              <AppText size={14} color={'textBlue'} font={'anSemiBold'}>
                &nbsp;OPEN
              </AppText>
            </View>
          ) : (
            <View />
          )
        }
      />
      <View style={styles.mainLayout}>
        <View style={[styles.rowLayout, styles.block]}>
          <View style={styles.flexRow}>
            <View style={styles.addressView}>
              <View style={[styles.rowLayout, styles.bottomBorder]}>
                <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                  BILLING ADDRESS
                </AppText>
                <TouchableOpacity onPress={() => {}}>
                  <AppText
                    color={'textLightPurple'}
                    size={12}
                    font={'anSemiBold'}>
                    Edit
                  </AppText>
                </TouchableOpacity>
              </View>
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                font={'anRegular'}>
                {activeAgreement.address?.line1}
              </AppText>
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                font={'anRegular'}>
                {activeAgreement.address?.line2}
              </AppText>
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                font={'anRegular'}>
                {`${activeAgreement.address?.city}, ${activeAgreement.address?.us_state}`}
              </AppText>
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                font={'anRegular'}>
                {activeAgreement.address?.postal_code}
              </AppText>
            </View>
            <View style={styles.addressView}>
              <View style={[styles.rowLayout, styles.bottomBorder]}>
                <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                  PROJECT ADDRESS
                </AppText>
                <TouchableOpacity onPress={() => {}}>
                  <AppText
                    color={'textLightPurple'}
                    size={12}
                    font={'anSemiBold'}>
                    Edit
                  </AppText>
                </TouchableOpacity>
              </View>
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                font={'anRegular'}>
                {activeAgreement.addressByShippingAddressId?.line1}
              </AppText>
              {activeAgreement.addressByShippingAddressId?.line2 && (
                <AppText
                  style={styles.lineHeight15}
                  color={'textBlack2'}
                  size={16}
                  font={'anRegular'}>
                  {activeAgreement.addressByShippingAddressId?.line2}
                </AppText>
              )}
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                font={'anRegular'}>
                {`${activeAgreement.addressByShippingAddressId?.city}, ${activeAgreement.addressByShippingAddressId?.us_state}`}
              </AppText>
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                font={'anRegular'}>
                {activeAgreement.addressByShippingAddressId?.postal_code}
              </AppText>
            </View>
          </View>
          <View style={styles.metaView}>
            {showDetails && (
              <>
                <View style={styles.bottomBorder}>
                  <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                    META
                  </AppText>
                </View>
                <View style={styles.rowLayout}>
                  <AppText
                    style={styles.lineHeight15}
                    color={'textBlack2'}
                    size={14}
                    font={'anRegular'}>
                    Created
                  </AppText>
                  <AppText
                    style={styles.lineHeight15}
                    color={'textBlack2'}
                    size={14}
                    font={'anRegular'}>
                    {moment(activeAgreement.created).format(
                      'M/DD/YYYY, HH:mm A',
                    )}
                  </AppText>
                </View>
                <View style={[styles.lineHeight15, styles.rowLayout]}>
                  <AppText color={'textBlack2'} size={14} font={'anRegular'}>
                    First View
                  </AppText>
                  <AppText color={'textBlack2'} size={14} font={'anRegular'}>
                    {moment(activeAgreement.created).format(
                      'M/DD/YYYY, HH:mm A',
                    )}
                  </AppText>
                </View>
              </>
            )}
          </View>
        </View>
        <View style={styles.block}>
          <View style={[styles.rowLayout, styles.tableHeader]}>
            <View style={styles.qtyCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                QTY
              </AppText>
            </View>
            <View style={styles.descCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                DESCRIPTION
              </AppText>
            </View>
            <View style={styles.priceCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                PRICE
              </AppText>
            </View>
            <View style={styles.discountCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                DISCOUNT
              </AppText>
            </View>
            <View style={styles.subTotalCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                SUBTOTAL
              </AppText>
            </View>
          </View>
          <SwipeListView data={listData} renderItem={renderItem as any} />
        </View>
        <View style={styles.block}>
          <View style={[styles.rowLayout, styles.totalRow]}>
            <View style={styles.priceCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                SUBTOTAL
              </AppText>
            </View>
            <View style={styles.priceCell}>
              <View>
                <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                  SALES TAX
                </AppText>
              </View>
              <TouchableOpacity onPress={() => setShowSalesTax(true)}>
                <AppText color={'lightPurple'} size={12} font={'anSemiBold'}>
                  Edit
                </AppText>
              </TouchableOpacity>
            </View>
            <View style={styles.totalCell}>
              <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                TOTAL
              </AppText>
            </View>
          </View>
          <View style={[styles.rowLayout, styles.totalRow]}>
            <View style={styles.priceCell}>
              <AppText color={'textBlack2'} size={24} font={'anRegular'}>
                {`$${numeral(totalPrice / 100).format('0,0.00')}`}
              </AppText>
            </View>
            <View style={[styles.priceCell, styles.editDiscountCell]}>
              <View>
                <AppText color={'textBlack2'} size={24} font={'anRegular'}>
                  {`$${numeral(
                    (totalPrice * activeAgreement.sales_tax_rate) / 100 / 100,
                  ).format('0,0.00')}`}
                </AppText>
              </View>
              <View>
                <AppText color={'textBlack2'} size={18} font={'anRegular'}>
                  {` @ ${activeAgreement.sales_tax_rate}%`}
                </AppText>
              </View>
            </View>
            <View style={styles.totalCell}>
              <AppText color={'textBlack2'} size={24} font={'anSemiBold'}>
                {`$${numeral(
                  (totalPrice * (100 - activeAgreement.sales_tax_rate)) /
                    100 /
                    100,
                ).format('0,0.00')}`}
              </AppText>
            </View>
          </View>
        </View>
        {showDetails && (
          <View style={styles.block}>
            <View style={[styles.rowLayout, styles.totalRow]}>
              <View style={styles.priceCell}>
                <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                  TOTAL COST
                </AppText>
              </View>
              <View style={styles.priceCell}>
                <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                  MARGIN
                </AppText>
              </View>
              <View style={styles.priceCell} />
            </View>
            <View style={[styles.rowLayout, styles.totalRow]}>
              <View style={styles.priceCell}>
                <AppText color={'textBlack2'} size={24} font={'anRegular'}>
                  {`$${numeral(totalCost / 100).format('0,0.00')}`}
                </AppText>
              </View>
              <View style={styles.priceCell}>
                <AppText color={'textBlack2'} size={24} font={'anRegular'}>
                  {`${Math.round(
                    ((totalPrice - totalCost) / totalPrice) * 100,
                  )}%`}
                </AppText>
              </View>
              <View style={styles.priceCell} />
            </View>
          </View>
        )}
        <View style={styles.block}>
          <View style={[styles.rowLayout, styles.totalRow]}>
            <TouchableOpacity
              style={[styles.rowLayout, styles.ctaBtn]}
              onPress={continueClicked}>
              <AppText
                style={styles.continueBtn}
                color={'textLightPurple'}
                size={14}
                font={'anSemiBold'}>
                CONTINUE
              </AppText>
              <Icon
                color={'#855C9C'}
                name={'arrow-forward-outline'}
                size={20}
                style={styles.marginLeft5}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.block, styles.revisionBtnView]}>
          <AppGradButton
            containerStyle={styles.revisionBtnContainer}
            btnStyle={styles.revisionBtn}
            textStyle={styles.revisionBtnText}
            title={'CREATE REVISION'}
            leftIconContent={<></>}
            onPress={updateAgreementRevision}
          />
        </View>
      </View>
      <Dialog.Container key="set-discount-dialog" visible={showDiscount}>
        <Dialog.Title>Set Discount</Dialog.Title>
        <Dialog.Input
          keyboardType="numeric"
          value={discount}
          onChangeText={(text: string) => {
            const value = text.replace(/[^0-9]/g, '');
            setDiscount(value);
          }}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setDiscount('');
            setShowDiscount(false);
          }}
        />
        <Dialog.Button
          label="Ok"
          onPress={() => {
            setShowDiscount(false);
            applyDiscount();
          }}
        />
      </Dialog.Container>
      <Dialog.Container key="set-sales-tax-dialog" visible={showSalesTax}>
        <Dialog.Title>Set Sales Tax</Dialog.Title>
        <Dialog.Description>
          Set percentage value for Sales Tax
        </Dialog.Description>
        <Dialog.Input
          keyboardType="numeric"
          value={salesTax}
          onChangeText={(text: string) => {
            const value = text.replace(/[^0-9.]/g, '');
            setSalesTax(value);
          }}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setSalesTax('');
            setShowSalesTax(false);
          }}
        />
        <Dialog.Button
          label="Ok"
          onPress={() => {
            setShowSalesTax(false);
            applySalesTax();
          }}
        />
      </Dialog.Container>
    </View>
  );
}

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
  switchText: {
    marginRight: themeStyle.scale(10),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bottomBorder: {
    borderBottomColor: themeStyle.lightBorderColor,
    borderBottomWidth: 1,
    paddingVertical: 8,
    marginBottom: 15,
    minWidth: 180,
  },
  addressView: {
    marginRight: 40,
    alignSelf: 'flex-start',
  },
  lineHeight15: {
    height: 24,
  },
  metaView: {
    width: 250,
    alignSelf: 'flex-start',
  },
  block: {
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  tableHeader: {
    paddingBottom: 10,
  },
  rowFront: {
    height: 50,
    borderBottomColor: themeStyle.lightBorderColor,
    borderBottomWidth: 1,
    backgroundColor: themeStyle.backgroundWhite,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowBack: {
    height: 50,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
    borderBottomColor: themeStyle.lightBorderColor,
    borderBottomWidth: 1,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    right: 75,
    width: 100,
  },
  backRightBtnRight: {
    right: 0,
  },
  qtyCell: {
    width: 50,
  },
  descCell: {
    flex: 1,
  },
  priceCell: {
    width: 180,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  discountCell: {
    width: 100,
  },
  subTotalCell: {
    width: 100,
    alignItems: 'flex-end',
  },
  gradientBtn: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalCell: {
    width: 180,
    alignItems: 'flex-end',
  },
  editDiscountCell: {
    justifyContent: 'flex-start',
  },
  totalRow: {
    justifyContent: 'flex-end',
    paddingVertical: 8,
  },
  ctaBtn: {
    alignItems: 'center',
  },
  continueBtn: {
    letterSpacing: 3.5,
  },
  revisionBtnText: {
    color: themeStyle.textWhite,
  },
  revisionBtnView: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  revisionBtnContainer: {
    width: 300,
  },
  revisionBtn: {
    paddingLeft: 50,
  },
  mainLayout: {
    position: 'relative',
    flex: 1,
  },
  switchView: {
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingBottom: 10,
  },
});
