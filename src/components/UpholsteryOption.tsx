import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import numeral from 'numeral';

import {useStyles} from '@global/Hooks';
import type {ThemeStyle as StyleType} from '@root/utils/styles';
import AppText from './AppText';

type Props = {
  item: any;
  setActive: (_: ColorOptionType) => void;
};

type ColorOptionType = {
  color: string;
  name: string;
  price: number;
};

const SUPPORTED_COLORS = [
  {
    color: '#BEAB90',
    name: 'Cream',
    price: 0,
  },
  {
    color: '#b5651d',
    name: 'Light Brown',
    price: 32000,
  },
  {
    color: '#36454f',
    name: 'Charcoal',
    price: 32000,
  },
  {
    color: '#800000',
    name: 'Maroon',
    price: 32000,
  },
  {
    color: '#808000',
    name: 'Olive',
    price: 32000,
  },
  {
    color: '#A52A2A',
    name: 'Brown',
    price: 56000,
  },
  {
    color: '#800020',
    name: 'Burgundy',
    price: 56000,
  },
  {
    color: '#654321',
    name: 'Dark Brown',
    price: 56000,
  },
  {
    color: '#808080',
    name: 'Grey',
    price: 56000,
  },
  {
    color: '#000',
    name: 'Custom',
    price: 0,
  },
];

export default function UpholsteryOption({item, setActive}: Props) {
  const {styles} = useStyles(getStyles);
  const [activeColor, setActiveColor] = useState<ColorOptionType>(
    SUPPORTED_COLORS[0],
  );
  const changeColor = (index: number) => {
    setActive(SUPPORTED_COLORS[index]);
    setActiveColor(SUPPORTED_COLORS[index]);
  };

  return (
    <>
      <View style={styles.rowLayout}>
        {SUPPORTED_COLORS.map((color, index) => (
          <View
            key={index}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{
              ...styles.circleViewContainer,
              borderColor:
                activeColor.color === color.color ? color.color : 'transparent',
            }}>
            {color.name === 'Custom' ? (
              <TouchableOpacity
                key={index}
                style={[styles.circleView, styles.customColorOption]}
                onPress={() => changeColor(index)}>
                <AppText color={'textBlack2'} font={'anSemiBold'} size={14}>
                  {color.name}
                </AppText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                key={index}
                style={{
                  ...styles.circleView,
                  backgroundColor: color.color,
                }}
                onPress={() => changeColor(index)}
              />
            )}
          </View>
        ))}
      </View>
      <View style={styles.rowLayout}>
        <View style={[styles.rowLayout, styles.rectSection]}>
          <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
            {`${activeColor?.name} Vinyl`}
          </AppText>
          <View style={styles.rowLayout}>
            {activeColor.price !== 0 && (
              <>
                <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
                  {`+$${numeral(activeColor.price / 100).format('0,0.00')} `}
                </AppText>
                <AppText color={'textBlack2'} size={18} font={'anRegular'}>
                  or
                </AppText>
                <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
                  {` $${numeral(activeColor.price / 100 / 60).format(
                    '0,0.00',
                  )}/month`}
                </AppText>
              </>
            )}
            {!activeColor.price && (
              <>
                <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
                  &nbsp;
                </AppText>
              </>
            )}
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.playIcon}>
            <Icon
              name={item.icon ? item.icon : 'image-outline'}
              color={'#855C9C'}
              size={34}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  circleViewContainer: {
    minWidth: 48,
    height: 48,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 3,
    borderRadius: 24,
    backgroundColor: themeStyle.white,
    marginRight: 10,
  },
  circleView: {
    width: '100%',
    height: 40,
    borderRadius: 20,
  },
  rectSection: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
  },
  playIcon: {
    paddingLeft: 25,
    paddingRight: 10,
  },
  active: {
    border: 2,
    backgroundColor: themeStyle.lightPurple10,
  },
  customColorOption: {
    backgroundColor: 'transparent',
    borderColor: '#c6c6c8',
    borderWidth: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
