import React from 'react';
import {TouchableOpacity, Image, ImageSourcePropType} from 'react-native';
import {ThemeStyle} from '@root/utils/styles';
import {useStyles} from '@root/global/Hooks';

type Props = {
  logo: ImageSourcePropType;
};

export default function AgreementTile({logo}: Props) {
  const {styles} = useStyles(getStyles);
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
      }}>
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
});
