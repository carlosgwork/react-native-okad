import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {AppHeader, AppText, NavBackBtn} from '@root/components';
import {ContactsNavProps} from '@root/routes/types';

const ElanCatalogs = [
  {
    title: 'Seat',
    items: [
      {
        name: 'Manual Swivel Seat',
        price_total: 729,
        price_monthly: 12.15,
      },
      {
        name: 'Power-Assisted Swivel Seat',
        price_total: 729,
        price_monthly: 12.15,
      },
    ],
  },
  {
    title: 'Footrest',
    items: [
      {
        name: 'Manual Folding Footrest',
        price_total: undefined,
        price_monthly: undefined,
      },
      {
        name: 'Power Folding Footrest',
        price_total: 499,
        price_monthly: 8.33,
      },
    ],
  },
  {
    title: 'Rail',
    items: [
      {
        name: 'Fixed Rail',
        price_total: undefined,
        price_monthly: undefined,
        icon: 'image-outline',
      },
      {
        name: 'Manual Folding Rail',
        price_total: 699,
        price_monthly: 8.33,
      },
      {
        name: 'Power Folding Rail',
        price_total: 1399,
        price_monthly: 8.33,
      },
    ],
  },
  {
    title: 'Additional Rail Options',
    items: [
      {
        name: 'Foot of Length',
        price_total: 100,
        price_monthly: 12.15,
        length: 3,
        icon: undefined,
        type: 'switch',
      },
    ],
  },
];

type AdditionalItemProps = {
  styles: any;
  item: any;
  active: boolean;
  setActive: () => void;
};

const AdditionalItem = ({
  styles,
  item,
  active,
  setActive,
}: AdditionalItemProps) => {
  return (
    <View style={styles.rowLayout}>
      <TouchableOpacity
        style={[styles.rowLayout, styles.rectSection, active && styles.active]}
        onPress={setActive}>
        <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
          {item.name}
        </AppText>
        <View style={styles.rowLayout}>
          {(item.price_monthly || item.price_total) && (
            <>
              <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
                {`+$${item.price_total} `}
              </AppText>
              <AppText color={'textBlack2'} size={18} font={'anRegular'}>
                or
              </AppText>
              <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
                {` $${item.price_monthly}/month`}
              </AppText>
            </>
          )}
          {!(item.price_monthly || item.price_total) && (
            <>
              <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
                &nbsp;
              </AppText>
            </>
          )}
        </View>
      </TouchableOpacity>
      <View>
        {item.type !== 'switch' && (
          <TouchableOpacity style={styles.playIcon}>
            <Icon
              name={item.icon ? item.icon : 'play-outline'}
              color={'#855C9C'}
              size={34}
            />
          </TouchableOpacity>
        )}
        {item.type === 'switch' && (
          <View style={styles.sizeCtrl}>
            <TouchableOpacity
              style={[styles.sizeCtrlIcon, styles.minusCtrlIcon]}>
              <Icon name={'remove-outline'} color={'#855C9C'} size={34} />
            </TouchableOpacity>
            <View style={styles.ctrlDivider} />
            <TouchableOpacity style={styles.sizeCtrlIcon}>
              <Icon name={'add-outline'} color={'#855C9C'} size={34} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default function ElanTemplate({route, navigation}: ContactsNavProps) {
  const {styles} = useStyles(getStyles);
  const {parent = '', itemTitle = ''} = route.params || {};

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
            {catalog.items.map((item: any, id: number) => (
              <AdditionalItem
                key={id}
                active={false}
                item={item}
                setActive={() => {}}
                styles={styles}
              />
            ))}
          </View>
        ))}
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
  rectSection: {
    borderWidth: 1,
    borderColor: themeStyle.lightPurple,
    borderRadius: 8,
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  uppercaseText: {
    textTransform: 'uppercase',
  },
  playIcon: {
    paddingLeft: 25,
    paddingRight: 10,
  },
  block: {
    paddingBottom: 40,
  },
  sizeCtrl: {
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: themeStyle.textLightPurple,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  sizeCtrlIcon: {
    paddingHorizontal: 20,
    height: 28,
    marginTop: -10,
  },
  ctrlDivider: {
    width: 1,
    height: 28,
    backgroundColor: themeStyle.lightBorderColor,
  },
});
