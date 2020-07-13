/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {Button} from 'react-native-elements';

import {useStyles} from '@global/Hooks';
import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {logout} from '@redux/actions';

export default function Home() {
  const {replace} = useNavigation();
  const {styles} = useStyles(getStyles);

  const onLogout = React.useCallback(() => {
    logout();

    replace('Auth');
  }, []);
  return (
    <View style={styles.container}>
      <Button style={styles.logoutBtn} onPress={onLogout} title={'Logout'} />
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    backgroundColor: themeStyle.white,
    flex: 1,
  },
  logoutBtn: {
    marginTop: 100,
    height: 100,
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 16,
    }),
  },
});
