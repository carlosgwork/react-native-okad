import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useStyles} from '@global/Hooks';
import type {ThemeStyle as StyleType} from '@root/utils/styles';
import AppText from './AppText';
import hexToRgba from 'hex-to-rgba';

type Props = {
  isIndoor: boolean;
  setIsIndoor: (val: boolean) => void;
};

export default React.memo<Props>(function IndoorOutdoorSwitch({
  isIndoor,
  setIsIndoor,
}: Props) {
  const {styles} = useStyles(getStyles);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={
          isIndoor
            ? {...styles.indoorSection, ...styles.active}
            : {...styles.indoorSection}
        }
        onPress={() => setIsIndoor(true)}>
        <AppText size={20} color={'textBlack2'} font={'anSemiBold'}>
          Indoor
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        style={
          !isIndoor
            ? {...styles.outdoorSection, ...styles.active}
            : {...styles.outdoorSection}
        }
        onPress={() => setIsIndoor(false)}>
        <AppText size={20} color={'textBlack2'} font={'anSemiBold'}>
          Outdoor
        </AppText>
      </TouchableOpacity>
    </View>
  );
});

const getStyles = (themeStyle: StyleType) => ({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  indoorSection: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: themeStyle.black50,
    bordrRightWidth: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  outdoorSection: {
    flex: 1,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    bordrLeftWidth: 0,
    borderColor: themeStyle.black50,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  active: {
    borderWidth: 2,
    borderColor: themeStyle.lightPurple,
    backgroundColor: hexToRgba(themeStyle.lightPurple, 0.1),
  },
});
