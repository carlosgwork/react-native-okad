import React from 'react';
import {Image, View, TouchableOpacity, Dimensions} from 'react-native';

import {useStyles} from '@global/Hooks';
import type {ThemeStyle as StyleType} from '@root/utils/styles';

type Props = {
  item: any;
  active: boolean;
  setActive: () => void;
};

export default function LineItemWithImage({item, active, setActive}: Props) {
  const {styles} = useStyles(getStyles);
  return (
    <TouchableOpacity style={styles.rectSection} onPress={setActive}>
      <Image source={item.image} style={styles.image} />
      {active && <View style={styles.active} />}
    </TouchableOpacity>
  );
}

const getStyles = (themeStyle: StyleType) => {
  const vw: number = Dimensions.get('window').width;
  return {
    rectSection: {
      width: vw / 3 - 15,
      height: vw / 3 - 15,
      padding: 10,
      alignItems: 'center',
      position: 'relative',
    },
    image: {
      resizeMode: 'contain',
      width: '100%',
      height: '100%',
      borderWidth: 1,
      borderRadius: 10,
      borderColor: themeStyle.lightBorderColor,
    },
    active: {
      borderColor: themeStyle.lightPurple,
      borderWidth: 2,
      borderRadius: 10,
      backgroundColor: themeStyle.lightPurple10,
      position: 'absolute',
      top: 10,
      left: 10,
      width: '100%',
      height: '100%',
    },
  };
};
