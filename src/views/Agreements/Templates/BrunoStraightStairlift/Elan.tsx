import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import numeral from 'numeral';
import {useSelector} from 'react-redux';
import {setAction} from '@redux/actions';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {
  AppHeader,
  AppText,
  NavBackBtn,
  LineItemWithSwitch,
  LineItem,
  AppGradButton,
} from '@root/components';
import {ContactsNavProps} from '@root/routes/types';
import {LineItemType} from '@root/utils/types';

const ElanCatalogs = [
  {
    title: 'Seat',
    items: [
      {
        id: 1,
        name: 'Manual Swivel Seat',
        price: 72900,
        category: 'seat',
      },
      {
        id: 2,
        name: 'Power-Assisted Swivel Seat',
        price: 72900,
        category: 'seat',
      },
    ],
  },
  {
    title: 'Footrest',
    items: [
      {
        id: 3,
        name: 'Manual Folding Footrest',
        price: 0,
        category: 'Footrest',
      },
      {
        id: 4,
        name: 'Power Folding Footrest',
        price: 50000,
        category: 'Footrest',
      },
    ],
  },
  {
    title: 'Rail',
    items: [
      {
        id: 5,
        name: 'Fixed Rail',
        price: 0,
        icon: 'image-outline',
        category: 'Rail',
      },
      {
        id: 6,
        name: 'Manual Folding Rail',
        price: 70000,
        category: 'Rail',
      },
      {
        id: 7,
        name: 'Power Folding Rail',
        price: 140000,
        category: 'Rail',
      },
    ],
  },
  {
    title: 'Additional Rail Options',
    items: [
      {
        id: 8,
        name: "20' Rail Installation Kit",
        price: 25500,
        icon: undefined,
        type: 'switch',
      },
    ],
  },
];

export default function ElanTemplate({route, navigation}: ContactsNavProps) {
  const {parent = '', itemTitle = ''} = route.params || {};

  const {product, items} = useSelector((state: any) => state.cart);

  const {styles} = useStyles(getStyles);
  const updateQty = (item: LineItemType, qty: number) => {
    console.log(qty);
    const itemIndex = items.findIndex((it: LineItemType) => it.id === item.id);
    if (itemIndex < 0) {
      items.push(item);
    }
    const newItems = items.map((it: LineItemType) => {
      if (it.id === item.id) {
        it.quantity = qty;
        return it;
      }
      return it;
    });
    setAction('cart', {items: newItems});
  };
  const chooseItem = (item: LineItemType) => {
    const newItems = items.slice();
    const itemIndex = newItems.findIndex(
      (it: LineItemType) => it.id === item.id,
    );
    if (itemIndex < 0) {
      let itemIndex2 = newItems.findIndex(
        (it: LineItemType) => it.category === item.category,
      );
      while (itemIndex2 > -1) {
        newItems.splice(itemIndex2, 1);
        itemIndex2 = newItems.findIndex(
          (it: LineItemType) => it.category === item.category,
        );
      }
      newItems.push(item);
      setAction('cart', {items: newItems});
    }
  };

  // Calculate Total Price
  let totalPrice = product.price;
  items.map((item: LineItemType) => {
    if (item.quantity) {
      totalPrice += item.price * item.quantity;
    } else {
      totalPrice += item.price;
    }
  });

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn title={parent} onClick={() => navigation.pop()} />
        }
        rightContent={
          <TouchableOpacity
            style={styles.switchText}
            onPress={() => navigation.pop()}>
            <AppText size={16} font={'anSemiBold'} color={'textLightPurple'}>
              Cancel
            </AppText>
          </TouchableOpacity>
        }
        pageTitle={itemTitle}
        toolbarCenterContent={null}
        toolbarRightContent={
          <Image
            source={require('@assets/images/gamburd-logo.png')}
            style={styles.logo}
          />
        }
      />
      <View style={styles.mainContent}>
        {ElanCatalogs.map((catalog: any, index: number) => (
          <View style={styles.block} key={index}>
            <AppText color={'textBlack2'} size={24} font={'anSemiBold'}>
              {catalog.title}
            </AppText>
            {catalog.items.map((item: LineItemType, id: number) => (
              <>
                {item.type === 'switch' ? (
                  <LineItemWithSwitch
                    key={id}
                    item={item}
                    qty={
                      items[
                        items.findIndex((it: LineItemType) => it.id === item.id)
                      ]?.quantity || 0
                    }
                    setQty={(num) => updateQty(item, num)}
                  />
                ) : (
                  <LineItem
                    key={id}
                    active={
                      items.findIndex((it: LineItemType) => it.id === item.id) >
                      -1
                    }
                    item={item}
                    setActive={() => chooseItem(item)}
                  />
                )}
              </>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.bottomBtnView}>
        <AppGradButton
          containerStyle={styles.createBtnContainer}
          textStyle={styles.createBtnText}
          btnStyle={styles.createBtn}
          title={`$${numeral(totalPrice / 100).format('0,0.00')} or $${numeral(
            totalPrice / 100 / 60,
          ).format('0,0.00')}/month`}
          leftIconContent={<></>}
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  searchContainer: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  logo: {
    resizeMode: 'stretch',
    maxWidth: 230,
    height: themeStyle.scale(24),
  },
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: themeStyle.scale(10),
  },
  mainContent: {
    paddingVertical: themeStyle.scale(50),
    paddingHorizontal: themeStyle.scale(20),
  },
  galleryContainer: {
    marginTop: themeStyle.scale(30),
  },
  marginRight15: {
    marginRight: themeStyle.scale(30),
    paddingVertical: 20,
  },
  imageStyle: {
    width: '100%',
    resizeMode: 'contain',
    height: 400,
  },
  slideItem: {
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  itemContent: {
    width: '100%',
    paddingHorizontal: '15%',
    borderRightWidth: 1,
    borderRightColor: '#C6C6C8',
    paddingBottom: 30,
  },
  descriptionText: {
    color: themeStyle.textBlack2,
    lineHeight: 30,
    fontSize: 16,
  },
  ctaBtnContainer: {
    alignItems: 'center',
  },
  ctaBtn: {
    textAlign: 'center',
    width: '40%',
  },
  ctaInnerBtn: {
    paddingRight: 0,
    paddingLeft: 20,
  },
  diagonalBox: {
    backgroundColor: themeStyle.backgroundWhite,
    paddingVertical: 10,
    paddingHorizontal: 50,
    transform: [{rotate: '-45deg'}, {translateY: '15%'}, {translateX: '-65%'}],
    position: 'absolute',
    top: 0,
    left: 0,
  },
  uppercaseText: {
    textTransform: 'uppercase',
  },
  block: {
    paddingBottom: 40,
  },
  bottomBtnView: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
  },
  createBtnContainer: {
    width: '100%',
  },
  createBtn: {
    borderTopLeftRadius: 0,
    paddingVertical: 10,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    fontSize: 30,
  },
  createBtnText: {
    textTransform: 'uppercase',
  },
});
