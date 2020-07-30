import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/auth';
import {setAction} from '@redux/actions';
import {Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
  User,
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
        '561572760348-93oaqnoojcmjcqkolfjm5iqcblhnek9h.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }, []);

  const signIn = async () => {
    setLoading(true);
    if (loading) {
      return;
    }
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken}: User = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
      const userInfo = await firebase.auth().signInWithCredential(credential);
      setLoading(false);
      setAction('user', userInfo.user);
      navigateHome(replace);
    } catch (error) {
      setLoading(false);
      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        Alert.alert('Google Play Services is not available.');
      } else {
        console.log(error);
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
