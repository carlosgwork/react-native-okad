import * as React from 'react';
import {View} from 'react-native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';

export default function Contacts() {
  const {styles} = useStyles(getStyles);

  return <View style={styles.container} />;
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    ...themeStyle.viewCentered,
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18,
    }),
  },
});
