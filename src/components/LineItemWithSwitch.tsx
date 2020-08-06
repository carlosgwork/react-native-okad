import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import numeral from 'numeral';

import {useStyles} from '@global/Hooks';
import type {ThemeStyle as StyleType} from '@root/utils/styles';
import AppText from './AppText';
import {LineItemType} from '@root/utils/types';

type Props = {
  item: LineItemType;
  qty: number;
  setQty: (qty: number) => void;
};

export default function LineItemWithSwitch({item, qty, setQty}: Props) {
  const {styles} = useStyles(getStyles);
  return (
    <View style={styles.rowLayout}>
      <TouchableOpacity style={[styles.rowLayout, styles.rectWithSwitch]}>
        <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
          {item.name}
        </AppText>
        <View style={styles.rowLayout}>
          <View style={styles.sizeCircleContainer}>
            {qty > 0 && (
              <View style={styles.sizeCircle}>
                <AppText color={'white'} size={20} font={'anSemiBold'}>
                  {`${qty}`}
                </AppText>
              </View>
            )}
          </View>
          {item.price && (
            <>
              <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
                {`+$${numeral(item.price / 100).format('0,0.00')} `}
              </AppText>
              <AppText color={'textBlack2'} size={18} font={'anRegular'}>
                or
              </AppText>
              <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
                {` $${numeral(item.price / 100 / 60).format('0,0.00')}/month`}
              </AppText>
            </>
          )}
          {!item.price && (
            <>
              <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
                &nbsp;
              </AppText>
            </>
          )}
        </View>
      </TouchableOpacity>
      <View>
        <View style={styles.sizeCtrl}>
          <TouchableOpacity
            style={[styles.sizeCtrlIcon, styles.minusCtrlIcon]}
            onPress={() => setQty(qty > 1 ? qty - 1 : 0)}>
            <Icon
              name={'remove-outline'}
              color={qty ? '#855C9C' : '#855C9C80'}
              size={30}
            />
          </TouchableOpacity>
          <View style={styles.ctrlDivider} />
          <TouchableOpacity
            style={styles.sizeCtrlIcon}
            onPress={() => setQty(qty + 1)}>
            <Icon name={'add-outline'} color={'#855C9C'} size={30} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rectWithSwitch: {
    borderRadius: 8,
    flex: 1,
    padding: 20,
    paddingLeft: 2,
    alignItems: 'center',
  },
  sizeCtrl: {
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: themeStyle.textLightPurple,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },
  sizeCtrlIcon: {
    paddingHorizontal: 16,
    height: 24,
    marginTop: -10,
  },
  ctrlDivider: {
    width: 1,
    height: 22,
    backgroundColor: themeStyle.lightBorderColor,
  },
  sizeCircleContainer: {
    width: 36,
    height: 36,
    marginRight: 15,
  },
  sizeCircle: {
    paddingTop: 2,
    paddingLeft: 2,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    backgroundColor: themeStyle.textLightPurple,
  },
});
