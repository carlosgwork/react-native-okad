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
  onPress: () => void;
};

export default function AgreementTile({agreement, color, onPress}: Props) {
  const {styles} = useStyles(getStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.container,
        backgroundColor: hexToRgba(color, '0.05'),
        borderColor: color,
      }}>
      <AppText size={16} font={'anSemiBold'} style={{color: color}}>
        {`${agreement.contact?.name_first} ${agreement.contact?.name_last}  `}
      </AppText>
      <AppText size={16} font={'anMedium'} style={{color: color}}>
        {`(${agreement.agreement_template.name})`}
      </AppText>
    </TouchableOpacity>
  );
}

const getStyles = (themeStyle: ThemeStyle) => ({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    marginRight: themeStyle.scale(20),
    marginVertical: themeStyle.scale(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: themeStyle.scale(15),
    paddingHorizontal: themeStyle.scale(24),
  },
});
