import React, {useState, useEffect} from 'react';
import {
  View,
  Switch,
  TouchableOpacity,
  LayoutAnimation,
  Modal,
} from 'react-native';
import {useMutation} from '@apollo/client';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import numeral from 'numeral';
import Dialog from 'react-native-dialog';
import moment from 'moment';
import {useSelector} from 'react-redux';
import DraggableFlatList, {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import SwipeableItem from 'react-native-swipeable-item';
import Animated from 'react-native-reanimated';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {
  AppHeader,
  NavBackBtn,
  AppText,
  AppGradButton,
  StatusIndicator,
} from '@root/components';
import {AppNavProps, AppRouteEnum} from '@root/routes/types';
import {
  AgreementLineItemType,
  Agreement,
  Contact,
  OfflineMutationType,
  AgreementEvent,
} from '@root/utils/types';
import {UPDATE_AGREEMENT, UPDATE_LINE_ITEM, REMOVE_LINE_ITEM} from '../graphql';
import {setAction} from '@root/redux/actions';
import {phoneFormat} from '@root/utils/functions';
import LineItemModal from './LineItemModal';

const {multiply, sub} = Animated;
type SwipeRowType = {
  item: AgreementLineItemType;
  drag: () => void;
};

export default function AgreementDetails({
  route,
  navigation,
}: AppNavProps<AppRouteEnum.AgreementDetails>) {
  const {styles} = useStyles(getStyles);
  const {
    prefix,
    agreements,
    contacts,
    offlineMutations,
    isOnline,
  } = useSelector((state: any) => ({
    prefix: state.user.prefix,
    agreements: state.agreements.agreements,
    contacts: state.contacts.contacts,
    offlineMutations: state.offlineMutations,
    isOnline: state.network.online,
  }));

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
  const [lineItemModalVisible, setLineItemModalVisible] = useState<boolean>(
    false,
  );

  const [update_agreement] = useMutation(UPDATE_AGREEMENT);
  const [update_line_items] = useMutation(UPDATE_LINE_ITEM);
  const [delete_line_items] = useMutation(REMOVE_LINE_ITEM);

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

  const deleteRow = (rowKey: number) => {
    const newData = [...listData];
    const prevIndex = listData.findIndex(
      (item: AgreementLineItemType) => item.id === rowKey,
    );
    removeLineItem(newData[prevIndex]);
    newData.splice(prevIndex, 1);
    setListData(newData);
    const newAgreement = Object.assign({}, activeAgreement);
    newAgreement.line_items = newData;
    updateActiveAgreement(newAgreement);
    updateAgreementState(newAgreement);
  };

  const updateAgreementState = (data: Agreement) => {
    const newAgreements = JSON.parse(JSON.stringify(agreements));
    const agIndex = newAgreements.findIndex(
      (ag: Agreement) => ag.id === data.id,
    );
    newAgreements[agIndex] = data;
    setAction('agreements', {agreements: newAgreements});
    const contactsInStore = JSON.parse(JSON.stringify(contacts));
    const newContacts = contactsInStore.map((ct: Contact) => {
      if (ct.id === contact.id) {
        const newCtAgreements = ct.agreements?.slice() || [];
        const agIndex2 = newCtAgreements.findIndex(
          (ag2: Agreement) => ag2.id === data.id,
        );
        newCtAgreements[agIndex2] = data;
        ct.agreements = newCtAgreements;
      }
      return ct;
    });
    setAction('contacts', {contacts: newContacts});
  };

  const applyDiscount = () => {
    const newData = [...listData];
    const prevIndex = listData.findIndex(
      (item: AgreementLineItemType) => item.id === activeRow,
    );
    newData[prevIndex].discount = parseInt(discount, 10) * 100;
    setListData(newData);
    setDiscount('');
    const newAgreement = Object.assign({}, activeAgreement);
    newAgreement.line_items = newData;
    updateActiveAgreement(newAgreement);
    updateAgreementState(newAgreement);
    updateLineItem(newData[prevIndex]);
  };

  const applySalesTax = () => {
    const newAgreement = Object.assign({}, activeAgreement);
    newAgreement.sales_tax_rate = parseFloat(salesTax);
    updateActiveAgreement(newAgreement);
    updateAgreementState(newAgreement);
    runAgreementUpdateQuery(newAgreement);
  };

  const updateAgreementRevision = () => {
    const newAgreement = Object.assign({}, activeAgreement);
    newAgreement.revision = newAgreement.revision + 1;
    updateActiveAgreement(newAgreement);
    updateAgreementState(newAgreement);
    runAgreementUpdateQuery(newAgreement);
  };

  const updateAgreement = (data: Agreement) => {
    const updatingAgreement = {
      agreement_template_id: data.agreement_template_id,
      billing_address_id: data.billing_address_id,
      contact_id: data.contact_id,
      last_modified: new Date(),
      number: data.number,
      revision: data.revision,
      sales_tax_rate: data.sales_tax_rate,
      shipping_address_id: data.shipping_address_id,
    };
    update_agreement({
      variables: {
        _set: updatingAgreement,
        id: activeAgreement.id,
      },
    });
  };

  const runAgreementUpdateQuery = (data: Agreement) => {
    // Check if itemId already exists in offlineMutations list
    const itemIndex = offlineMutations.data.findIndex(
      (item: OfflineMutationType) =>
        (item.type === 'CREATE_AGREEMENT' ||
          item.type === 'UPDATE_AGREEMENT') &&
        item.itemId === data.id,
    );
    if (itemIndex < 0) {
      if (isOnline) {
        updateAgreement(data);
      } else {
        const newMutations = offlineMutations.data;
        newMutations.push({
          type: 'UPDATE_AGREEMENT',
          itemId: data.id,
        });
        setAction('offlineMutations', {data: newMutations});
      }
    }
  };

  const updateLineItem = (item: AgreementLineItemType) => {
    const itemIndex = offlineMutations.data.findIndex(
      (it: OfflineMutationType) =>
        it.type === 'UPDATE_LINEITEM' && it.itemId === item.id,
    );
    if (itemIndex < 0) {
      if (isOnline) {
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
      } else {
        const newMutations = offlineMutations.data;
        newMutations.push({
          type: 'UPDATE_LINEITEM',
          itemId: agreement.id, // agreement id
          lineItemId: item.id, // lineItem id
        });
        setAction('offlineMutations', {data: newMutations});
      }
    }
  };

  const updateLineItemsOrder = (data: AgreementLineItemType[]) => {
    const itemIndex = offlineMutations.data.findIndex(
      (it: OfflineMutationType) =>
        it.type === 'CREATE_AGREEMENT' && activeAgreement.id === it.itemId,
    );
    if (itemIndex < 0) {
      if (isOnline) {
        data.forEach((it) => {
          update_line_items({
            variables: {
              _set: {
                order: it.order,
              },
              id: it.id,
            },
          });
        });
      } else {
        const newMutations = offlineMutations.data;
        data.map((it) => {
          newMutations.push({
            type: 'UPDATE_LINEITEM',
            itemId: agreement.id, // agreement id
            lineItemId: it.id, // lineItem id
          });
        });
        setAction('offlineMutations', {data: newMutations});
      }
    }
  };

  const continueClicked = () => {
    navigation.navigate(AppRouteEnum.AgreementSummary, {
      itemTitle: `Quote ${prefix}${numeral(agreement.number).format('00000')}`,
      agreement: activeAgreement,
      contact: contact,
    });
  };

  const removeLineItem = (item: AgreementLineItemType) => {
    const itemIndex = offlineMutations.data.findIndex(
      (it: OfflineMutationType) =>
        it.type === 'DELETE_LINEITEM' && it.itemId === item.id,
    );
    if (itemIndex < 0) {
      if (isOnline) {
        delete_line_items({
          variables: {
            id: item.id,
          },
        });
      } else {
        const newMutations = offlineMutations.data;
        newMutations.push({
          type: 'DELETE_LINEITEM',
          itemId: agreement.id, // agreement id
          lineItemId: item.id, // lineItem id
        });
        setAction('offlineMutations', {data: newMutations});
      }
    }
    // Animate list to close gap when item is deleted
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };

  const renderUnderlayRight = ({
    item,
    percentOpen,
  }: {
    item: any;
    percentOpen: any;
  }) => (
    <Animated.View
      style={[
        styles.row,
        styles.underlayRight,
        {
          transform: [{translateX: multiply(sub(1, percentOpen), -100)}], // Translate from left on open
        },
      ]}>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => {
          setActiveRow(item.item.id);
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
        onPress={() => deleteRow(item.item.id)}>
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
    </Animated.View>
  );

  const renderItem = ({
    item,
    index,
    drag,
  }: RenderItemParams<AgreementLineItemType>) => {
    return (
      <SwipeableItem
        key={index}
        item={{item, drag}}
        overSwipe={195}
        renderUnderlayLeft={renderUnderlayRight}
        renderOverlay={renderOverlay}
        snapPointsLeft={[195]}
      />
    );
  };

  const renderOverlay = ({item}: {item: SwipeRowType}) => {
    return (
      <View style={[styles.rowLayout, styles.rowFront]}>
        <TouchableOpacity onLongPress={item.drag} style={styles.dragbarCell}>
          <Icon name="reorder-three-outline" size={24} color="#a7a7a7" />
        </TouchableOpacity>
        <View style={styles.qtyCell}>
          <AppText color={'lightPurple'} size={16} font={'anSemiBold'}>
            {`${item.item.qty}`}
          </AppText>
        </View>
        <View style={styles.descCell}>
          <AppText color={'textBlack1'} size={16} font={'anRegular'}>
            {item.item.catalog_item.name}
          </AppText>
        </View>
        <View style={styles.priceCell}>
          <AppText color={'textBlack1'} size={16} font={'anRegular'}>
            {`$${numeral(item.item.price / 100).format('0,0.00')}`}
          </AppText>
        </View>
        <View style={styles.discountCell}>
          <AppText color={'textBlack1'} size={16} font={'anRegular'}>
            {item.item.discount
              ? `$${numeral(item.item.discount / 100).format('0,0.00')}`
              : ''}
          </AppText>
        </View>
        <View style={styles.subTotalCell}>
          <AppText color={'textBlack1'} size={16} font={'anRegular'}>
            {`$${numeral(
              (item.item.qty * item.item.price - item.item.discount) / 100,
            ).format('0,0.00')}`}
          </AppText>
        </View>
      </View>
    );
  };

  const dragEnded = ({data}: {data: AgreementLineItemType[]}) => {
    const newData = data.map((it, index) => {
      const it_copy = Object.assign({}, it);
      it_copy.order = index;
      return it_copy;
    });
    updateLineItemsOrder(newData);
    setListData(newData);
  };

  const getAgreementStatus = () => {
    const events: AgreementEvent[] = activeAgreement.agreement_events as AgreementEvent[];
    if (events.length === 0) {
      return 'open';
    }
    if (events.findIndex((e) => e.type === 'accepted') > -1) {
      return 'accepted';
    }
    if (events.findIndex((e) => e.type === 'viewed') > -1) {
      return 'viewed';
    }
    return 'sent';
  };

  const shippingAddress = activeAgreement.addressByShippingAddressId
    ? activeAgreement.addressByShippingAddressId
    : activeAgreement.address;
  const phoneNum =
    contact.phone_home || contact.phone_mobile || contact.phone_office;
  const status = getAgreementStatus();

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
            <AppText
              color={'textLightPurple'}
              size={12}
              font={'anMedium'}
              style={styles.switchText}>
              Show details
            </AppText>
            <Switch
              trackColor={{true: '#855C9C', false: '#f4f4f4'}}
              onValueChange={() => setShowDetails(!showDetails)}
              value={showDetails}
            />
          </View>
        }
        pageTitle={`Quote ${prefix}${numeral(agreement.number).format(
          '00000',
        )}`}
        toolbarCenterContent={null}
        toolbarRightContent={
          showDetails ? (
            <View style={styles.flexRow}>
              <AppText size={14} color={'textBlack2'} font={'anMedium'}>
                STATUS:&nbsp;
              </AppText>
              <StatusIndicator status={status} />
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
              {activeAgreement.address?.line2 && (
                <AppText
                  style={styles.lineHeight15}
                  color={'textBlack2'}
                  size={16}
                  font={'anRegular'}>
                  {activeAgreement.address?.line2}
                </AppText>
              )}
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                numberOfLines={1}
                font={'anRegular'}>
                {`${activeAgreement.address?.city}, ${activeAgreement.address?.us_state} ${activeAgreement.address?.postal_code}`}
              </AppText>
              {phoneNum && (
                <AppText
                  style={styles.lineHeight15}
                  color={'textBlack2'}
                  size={16}
                  font={'anRegular'}>
                  {phoneFormat(phoneNum)}
                </AppText>
              )}
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                font={'anRegular'}>
                {contact.email}
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
                {shippingAddress?.line1}
              </AppText>
              {shippingAddress?.line2 && (
                <AppText
                  style={styles.lineHeight15}
                  color={'textBlack2'}
                  size={16}
                  font={'anRegular'}>
                  {shippingAddress?.line2}
                </AppText>
              )}
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                numberOfLines={1}
                font={'anRegular'}>
                {`${shippingAddress?.city}, ${shippingAddress?.us_state} ${shippingAddress?.postal_code}`}
              </AppText>
            </View>
          </View>
          {showDetails && (
            <View style={styles.metaView}>
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
                  {moment(activeAgreement.created).format('M/DD/YYYY, HH:mm A')}
                </AppText>
              </View>
              <View style={[styles.lineHeight15, styles.rowLayout]}>
                <AppText color={'textBlack2'} size={14} font={'anRegular'}>
                  First View
                </AppText>
                <AppText color={'textBlack2'} size={14} font={'anRegular'}>
                  {moment(activeAgreement.created).format('M/DD/YYYY, HH:mm A')}
                </AppText>
              </View>
            </View>
          )}
        </View>
        <View style={styles.block}>
          <View style={[styles.rowLayout, styles.tableHeader]}>
            <View style={styles.dragbarCell}>
              <></>
            </View>
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
          <View style={styles.rowLayout}>
            <DraggableFlatList
              activationDistance={15}
              keyExtractor={(_, index) => index.toString()}
              data={listData}
              renderItem={renderItem}
              onDragEnd={dragEnded}
            />
          </View>
          <View style={styles.rowLayout}>
            <TouchableOpacity
              style={[styles.flexRow, styles.addLineItem]}
              onPress={() => setLineItemModalVisible(true)}>
              <AppText color={'textLightPurple'} size={14} font={'anMedium'}>
                Add Item
              </AppText>
              <Icon
                color={'#855C9C'}
                name={'ios-add-outline'}
                size={26}
                style={styles.marginLeft5}
              />
            </TouchableOpacity>
          </View>
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
                  (totalPrice * (100 + activeAgreement.sales_tax_rate)) /
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
      {lineItemModalVisible && <View style={styles.modalWrapper} />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={lineItemModalVisible}>
        <LineItemModal onClose={() => setLineItemModalVisible(false)} />
      </Modal>
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
    position: 'relative',
  },
  logo: {
    resizeMode: 'stretch',
    maxWidth: 230,
    height: themeStyle.scale(24),
  },
  switchText: {
    marginRight: themeStyle.scale(8),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    flex: 1,
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
    flex: 1,
    alignSelf: 'flex-start',
    maxWidth: '50%',
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
  dragbarCell: {
    width: 40,
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
  underlayRight: {
    flex: 1,
    backgroundColor: 'teal',
    justifyContent: 'flex-start',
  },
  addLineItem: {
    justifyContent: 'flex-end',
    marginVertical: 8,
    marginRight: -5,
  },
  modalWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
