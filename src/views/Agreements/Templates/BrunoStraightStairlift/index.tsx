import React, {useState} from 'react';
import {View, Image, TouchableOpacity, Text, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from 'react-native-snap-carousel';
import numeral from 'numeral';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';
import {
  AppHeader,
  AppText,
  NavBackBtn,
  IndoorOutdoorSwitch,
  AppGradButton,
} from '@root/components';
import {
  AppNavProps,
  ContactsStackParamList,
  AppRouteEnum,
} from '@root/routes/types';

import {ElanImage, EliteImage} from '@assets/assets';
import {setAction} from '@root/redux/actions';
import {ProductItemProps} from '@root/utils/types';

import {ELAN_PRODUCTS} from './data';

const {width: viewportWidth} = Dimensions.get('window');

export default function BrunoStraightStairlift({
  route,
  navigation,
}: AppNavProps<AppRouteEnum.TEMPLATES>) {
  const {styles} = useStyles(getStyles);
  const {contact, templateId, parent = ''} = route.params || {};
  const [isIndoor, setIsIndoor] = useState<boolean>(true);
  const {themeStyle} = useTheme();

  const _renderItem = ({item, index}: ProductItemProps) => {
    const selectProduct = () => {
      setAction('cart', {items: [item]});
      navigation.navigate('ElanTemplate' as keyof ContactsStackParamList, {
        itemTitle: item.name,
        parent: 'Bruno Straight Stairlift',
        contact,
        templateId,
      });
    };

    let productImage;
    const category = item.name.split(' ')[0];
    switch (category) {
      case 'Elan':
        productImage = ElanImage;
        break;
      case 'Elite':
        productImage = EliteImage;
        break;
      default:
    }

    return (
      <View key={index} style={styles.slideItem}>
        <Image style={styles.imageStyle} source={productImage} />
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
          <AppText color={'textBlack2'} size={20} font={'anSemiBold'}>
            {item.name}
          </AppText>
        </View>
        <View style={styles.itemContent}>
          <View>
            <Text style={styles.descriptionText}>{item.description}</Text>
          </View>
          <View style={styles.rowLayout}>
            <AppText
              color={'textBlack2'}
              font={'anSemiBold'}
              size={18}>{`Starting at $${numeral(item.price / 100).format(
              '0,0.00',
            )}`}</AppText>
            <AppText size={16} color={'textBlack2'}>
              {' or '}
            </AppText>
            <AppText
              color={'textBlack2'}
              font={'anSemiBold'}
              size={18}>{`$${numeral(item.price / 100 / 60).format(
              '0,0.00',
            )}/month`}</AppText>
          </View>
        </View>
        <View style={styles.ctaBtnContainer}>
          <View style={styles.ctaBtn}>
            <AppGradButton
              btnStyle={styles.ctaInnerBtn}
              textStyle={styles.ctaInnerBtnText}
              title={`Select ${category}`}
              onPress={selectProduct}
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
            data={
              (isIndoor ? ELAN_PRODUCTS.indoor : ELAN_PRODUCTS.outdoor) as any[]
            }
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
    paddingHorizontal: '10%',
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
  ctaInnerBtnText: {
    textTransform: 'uppercase',
    letterSpacing: 2,
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
