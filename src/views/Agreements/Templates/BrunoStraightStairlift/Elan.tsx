import React, {useState} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {
  AppHeader,
  AppText,
  NavBackBtn,
  LineItemWithSwitch,
  AppGradButton,
} from '@root/components';
import {ContactsNavProps} from '@root/routes/types';
import LineItem from '@root/components/LineItem';

const ElanCatalogs = [
  {
    title: 'Seat',
    items: [
      {
        id: 1,
        name: 'Manual Swivel Seat',
        price_total: 729,
        price_monthly: 12.15,
        category: 'seat',
      },
      {
        id: 2,
        name: 'Power-Assisted Swivel Seat',
        price_total: 729,
        price_monthly: 12.15,
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
        price_total: undefined,
        price_monthly: undefined,
        category: 'Footrest',
      },
      {
        id: 4,
        name: 'Power Folding Footrest',
        price_total: 499,
        price_monthly: 8.33,
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
        price_total: undefined,
        price_monthly: undefined,
        icon: 'image-outline',
        category: 'Rail',
      },
      {
        id: 6,
        name: 'Manual Folding Rail',
        price_total: 699,
        price_monthly: 8.33,
        category: 'Rail',
      },
      {
        id: 7,
        name: 'Power Folding Rail',
        price_total: 1399,
        price_monthly: 8.33,
        category: 'Rail',
      },
    ],
  },
  {
    title: 'Additional Rail Options',
    items: [
      {
        id: 8,
        name: 'Foot of Length',
        price_total: 100,
        price_monthly: 12.15,
        icon: undefined,
        type: 'switch',
      },
    ],
  },
];

type LineItem = {
  id: number;
  name: string;
  price_total: number;
  price_monthly: number;
  icon?: string;
  type?: string;
  category?: string;
};

export default function ElanTemplate({route, navigation}: ContactsNavProps) {
  const {styles} = useStyles(getStyles);
  const {parent = '', itemTitle = ''} = route.params || {};
  const [sizes, setSizes] = useState<any>({});
  const [cart, setCart] = useState<any>([]);
  const updateSize = (item: LineItem, size: number) => {
    sizes[item.id] = size > 0 ? size : 0;
    const newSizes = Object.assign({}, sizes);
    setSizes(newSizes);
  };
  const chooseItem = (item: LineItem) => {
    const itemIndex = cart.findIndex((it: LineItem) => it.id === item.id);

    if (itemIndex < 0) {
      let itemIndex2 = cart.findIndex(
        (it: LineItem) => it.category === item.category,
      );
      while (itemIndex2 > -1) {
        cart.splice(itemIndex2, 1);
        itemIndex2 = cart.findIndex(
          (it: LineItem) => it.category === item.category,
        );
      }
      cart.push(item);
      setCart(cart.slice());
    }
  };

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
            {catalog.items.map((item: LineItem, id: number) => (
              <>
                {item.type === 'switch' ? (
                  <LineItemWithSwitch
                    key={id}
                    item={item}
                    size={sizes[item.id] || 0}
                    setSize={(num) => updateSize(item, num)}
                  />
                ) : (
                  <LineItem
                    key={id}
                    active={
                      cart.findIndex((it: LineItem) => it.id === item.id) > -1
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
          title={'$10,403 or $145.88/month'}
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
