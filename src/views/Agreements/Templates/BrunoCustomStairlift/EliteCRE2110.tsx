import React from 'react';
import {View, Image, TouchableOpacity, ScrollView} from 'react-native';
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
  LineItemWithImage,
  LineItem,
  UpholsteryOption,
  AppGradButton,
} from '@root/components';
import {ContactsNavProps} from '@root/routes/types';
import {LineItemType} from '@root/utils/types';
import {
  BurnoEliteCreImg90Turn,
  BurnoEliteCreImg180Turn,
  BurnoEliteCreImgRadius,
  BurnoEliteCreImgStraight,
  BurnoEliteCreImgIL,
} from '@assets/assets';

const ElanCatalogs = [
  {
    title: 'Staircase Type',
    items: [
      {
        id: 1,
        name: '90° Turn',
        price: 500000,
        image: BurnoEliteCreImg90Turn,
        type: 'image',
      },
      {
        id: 2,
        name: '180° Turn',
        price: 400000,
        image: BurnoEliteCreImg180Turn,
        type: 'image',
      },
      {
        id: 3,
        name: 'Radius',
        price: 600000,
        image: BurnoEliteCreImgRadius,
        type: 'image',
      },
      {
        id: 4,
        name: 'Intermediate Landing',
        price: 700000,
        image: BurnoEliteCreImgIL,
        type: 'image',
      },
      {
        id: 5,
        name: 'Straight Overrun',
        price: 800000,
        image: BurnoEliteCreImgStraight,
        type: 'image',
      },
    ],
  },
  {
    title: 'Rail Additions',
    items: [
      {
        id: 6,
        name: '90° Turn',
        price: 237000,
        icon: undefined,
        type: 'switch',
      },
      {
        id: 7,
        name: '180° Turn',
        price: 237000,
        icon: undefined,
        type: 'switch',
      },
      {
        id: 8,
        name: 'Turn on Radius',
        price: 368000,
        icon: undefined,
        type: 'switch',
      },
      {
        id: 9,
        name: 'Intermediate Landing',
        price: 173500,
        icon: undefined,
        type: 'switch',
      },
      {
        id: 10,
        name: 'Special Bend',
        price: 21500,
        icon: undefined,
        type: 'switch',
      },
      {
        id: 11,
        name: 'Overrun',
        price: 121000,
        icon: undefined,
        type: 'switch',
      },
      {
        id: 12,
        name: 'Foot of Length',
        price: 10000,
        icon: undefined,
        type: 'switch',
      },
    ],
  },
  {
    title: 'Park Stations',
    items: [
      {
        id: 13,
        name: '90°',
        price: 205500,
        icon: undefined,
        type: 'switch',
      },
      {
        id: 14,
        name: '180°',
        price: 237000,
        icon: undefined,
        type: 'switch',
      },
      {
        id: 15,
        name: 'Mid-Park',
        price: 34000,
        icon: undefined,
        type: 'switch',
      },
    ],
  },
  {
    title: 'Seat',
    items: [
      {
        id: 16,
        name: 'Manual Swivel Seat',
        price: 0,
        category: 'seat',
      },
      {
        id: 17,
        name: 'Power Swivel Seat',
        price: 72900,
        category: 'seat',
      },
    ],
  },
  {
    title: 'Footrest',
    items: [
      {
        id: 18,
        name: 'Manual Folding Footrest',
        price: 0,
        category: 'Footrest',
      },
      {
        id: 19,
        name: 'Power Folding Footrest',
        price: 50000,
        category: 'Footrest',
      },
    ],
  },
  {
    title: 'Upholstery Options',
    items: [
      {
        id: 40,
        name: 'Maroon Vinyl',
        price: 35000,
        type: 'color',
        color: undefined,
        category: 'Upholstery Options',
      },
    ],
  },
  {
    title: 'Additional Rail Options',
    items: [
      {
        id: 50,
        name: 'Custom RAL Color',
        price: 630500,
        icon: 'image-outline',
        category: 'Additional Rail Options',
      },
    ],
  },
];

export default function EliteCRE2110Template({
  route,
  navigation,
}: ContactsNavProps) {
  const {parent = '', itemTitle = ''} = route.params || {};

  const {product, items} = useSelector((state: any) => state.cart);

  const {styles} = useStyles(getStyles);
  const updateQty = (item: LineItemType, qty: number) => {
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
    } else {
      newItems.splice(itemIndex, 1);
    }
    setAction('cart', {items: newItems});
  };
  const chooseUpholstery = (item: LineItemType) => {
    const newItems = items.slice();
    const itemIndex = newItems.findIndex(
      (it: LineItemType) => it.id === item.id,
    );
    if (itemIndex > -1) {
      newItems.splice(itemIndex, 1);
    }
    newItems.push(item);
    setAction('cart', {items: newItems});
  };

  // Calculate Total Price
  let totalPrice = product.price;
  items.map((item: LineItemType) => {
    if (item.quantity !== undefined) {
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
      <ScrollView style={styles.mainContent}>
        {ElanCatalogs.map((catalog: any, index: number) => (
          <View style={styles.block} key={index}>
            <AppText color={'textBlack2'} size={24} font={'anSemiBold'}>
              {catalog.title}
            </AppText>
            <View style={[styles.rowLayout, styles.alignLeft]}>
              {catalog.items.map((item: LineItemType, id: number) => (
                <>
                  {item.type === 'switch' && (
                    <>
                      <View style={styles.divider} />
                      <LineItemWithSwitch
                        key={id}
                        item={item}
                        qty={
                          items[
                            items.findIndex(
                              (it: LineItemType) => it.id === item.id,
                            )
                          ]?.quantity || 0
                        }
                        setQty={(num) => updateQty(item, num)}
                      />
                    </>
                  )}
                  {item.type === 'image' && (
                    <LineItemWithImage
                      key={id}
                      active={
                        items.findIndex(
                          (it: LineItemType) => it.id === item.id,
                        ) > -1
                      }
                      item={item}
                      setActive={() => chooseItem(item)}
                    />
                  )}
                  {item.type === 'color' && (
                    <UpholsteryOption
                      key={id}
                      item={item}
                      setActive={(it: LineItemType) => chooseUpholstery(it)}
                    />
                  )}
                  {item.type === undefined && (
                    <LineItem
                      key={id}
                      active={
                        items.findIndex(
                          (it: LineItemType) => it.id === item.id,
                        ) > -1
                      }
                      item={item}
                      setActive={() => chooseItem(item)}
                    />
                  )}
                </>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
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
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: themeStyle.lightBorderColor,
  },
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: themeStyle.scale(10),
  },
  alignLeft: {
    justifyContent: 'flex-start',
  },
  mainContent: {
    paddingVertical: themeStyle.scale(30),
    paddingHorizontal: themeStyle.scale(20),
    marginBottom: 50,
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
