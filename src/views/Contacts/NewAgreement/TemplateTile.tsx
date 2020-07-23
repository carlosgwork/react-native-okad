import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {ThemeStyle} from '@root/utils/styles';
import {useStyles} from '@root/global/Hooks';

type Props = {
  logo: string;
};

export default function AgreementTile({logo}: Props) {
  const {styles} = useStyles(getStyles);
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
      }}>
      <Image source={require(logo)} style={styles.logo} />
    </TouchableOpacity>
  );
}

const getStyles = (themeStyle: ThemeStyle) => ({
  container: {
    paddingVertical: themeStyle.scale(10),
    width: '48%',
  },
  logo: {
    width: '100%',
  },
});
