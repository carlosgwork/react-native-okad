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
} from '@root/components';
import {ContactsNavProps, ContactsStackParamList} from '@root/routes/types';

import {EliteCRE2110} from '@assets/assets';
import {setAction} from '@root/redux/actions';
import {ProductItemProps} from '@root/utils/types';
import {BRUNO_CUSTOM_PRODUCTS} from './data';

const {width: viewportWidth} = Dimensions.get('window');

export default function BrunoCustomStairlift({
  route,
  navigation,
}: ContactsNavProps) {
  const {styles} = useStyles(getStyles);
  const {itemId, parent = '', itemTitle = ''} = route.params || {};
  const [isIndoor, setIsIndoor] = useState<boolean>(true);
  const {themeStyle} = useTheme();

  const _renderItem = ({item, index}: ProductItemProps) => {
    const selectProduct = () => {
      setAction('cart', {product: item});
      navigation.navigate(
        'EliteCRE2110Template' as keyof ContactsStackParamList,
        {
          itemTitle: item.name,
          parent: 'Bruno Custom Stairlift',
        },
      );
    };

    return (
      <View key={index} style={styles.slideItem}>
        <Image style={styles.imageStyle} source={EliteCRE2110} />
        <View style={styles.rowLayout}>
          <AppText
            style={styles.uppercaseText}
            color={'textBlack2'}
            size={20}
            font={'anSemiBold'}>
            {item.name}
          </AppText>
          <TouchableOpacity>
            <Icon
              color={themeStyle.textPurple}
              name={'images-outline'}
              size={24}
              style={styles.marginLeft15}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon
              color={themeStyle.textPurple}
              name={'ios-videocam-outline'}
              size={28}
              style={styles.marginLeft15}
            />
          </TouchableOpacity>
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
          <TouchableOpacity
            style={[styles.rowLayout, styles.ctaBtn]}
            onPress={selectProduct}>
            <AppText color={'textLightPurple'} size={20} font={'anSemiBold'}>
              Continue
            </AppText>
            <Icon
              color={themeStyle.textLightPurple}
              name={'arrow-forward-outline'}
              size={24}
              style={styles.marginLeft5}
            />
          </TouchableOpacity>
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
        pageTitle={'Bruno Custom Stairlift'}
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
              (isIndoor
                ? BRUNO_CUSTOM_PRODUCTS.indoor
                : BRUNO_CUSTOM_PRODUCTS.outdoor) as any[]
            }
            renderItem={_renderItem}
            sliderWidth={viewportWidth - 40}
            itemWidth={viewportWidth - 40}
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
  marginLeft15: {
    marginLeft: themeStyle.scale(30),
    paddingVertical: 20,
  },
  imageStyle: {
    width: '100%',
    resizeMode: 'contain',
    height: 400,
  },
  slideItem: {
    justifyContent: 'flex-start',
  },
  itemContent: {
    width: '100%',
    paddingBottom: 30,
  },
  descriptionText: {
    color: themeStyle.textBlack2,
    lineHeight: 30,
    fontSize: 16,
  },
  ctaBtnContainer: {
    alignItems: 'flex-end',
  },
  ctaBtn: {
    textAlign: 'center',
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
    flex: 1,
  },
  marginLeft5: {
    marginLeft: themeStyle.scale(5),
  },
});
