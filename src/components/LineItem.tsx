import React from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import numeral from 'numeral';

import {useStyles} from '@global/Hooks';
import type {ThemeStyle as StyleType} from '@root/utils/styles';
import AppText from './AppText';
import CustomIcon from './CustomIcon';

type Props = {
  item: any;
  active: boolean;
  setActive: () => void;
};

export default function LineItem({item, active, setActive}: Props) {
  const {styles} = useStyles(getStyles);
  return (
    <ScrollView>
      <View style={styles.rowLayout}>
        <TouchableOpacity
          style={[
            styles.rowLayout,
            styles.rectSection,
            active && styles.active,
          ]}
          onPress={setActive}>
          <AppText color={'textBlack2'} size={18} font={'anMedium'}>
            {item.name}
          </AppText>
          <View style={styles.rowLayout}>
            {item.price !== 0 && (
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
          {!item.image ? (
            <TouchableOpacity style={styles.playIcon}>
              <Icon
                name={item.icon ? item.icon : 'play-outline'}
                color={'#855C9C'}
                size={34}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.imageIcon}>
              <CustomIcon name={'image-glyph'} color={'#855C9C'} size={26} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
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
    paddingLeft: 22,
    paddingRight: 0,
    marginRight: 0,
  },
  imageIcon: {
    paddingLeft: 22,
    paddingRight: 0,
    marginRight: 0,
  },
  active: {
    border: 2,
    backgroundColor: themeStyle.lightPurple10,
  },
});
