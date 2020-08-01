import React, {useState} from 'react';
import {View, Image, TouchableOpacity, Text, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-snap-carousel';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';
import {
  AppHeader,
  AppText,
  NavBackBtn,
  IndoorOutdoorSwitch,
  AppGradButton,
} from '@root/components';
import {ContactsNavProps, ContactsStackParamList} from '@root/routes/types';

import ElanImg from '@assets/images/elan_sre_3050.png';
import EliteImg from '@assets/images/elite_sre_2010.png';

const {width: viewportWidth} = Dimensions.get('window');

const catalog_items = {
  indoor: [
    {
      category: 'Stairlifts',
      cost: 155000,
      created: '2020-07-31T23:26:50.479677+00:00',
      description:
        '300 lb. weight capacity\nModern styling\nPadded seat and backrest\nFolding seat, footrest and armrests\nColor-matched upholstery\nPrice includes installation & training',
      id: 1,
      installation_fee: 45000,
      name: 'Elan SRE-3050',
      price_total: 3149,
      price_monthly: 52,
      public_id: '42e4eccc-c84e-4cae-bee6-857130e2632c',
      image: ElanImg,
      qbo_id: null,
      sku: 'SRE-3050',
      square_id: null,
      taxable: true,
      subcategory: 'Elan',
    },
    {
      category: 'Stairlifts',
      cost: 239400,
      created: '2020-07-31T23:26:50.479677+00:00',
      description:
        '400 lb. weight capacity\nContemporary styling\nDeluxe padded seat and backrest\nFolding seat, footrest and armrests\nOptional custom upholstery\nPrice includes installation & training',
      id: 2,
      installation_fee: 45000,
      name: 'Elite SRE-2010',
      price_total: 4249,
      price_monthly: 70,
      public_id: '0768aa12-26e2-4344-a21a-6a9bf008b79e',
      qbo_id: null,
      image: EliteImg,
      sku: 'SRE-2010',
      square_id: null,
      taxable: true,
      subcategory: 'Elite',
    },
    {
      category: 'Stairlifts',
      cost: 155000,
      created: '2020-07-31T23:26:50.479677+00:00',
      description:
        '300 lb. weight capacity\nModern styling\nPadded seat and backrest\nFolding seat, footrest and armrests\nColor-matched upholstery\nPrice includes installation & training',
      id: 1,
      installation_fee: 45000,
      name: 'Bruno Elan (Reconditioned)',
      price_total: 3149,
      price_monthly: 52,
      qbo_id: null,
      image: ElanImg,
      sku: 'SRE-ELAN-R',
      square_id: null,
      taxable: true,
      subcategory: 'Elan',
    },
    {
      category: 'Stairlifts',
      cost: 155000,
      created: '2020-07-31T23:26:50.479677+00:00',
      description:
        '300 lb. weight capacity\nModern styling\nPadded seat and backrest\nFolding seat, footrest and armrests\nColor-matched upholstery\nPrice includes installation & training',
      id: 1,
      installation_fee: 45000,
      name: 'Bruno Elite (Reconditioned)',
      price_total: 4249,
      price_monthly: 70,
      qbo_id: null,
      image: EliteImg,
      sku: 'SRE-ELITE-R',
      square_id: null,
      taxable: true,
      subcategory: 'Elite',
    },
  ],
  outdoor: [],
};

export default function BrunoStraightStairlift({
  route,
  navigation,
}: ContactsNavProps) {
  const {styles} = useStyles(getStyles);
  const {itemId, parent = '', itemTitle = ''} = route.params || {};
  const [isIndoor, setIsIndoor] = useState<boolean>(true);
  const {themeStyle} = useTheme();

  const _renderItem = ({item, index}: any) => {
    return (
      <View key={index} style={styles.slideItem}>
        <Image style={styles.imageStyle} source={item.image} />
        {item.name.indexOf('Reconditioned') > -1 && (
          <View style={styles.diagonalBox}>
            <AppText
              style={styles.uppercaseText}
              color={'textBlack2'}
              size={16}
              font={'anSemiBold'}>
              Reconditioned
            </AppText>
          </View>
        )}
        <View style={styles.rowLayout}>
          <TouchableOpacity>
            <Icon
              color={themeStyle.textPurple}
              name={'images-outline'}
              size={24}
              style={styles.marginRight15}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              color={themeStyle.textPurple}
              name={'ios-videocam-outline'}
              size={28}
              style={styles.marginRight15}
            />
          </TouchableOpacity>
          <AppText
            style={styles.uppercaseText}
            color={'textBlack2'}
            size={20}
            font={'anSemiBold'}>
            {item.name}
          </AppText>
        </View>
        <View style={styles.itemContent}>
          <View>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
          <View style={styles.rowLayout}>
            <AppText
              color={'lightPurple'}
              font={'anSemiBold'}
              size={18}>{`Starting at $${item.price_total}`}</AppText>
            <AppText size={16} color={'lightPurple'}>
              {' or '}
            </AppText>
            <AppText
              color={'lightPurple'}
              font={'anSemiBold'}
              size={18}>{`$${item.price_monthly}/month`}</AppText>
          </View>
        </View>
        <View style={styles.ctaBtnContainer}>
          <View style={styles.ctaBtn}>
            <AppGradButton
              btnStyle={styles.ctaInnerBtn}
              title={`Select ${item.subcategory}`}
              onPress={() =>
                navigation.navigate(
                  'ElanTemplate' as keyof ContactsStackParamList,
                  {
                    itemTitle: item.name,
                    parent: 'Bruno Straight Stairlift',
                  },
                )
              }
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn
            title={itemId ? itemTitle : parent}
            onClick={() => navigation.pop()}
          />
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
        pageTitle={'Bruno Straight Stairlift'}
        toolbarCenterContent={null}
        toolbarRightContent={
          <Image
            source={require('@assets/images/gamburd-logo.png')}
            style={styles.logo}
          />
        }
      />
      <View style={styles.mainContent}>
        <IndoorOutdoorSwitch isIndoor={isIndoor} setIsIndoor={setIsIndoor} />
        <View style={styles.galleryContainer}>
          <Carousel
            data={isIndoor ? catalog_items.indoor : catalog_items.outdoor}
            renderItem={_renderItem}
            sliderWidth={viewportWidth}
            itemWidth={viewportWidth / 2.2}
          />
        </View>
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
    justifyContent: 'flex-start',
    marginTop: themeStyle.scale(10),
  },
  mainContent: {
    paddingVertical: themeStyle.scale(30),
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
});
