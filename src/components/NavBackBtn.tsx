import React from 'react';
import {Icon} from 'react-native-elements';

import AppText from './AppText';
import {useStyles, useTheme} from '@global/Hooks';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
        color={themeStyle.lightPurple}
        name={'chevron-back-outline'}
        type={'ionicon'}
        size={30}
      />
      <AppText size={16} color={'lightPurple'} font="anSemiBold">
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
});
