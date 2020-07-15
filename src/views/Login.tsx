/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {useNavigation} from '@react-navigation/native';

import {setAction} from '@redux/actions';

import LinearGradient from 'react-native-linear-gradient';

import {SocialLoginButton} from '@root/components';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';
import {navigateHome} from '@utils/functions';

export default function Login() {
  const {themeStyle} = useTheme();
  const {replace} = useNavigation<any>();
  const {styles} = useStyles(getStyles);
  const onGoogleLogin = React.useCallback(async () => {
    // Login google
    setAction('user', {name: 'Test'});
    navigateHome(replace);
  }, []);
  return (
    <LinearGradient
      style={styles.container}
      start={{x: 0.0, y: 0.0}}
      end={{x: 0.0, y: 1.0}}
      locations={[0.7, 0.3]}
      colors={[themeStyle.purple, themeStyle.lightPurple]}>
      <SocialLoginButton provider={'google'} onPress={onGoogleLogin} />
    </LinearGradient>
  );
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
