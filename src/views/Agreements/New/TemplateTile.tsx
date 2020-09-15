import React from 'react';
import {TouchableOpacity, Image, ImageSourcePropType} from 'react-native';

import {ThemeStyle} from '@root/utils/styles';
import {useStyles} from '@root/global/Hooks';

type Props = {
  logo: ImageSourcePropType;
  onPress: () => void;
  disabled: boolean;
};

export default function TemplateTile({logo, onPress, disabled}: Props) {
  const {styles} = useStyles(getStyles);
  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      disabled={disabled}
      onPress={onPress}>
      <Image source={logo} style={styles.logo} />
    </TouchableOpacity>
  );
}

const getStyles = (themeStyle: ThemeStyle) => ({
  container: {
    paddingTop: themeStyle.scale(10),
    width: '49%',
  },
  logo: {
    resizeMode: 'contain',
    width: '100%',
    height: themeStyle.scale(140),
  },
  disabled: {
    opacity: 0.8,
  },
});
