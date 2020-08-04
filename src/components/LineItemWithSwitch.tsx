import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {useStyles} from '@global/Hooks';
import type {ThemeStyle as StyleType} from '@root/utils/styles';
import AppText from './AppText';

type Props = {
  item: any;
  size: number;
  setSize: (size: number) => void;
};

export default function LineItemWithSwitch({item, size, setSize}: Props) {
  const {styles} = useStyles(getStyles);
  return (
    <View style={styles.rowLayout}>
      <TouchableOpacity style={[styles.rowLayout, styles.rectWithSwitch]}>
        <AppText color={'textBlack2'} size={18} font={'anSemiBold'}>
          {item.name}
        </AppText>
        <View style={styles.rowLayout}>
          <View style={styles.sizeCircleContainer}>
            {size > 0 && (
              <View style={styles.sizeCircle}>
                <AppText color={'white'} size={20} font={'anSemiBold'}>
                  {`${size}`}
                </AppText>
              </View>
            )}
          </View>
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
        <View style={styles.sizeCtrl}>
          <TouchableOpacity
            style={[styles.sizeCtrlIcon, styles.minusCtrlIcon]}
            onPress={() => setSize(size - 1)}>
            <Icon name={'remove-outline'} color={'#855C9C'} size={34} />
          </TouchableOpacity>
          <View style={styles.ctrlDivider} />
          <TouchableOpacity
            style={styles.sizeCtrlIcon}
            onPress={() => setSize(size + 1)}>
            <Icon name={'add-outline'} color={'#855C9C'} size={34} />
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
    marginTop: 10,
  },
  rectWithSwitch: {
    borderRadius: 8,
    flex: 1,
    padding: 20,
    paddingLeft: 2,
    alignItems: 'center',
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
    height: 24,
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
