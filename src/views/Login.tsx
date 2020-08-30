import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/auth';
import {setAction} from '@redux/actions';
import {Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useQuery, gql} from '@apollo/client';

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
import {GET_LAST_AGREEMENT_OF_USER} from './Agreements/graphql';

const GET_USERINFO = gql`
  query GetCurrentUser($user_id: Int) {
    users(where: {id: {_eq: $user_id}}) {
      deleted
      default_sales_tax_rate
      created
      email
      google_id
      id
      last_modified
      name_first
      name_last
      organization_id
      prefix
      public_id
      pres
    }
  }
`;

export default function Login() {
  const {themeStyle} = useTheme();
  const {replace} = useNavigation<any>();
  const {styles} = useStyles(getStyles);
  const [userId, setUserId] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useQuery(GET_LAST_AGREEMENT_OF_USER, {
    variables: {user_id: userId},
    onCompleted: (data) => {
      if (data && data.agreements?.length > 0) {
        setAction('user', {
          lastAgreementNumber: parseInt(data.agreements[0].number, 10),
        });
      } else {
        setAction('user', {
          lastAgreementNumber: 0,
        });
      }
    },
  });

  useQuery(GET_USERINFO, {
    variables: {user_id: userId},
    onCompleted: (data) => {
      if (data && data.users?.length > 0) {
        setAction('user', {
          deleted: data.users[0].deleted,
          default_sales_tax_rate: data.users[0].default_sales_tax_rate,
          created: data.users[0].created,
          email: data.users[0].email,
          google_id: data.users[0].google_id,
          id: data.users[0].id,
          last_modified: data.users[0].last_modified,
          name_first: data.users[0].name_first,
          name_last: data.users[0].name_last,
          organization_id: data.users[0].organization_id,
          prefix: data.users[0].prefix,
          public_id: data.users[0].public_id,
          pres: data.users[0].pres,
        });
      }
    },
  });

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
      // await GoogleSignin.hasPlayServices();
      // const {idToken}: User = await GoogleSignin.signIn();
      // const credential = firebase.auth.GoogleAuthProvider.credential(idToken);
      // // const userInfo = await firebase.auth().signInWithCredential(credential);
      // await firebase.auth().signInWithCredential(credential);
      setLoading(false);
      setUserId(1);
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
