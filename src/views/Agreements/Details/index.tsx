import React, {useState, useEffect} from 'react';
import {
  View,
  Switch,
  TouchableOpacity,
  LayoutAnimation,
  Modal,
  Alert,
  Image,
  StatusBar,
  Share,
} from 'react-native';
import {useMutation} from '@apollo/client';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
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
import {AppHeader, AppText, StatusIndicator} from '@root/components';
import {AppNavProps, AppRouteEnum} from '@root/routes/types';
import {
  AgreementLineItemType,
  Agreement,
  Contact,
  OfflineMutationType,
  AgreementEvent,
  Catalog,
} from '@root/utils/types';
import {
  UPDATE_AGREEMENT,
  UPDATE_LINE_ITEM,
  REMOVE_LINE_ITEM,
  CREATE_LINE_ITEM,
  CREATE_AGREEMENT,
  DELETE_AGREEMENT,
} from '../graphql';
import {setAction} from '@root/redux/actions';
import {phoneFormat} from '@root/utils/functions';
import LineItemModal from './LineItemModal';
import {DeleteIcon, ShareIcon} from '@assets/assets';

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
    userInfo,
    prefix,
    agreements,
    contacts,
    offline_mutations,
    isOnline,
  } = useSelector((state: any) => ({
    userInfo: state.user,
    prefix: state.user.prefix,
    agreements: state.agreements.agreements,
    contacts: state.contacts.contacts,
    offline_mutations: state.offline_mutations,
    isOnline: state.network.online,
  }));

  const {contact, agreement} = route.params || {};
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
  const [showDeletePrompt, setShowDeletePrompt] = useState<boolean>(false);
  const [showQtyAdjustDialog, setShowQtyAdjustDialog] = useState<boolean>(
    false,
  );
  const [qtyValue, setQtyValue] = useState<string>('');

  const [update_agreement] = useMutation(UPDATE_AGREEMENT, {
    onError(error) {
      Alert.alert(error.message);
    },
  });
  const [update_line_items] = useMutation(UPDATE_LINE_ITEM, {
    onError: (error) => {
      Alert.alert(error.message);
    },
  });
  const [delete_line_items] = useMutation(REMOVE_LINE_ITEM, {
    onCompleted: (data) => {
      const newData = [...listData];
      const prevIndex = listData.findIndex(
        (item: AgreementLineItemType) =>
          item.id === data.delete_line_items.returning[0].id,
      );
      newData.splice(prevIndex, 1);
      setListData(newData);
      const newAgreement = Object.assign({}, activeAgreement);
      newAgreement.line_items = newData;
      updateActiveAgreement(newAgreement);
      updateAgreementState(newAgreement);
    },
    onError: (error) => {
      Alert.alert(error.message);
    },
  });
  const [delete_agreements] = useMutation(DELETE_AGREEMENT, {
    onCompleted() {
      deleteAgreementFromStore();
      navigation.pop();
    },
    onError(error) {
      Alert.alert(error.message);
    },
  });
  const [insert_line_items_one] = useMutation(CREATE_LINE_ITEM, {
    onCompleted(data) {
      const newData = [...listData];
      newData.push(data.insert_line_items_one);
      setListData(newData);
      const newAgreement = Object.assign({}, activeAgreement);
      newAgreement.line_items = newData;
      updateActiveAgreement(newAgreement);
      updateAgreementState(newAgreement);
    },
    onError(error) {
      Alert.alert(error.message);
    },
  });
  const [insert_agreement] = useMutation(CREATE_AGREEMENT, {
    onCompleted(data) {
      // Update agreement number of current usr
      const newAgreement: Agreement = data.insert_agreements.returning[0];
      const newAgreements = agreements.slice();
      newAgreements.unshift(newAgreement);
      const contactsInStore = JSON.parse(JSON.stringify(contacts));
      const newContacts = contactsInStore.map((ct: Contact) => {
        if (ct.id === contact.id) {
          ct.agreements?.push(agreement);
        }
        return ct;
      });
      setAction('agreements', {agreements: newAgreements});
      setAction('contacts', {contacts: newContacts});
      Alert.alert('A Revision agreement is successfully created.');
    },
    onError(error) {
      Alert.alert(error.message);
    },
  });

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (agreements.length > 0) {
        const agIndex = agreements.findIndex(
          (ag: Agreement) => ag.id === activeAgreement.id,
        );
        const newAgreement = agreements[agIndex];
        updateActiveAgreement(newAgreement);
      }
    });
    return unsubscribe;
  }, [navigation, activeAgreement, agreements]);

  const deleteRow = (rowKey: number) => {
    const newData = [...listData];
    const prevIndex = listData.findIndex(
      (item: AgreementLineItemType) => item.id === rowKey,
    );
    removeLineItem(newData[prevIndex], rowKey);
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
    const dt = Object.assign({}, newData[prevIndex]);
    dt.discount = parseInt(discount, 10) * 100;
    newData[prevIndex] = dt;
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
    runAgreementUpdateQuery(newAgreement);
  };

  const changeQty = () => {
    const newData = listData.slice();
    const prevIndex = listData.findIndex(
      (item: AgreementLineItemType) => item.id === activeRow,
    );
    const dt = Object.assign({}, newData[prevIndex]);
    dt.qty = parseInt(qtyValue, 10);
    newData[prevIndex] = dt;
    setListData(newData);
    const newAgreement = Object.assign({}, activeAgreement);
    newAgreement.line_items = newData;
    updateActiveAgreement(newAgreement);
    updateAgreementState(newAgreement);
    updateLineItem(newData[prevIndex]);
  };

  const updateAgreementRevision = () => {
    const line_items = activeAgreement.line_items?.map(
      (item: AgreementLineItemType) => {
        return {
          catalog_item_id: item.catalog_item_id,
          current_cost: item.current_cost,
          discount: item.discount,
          price: item.price,
          qty: item.qty,
          taxable: item.taxable,
        };
      },
    );
    if (isOnline) {
      insert_agreement({
        variables: {
          billing_address_id: activeAgreement.billing_address_id,
          agreement_template_id: activeAgreement.agreement_template_id,
          contact_id: activeAgreement.contact_id,
          shipping_address_id: activeAgreement.shipping_address_id,
          line_items,
          user_id: activeAgreement.user_id,
          sales_tax_rate: activeAgreement.sales_tax_rate,
          number: `${userInfo.lastAgreementNumber + 1}`,
        },
      });
    } else {
      const newAgreement = Object.assign({}, activeAgreement);
      agreements.unshift(newAgreement);
      const newAgreements = agreements.slice();
      const contactsInStore = JSON.parse(JSON.stringify(contacts));
      const newContacts = contactsInStore.map((ct: Contact) => {
        if (ct.id === contact.id) {
          ct.agreements?.push(agreement);
        }
        return ct;
      });
      setAction('agreements', {agreements: newAgreements});
      setAction('contacts', {contacts: newContacts});
      const lastAgreement = agreements[0];
      const newMutations = offline_mutations.data;
      newMutations.push({
        type: 'CREATE_AGREEMENT',
        itemId: lastAgreement.id + 1,
      });
      setAction('offline_mutations', {data: newMutations});
    }
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

  const deleteAgreement = () => {
    const itemIndex = offline_mutations.data.findIndex(
      (item: OfflineMutationType) =>
        item.type === 'CREATE_AGREEMENT' && item.itemId === activeAgreement.id,
    );
    if (itemIndex < 0) {
      if (isOnline) {
        delete_agreements({
          variables: {
            id: activeAgreement.id,
          },
        });
      } else {
        deleteAgreementFromStore();
        const newMutations = offline_mutations.data;
        newMutations.push({
          type: 'DELETE_AGREEMENT',
          itemId: activeAgreement.id, // agreement id
        });
        setAction('offline_mutations', {data: newMutations});
        navigation.pop();
      }
    } else {
      deleteAgreementFromStore();
      const newMutations = offline_mutations.data;
      newMutations.splice(itemIndex, 1);
      setAction('offline_mutations', {data: newMutations});
      navigation.pop();
    }
  };

  const deleteAgreementFromStore = () => {
    const newAgreements = JSON.parse(JSON.stringify(agreements));
    const agIndex = newAgreements.findIndex(
      (ag: Agreement) => ag.id === activeAgreement.id,
    );
    newAgreements.splice(agIndex, 1);
    setAction('agreements', {agreements: newAgreements});
    const contactsInStore = JSON.parse(JSON.stringify(contacts));
    const newContacts = contactsInStore.map((ct: Contact) => {
      if (ct.id === contact.id) {
        const newCtAgreements = ct.agreements?.slice() || [];
        const agIndex2 = newCtAgreements.findIndex(
          (ag2: Agreement) => ag2.id === activeAgreement.id,
        );
        newCtAgreements.splice(agIndex2, 1);
        ct.agreements = newCtAgreements;
      }
      return ct;
    });
    setAction('contacts', {contacts: newContacts});
  };

  const runAgreementUpdateQuery = (data: Agreement) => {
    updateAgreementState(data);
    // Check if itemId already exists in offline_mutations list
    const itemIndex = offline_mutations.data.findIndex(
      (item: OfflineMutationType) =>
        (item.type === 'CREATE_AGREEMENT' ||
          item.type === 'UPDATE_AGREEMENT') &&
        item.itemId === data.id,
    );
    if (itemIndex < 0) {
      if (isOnline) {
        updateAgreement(data);
      } else {
        const newMutations = offline_mutations.data;
        newMutations.push({
          type: 'UPDATE_AGREEMENT',
          itemId: data.id,
        });
        setAction('offline_mutations', {data: newMutations});
      }
    }
  };

  const updateLineItem = (item: AgreementLineItemType) => {
    const itemIndex = offline_mutations.data.findIndex(
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
        const newMutations = offline_mutations.data;
        newMutations.push({
          type: 'UPDATE_LINEITEM',
          itemId: agreement.id, // agreement id
          lineItemId: item.id, // lineItem id
        });
        setAction('offline_mutations', {data: newMutations});
      }
    }
  };

  const updateLineItemsOrder = (data: AgreementLineItemType[]) => {
    const itemIndex = offline_mutations.data.findIndex(
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
        const newMutations = offline_mutations.data;
        data.map((it) => {
          newMutations.push({
            type: 'UPDATE_LINEITEM',
            itemId: agreement.id, // agreement id
            lineItemId: it.id, // lineItem id
          });
        });
        setAction('offline_mutations', {data: newMutations});
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

  const removeLineItem = (item: AgreementLineItemType, rowKey: number) => {
    const itemIndex = offline_mutations.data.findIndex(
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
        const newData = [...listData];
        const prevIndex = listData.findIndex(
          (it: AgreementLineItemType) => it.id === rowKey,
        );
        newData.splice(prevIndex, 1);
        setListData(newData);
        const newAgreement = Object.assign({}, activeAgreement);
        newAgreement.line_items = newData;
        updateActiveAgreement(newAgreement);
        updateAgreementState(newAgreement);
        const newMutations = offline_mutations.data;
        newMutations.push({
          type: 'DELETE_LINEITEM',
          itemId: agreement.id, // agreement id
          lineItemId: item.id, // lineItem id
        });
        setAction('offline_mutations', {data: newMutations});
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
        <TouchableOpacity
          style={styles.qtyCell}
          onPress={() => {
            setActiveRow(item.item.id);
            setQtyValue(`${item.item.qty}`);
            setShowQtyAdjustDialog(true);
          }}>
          <AppText color={'lightPurple'} size={16} font={'anSemiBold'}>
            {`${item.item.qty}`}
          </AppText>
        </TouchableOpacity>
        <View style={styles.descCell}>
          <AppText color={'textBlack1'} size={16} font={'anRegular'}>
            {item.item.current_cost === 0
              ? `${item.item.catalog_item.name} Installation`
              : item.item.catalog_item.name}
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
    const events: AgreementEvent[] =
      (activeAgreement.agreement_events as AgreementEvent[]) || [];
    if (events.length === 0) {
      return {status: 'open', agreementEditable: true};
    }
    if (events.findIndex((e) => e.type === 'accepted') > -1) {
      return {status: 'accepted', agreementEditable: false};
    }
    if (events.findIndex((e) => e.type === 'viewed') > -1) {
      return {status: 'viewed', agreementEditable: false};
    }
    if (events.findIndex((e) => e.type === 'printed') > -1) {
      return {status: 'printed', agreementEditable: false};
    }
    return {status: 'sent', agreementEditable: true};
  };

  const onAddItem = (item: Catalog) => {
    // Check if itemId already exists in offline_mutations list
    const itemIndex = offline_mutations.data.findIndex(
      (it: OfflineMutationType) =>
        (it.type === 'CREATE_AGREEMENT' || it.type === 'UPDATE_AGREEMENT') &&
        it.itemId === activeAgreement.id,
    );
    if (itemIndex < 0) {
      const lineItIndex = listData
        ? listData.findIndex((it2) => it2.catalog_item_id === item.id)
        : -1;
      if (lineItIndex < 0) {
        if (isOnline) {
          const lastOrder = listData[listData.length - 1].order || -1;
          insert_line_items_one({
            variables: {
              object: {
                agreement_id: activeAgreement.id,
                catalog_item_id: item.id,
                current_cost: item.cost,
                discount: 0,
                order: lastOrder + 1,
                price: item.price,
                qty: 1,
                taxable: item.taxable,
              },
            },
          });
        } else {
          const newData = [...listData];
          const lastOrder = listData[listData.length - 1].order || -1;
          const newLineItem: AgreementLineItemType = {
            agreement_id: activeAgreement.id,
            catalog_item_id: item.id,
            current_cost: item.cost,
            discount: 0,
            order: lastOrder + 1,
            price: item.price,
            qty: 1,
            taxable: item.taxable,
            catalog_item: item,
            id: newData[newData.length - 1]
              ? newData[newData.length - 1].id + 1
              : 1,
          };
          newData.push(newLineItem);
          setListData(newData);
          const newAgreement = Object.assign({}, activeAgreement);
          newAgreement.line_items = newData;
          updateActiveAgreement(newAgreement);
          updateAgreementState(newAgreement);
          const newMutations = offline_mutations.data;
          newMutations.push({
            type: 'CREATE_LINEITEM',
            itemId: agreement.id, // agreement id
            lineItemId: newLineItem.id, // lineItem id
          });
          setAction('offline_mutations', {data: newMutations});
        }
      } else {
        const newData = listData.slice();
        const dt = Object.assign({}, newData[lineItIndex]);
        dt.qty = listData[lineItIndex].qty + 1;
        newData[lineItIndex] = dt;
        setListData(newData);
        const newAgreement = Object.assign({}, activeAgreement);
        newAgreement.line_items = newData;
        updateActiveAgreement(newAgreement);
        updateAgreementState(newAgreement);
        updateLineItem(newData[lineItIndex]);
      }
    } else {
      const newData = [...listData];
      const lastOrder = listData[listData.length - 1].order || -1;
      const newLineItem: AgreementLineItemType = {
        agreement_id: activeAgreement.id,
        catalog_item_id: item.id,
        current_cost: item.cost,
        discount: 0,
        order: lastOrder + 1,
        price: item.price,
        qty: 1,
        taxable: item.taxable,
        catalog_item: item,
        id: newData[newData.length - 1]
          ? newData[newData.length - 1].id + 1
          : 1,
      };
      newData.push(newLineItem);
      setListData(newData);
      const newAgreement = Object.assign({}, activeAgreement);
      newAgreement.line_items = newData;
      updateActiveAgreement(newAgreement);
      updateAgreementState(newAgreement);
    }
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: 'Share content',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const shippingAddress = activeAgreement.addressByShippingAddressId
    ? activeAgreement.addressByShippingAddressId
    : activeAgreement.address;
  const phoneNum =
    contact.phone_home || contact.phone_mobile || contact.phone_office;
  const {status, agreementEditable} = getAgreementStatus();

  return (
    <View style={styles.container}>
      <StatusBar
        animated={false}
        backgroundColor="transparent"
        barStyle={'light-content'}
        translucent={true}
      />
      <AppHeader
        leftContent={
          <TouchableOpacity onPress={() => navigation.pop()}>
            <AppText size={16} color={'textLightPurple'} font="anMedium">
              Close
            </AppText>
          </TouchableOpacity>
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
        pageTitle=""
        toolbarLeftContent={
          <View style={styles.toolbarLeftContent}>
            <AppText color={'textBlack2'} size={34} font={'anSemiBold'}>
              {`Quote ${prefix}${numeral(agreement.number).format('00000')}`}
            </AppText>
            {!agreementEditable && (
              <FontAwesomeIcon
                name="lock"
                color="#55465F"
                size={30}
                style={styles.lockIcon}
              />
            )}
          </View>
        }
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
                {agreementEditable && (
                  <TouchableOpacity onPress={() => {}}>
                    <AppText
                      color={'textLightPurple'}
                      size={12}
                      font={'anSemiBold'}>
                      Edit
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                font={'anRegular'}>
                {activeAgreement.address?.line1}
              </AppText>
              {activeAgreement.address?.line2 ? (
                <AppText
                  style={styles.lineHeight15}
                  color={'textBlack2'}
                  size={16}
                  font={'anRegular'}>
                  {activeAgreement.address?.line2}
                </AppText>
              ) : (
                <View />
              )}
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                numberOfLines={1}
                font={'anRegular'}>
                {`${activeAgreement.address?.city || ''}, ${
                  activeAgreement.address?.us_state || ''
                } ${activeAgreement.address?.postal_code || ''}`}
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
                {agreementEditable && (
                  <TouchableOpacity onPress={() => {}}>
                    <AppText
                      color={'textLightPurple'}
                      size={12}
                      font={'anSemiBold'}>
                      Edit
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                font={'anRegular'}>
                {shippingAddress?.line1}
              </AppText>
              {shippingAddress?.line2 ? (
                <AppText
                  style={styles.lineHeight15}
                  color={'textBlack2'}
                  size={16}
                  font={'anRegular'}>
                  {shippingAddress?.line2}
                </AppText>
              ) : (
                <View />
              )}
              <AppText
                style={styles.lineHeight15}
                color={'textBlack2'}
                size={16}
                numberOfLines={1}
                font={'anRegular'}>
                {`${shippingAddress?.city || ''}, ${
                  shippingAddress?.us_state || ''
                } ${shippingAddress?.postal_code || ''}`}
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
          {agreementEditable && (
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
          )}
        </View>
        <View style={styles.subInfoContainer}>
          {showDetails && (
            <>
              <View style={[styles.block, styles.subInfoView]}>
                <View style={[styles.rowLayout, styles.totalRow]}>
                  <View style={styles.priceCell}>
                    <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                      TOTAL COST
                    </AppText>
                  </View>
                  <View style={styles.subInfoCell}>
                    <AppText color={'textBlack2'} size={12} font={'anSemiBold'}>
                      MARGIN
                    </AppText>
                  </View>
                </View>
                <View style={[styles.rowLayout, styles.totalRow]}>
                  <View style={styles.priceCell}>
                    <AppText color={'textBlack2'} size={24} font={'anRegular'}>
                      {`$${numeral(totalCost / 100).format('0,0.00')}`}
                    </AppText>
                  </View>
                  <View style={styles.subInfoCell}>
                    <AppText color={'textBlack2'} size={24} font={'anRegular'}>
                      {`${Math.round(
                        ((totalPrice - totalCost) / totalPrice) * 100,
                      )}%`}
                    </AppText>
                  </View>
                </View>
              </View>
              <View style={[styles.block, styles.flex1, styles.rightBorder]} />
              <View style={styles.flex1} />
            </>
          )}
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
                {agreementEditable && (
                  <TouchableOpacity onPress={() => setShowSalesTax(true)}>
                    <AppText
                      color={'lightPurple'}
                      size={12}
                      font={'anSemiBold'}>
                      Edit
                    </AppText>
                  </TouchableOpacity>
                )}
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
        </View>
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
                REVIEW AND ACCEPT
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
          <TouchableOpacity
            style={[styles.flex1, styles.revisionText]}
            onPress={updateAgreementRevision}>
            <AppText color={'textLightPurple'} size={16} font={'anMedium'}>
              Create Revision
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.flex1} onPress={onShare}>
            <Image source={ShareIcon} style={styles.shareIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flex1}
            onPress={() => setShowDeletePrompt(true)}>
            <Image source={DeleteIcon} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <Dialog.Container key="set-discount-dialog" visible={showDiscount}>
        <Dialog.Title>Set Discount</Dialog.Title>
        <Dialog.Input
          keyboardType="numeric"
          value={discount}
          style={styles.dialogInput}
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
          style={styles.dialogInput}
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
      <Dialog.Container
        key="delete-agreement-dialog"
        visible={showDeletePrompt}>
        <Dialog.Title>Delete Agreement</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this agreement?
        </Dialog.Description>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setShowDeletePrompt(false);
          }}
        />
        <Dialog.Button
          label="Ok"
          onPress={() => {
            setShowDeletePrompt(false);
            deleteAgreement();
          }}
        />
      </Dialog.Container>
      <Dialog.Container key="set-qty-dialog" visible={showQtyAdjustDialog}>
        <Dialog.Title>Set Quantity</Dialog.Title>
        <Dialog.Input
          keyboardType="numeric"
          value={qtyValue}
          style={styles.dialogInput}
          onChangeText={(text: string) => {
            let value = text.replace(/[^0-9.]/g, '');
            if (parseInt(value, 10) < 1) {
              value = '1';
            }
            setQtyValue(value.toString());
          }}
        />
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setQtyValue('1');
            setShowQtyAdjustDialog(false);
          }}
        />
        <Dialog.Button
          label="Ok"
          onPress={() => {
            setShowQtyAdjustDialog(false);
            changeQty();
          }}
        />
      </Dialog.Container>
      {lineItemModalVisible && <View style={styles.modalWrapper} />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={lineItemModalVisible}>
        <LineItemModal
          onClose={() => setLineItemModalVisible(false)}
          onAddItem={onAddItem}
        />
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
  subInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  subInfoCell: {
    width: 70,
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
    marginTop: 40,
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
    width: 70,
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
    letterSpacing: 3,
  },
  revisionBtnText: {
    color: themeStyle.textWhite,
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
  toolbarLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIcon: {
    height: 34,
    marginLeft: 20,
  },
  rightBorder: {
    borderRightWidth: 1,
    borderRightColor: themeStyle.lightBorderColor,
  },
  flex1: {
    flex: 1,
    paddingHorizontal: 0,
  },
  shareIcon: {
    height: 28,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  deleteIcon: {
    height: 28,
    alignSelf: 'flex-end',
    resizeMode: 'contain',
  },
  revisionBtnView: {
    position: 'absolute',
    paddingBottom: 20,
    height: 70,
    bottom: 0,
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgb(249, 249, 249)',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: themeStyle.lightBorderColor,
  },
  revisionText: {
    height: 50,
    justifyContent: 'center',
  },
  dialogInput: {
    color: themeStyle.black,
  },
});
