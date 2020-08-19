import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AppText from './AppText';
import {useStyles, useTheme} from '@global/Hooks';

type Props = {
  title: string;
  onClick: () => any;
};

export default function NavBackBtn({title, onClick}: Props) {
  const {themeStyle} = useTheme();
  const {styles} = useStyles(getStyles);

  return (
    <TouchableOpacity style={styles.flexLayout} onPress={onClick}>
      <Icon
        color={themeStyle.textLightPurple}
        style={styles.iconStyle}
        name={'chevron-left'}
        size={34}
      />
      <AppText size={16} color={'textLightPurple'} font="anMedium">
        {title}
      </AppText>
    </TouchableOpacity>
  );
}

const getStyles = () => ({
  flexLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    height: 40,
    marginLeft: -10,
  },
  iconStyle: {
    marginRight: -5,
    marginTop: 2,
  },
});
