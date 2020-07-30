import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import firebase from 'react-native-firebase';
import {setAction} from '@redux/actions';

import LinearGradient from 'react-native-linear-gradient';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';
import {navigateHome} from '@utils/functions';
import {CircularLoading} from '@root/components';

export default function Login() {
  const {themeStyle} = useTheme();
  const {replace} = useNavigation<any>();
  const {styles} = useStyles(getStyles);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '57301850215-kvvoss7e43i23qbsvspf8m74q7ug3vkd.apps.googleusercontent.com',
    });
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      // login with credential
      const firebaseUserCredential = await firebase
        .auth()
        .signInWithCredential(credential);
      console.log('---------- credential:', firebaseUserCredential);
      setLoading(false);
      setAction('user', userInfo.user);
      navigateHome(replace);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  return (
    <LinearGradient
      style={styles.container}
      start={{x: 0.0, y: 0.0}}
      end={{x: 0.0, y: 1.0}}
      locations={[0.7, 0.3]}
      colors={[themeStyle.purple, themeStyle.lightPurple]}>
      <GoogleSigninButton
        style={styles.signInBtn}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
      <CircularLoading loading={loading} />
    </LinearGradient>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    ...themeStyle.viewCentered,
  },
  signInBtn: {
    width: 192,
    height: 48,
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18,
    }),
  },
});
