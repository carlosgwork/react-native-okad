import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {useStyles} from '@global/Hooks';
import type {ThemeStyle as StyleType} from '@root/utils/styles';
import AppText from './AppText';

type Props = {
  item: any;
  active: boolean;
  setActive: () => void;
};

export default function LineItem({item, active, setActive}: Props) {
  const {styles} = useStyles(getStyles);
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
        <TouchableOpacity style={styles.playIcon}>
          <Icon
            name={item.icon ? item.icon : 'play-outline'}
            color={'#855C9C'}
            size={34}
          />
        </TouchableOpacity>
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
  rectSection: {
    borderWidth: 1,
    borderColor: themeStyle.lightPurple,
    borderRadius: 8,
    flex: 1,
    padding: 20,
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
});
