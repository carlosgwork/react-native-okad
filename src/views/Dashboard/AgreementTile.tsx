import React from 'react';
import {TouchableOpacity} from 'react-native';
import hexToRgba from 'hex-to-rgba';

import {Agreement} from '@root/utils/types';
import {AppText} from '@root/components';
import {ThemeStyle} from '@root/utils/styles';
import {useStyles} from '@root/global/Hooks';

type Props = {
  agreement: Agreement;
  color: string;
};

export default function AgreementTile({agreement, color}: Props) {
  const {styles} = useStyles(getStyles);
  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        backgroundColor: hexToRgba(color, '0.05'),
        borderColor: color,
      }}>
      <AppText size={16} style={{color: color}}>
        {`${agreement.contact?.name_first} ${agreement.contact?.name_last} (Harmar Straight Stairlift)`}
      </AppText>
    </TouchableOpacity>
  );
}

const getStyles = (themeStyle: ThemeStyle) => ({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    marginRight: themeStyle.scale(15),
    marginVertical: themeStyle.scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: themeStyle.scale(10),
    paddingHorizontal: themeStyle.scale(20),
  },
});
