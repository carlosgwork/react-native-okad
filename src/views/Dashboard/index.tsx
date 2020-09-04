import React, {useState} from 'react';
import {View, Text, Switch, Image, ScrollView, Alert} from 'react-native';
import randomColor from 'randomcolor';
import {GoogleSignin} from '@react-native-community/google-signin';
import {useQuery} from '@apollo/client';
import {useNavigation} from '@react-navigation/native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {Agreement, Contact} from '@utils/types';
import {
  AppHeader,
  AppText,
  AppSearchInput,
  CircularLoading,
} from '@root/components';
import {logout} from '@redux/actions';
import AppGradButton from '@components/AppGradButton';
import {AppNavProps, AppRouteEnum} from '@root/routes/types';
import AgreementTile from './AgreementTile';
import {FETCH_10_AGREEMENTS} from './graphql';

export default function Dashboard({
  navigation,
}: AppNavProps<AppRouteEnum.TEMPLATES>) {
  const {styles} = useStyles(getStyles);
  const {replace} = useNavigation<any>();

  const [BgColors, setBgColors] = useState<string[]>([]);
  const {error, loading} = useQuery(FETCH_10_AGREEMENTS, {
    variables: {type: 'accepted'},
    onCompleted: (data) => {
      setSearchText('');
      setAgreements(data.agreements as Agreement[]);
      setBgColors(
        randomColor({luminosity: 'dark', count: data.agreements.length}),
      );
      setVisibleAgreements(data.agreements);
    },
  });
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [visibleAgreements, setVisibleAgreements] = useState<Agreement[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const onLogout = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      logout();
      replace('Auth');
    } catch (err) {
      Alert.alert('Something else went wrong... ', err.toString());
    }
  };

  const onFilterAgreement = (text: string) => {
    const filteredAgreements = agreements.filter(
      (agreement: Agreement) =>
        `${agreement.contact?.name_first} ${agreement.contact?.name_last}`
          .toLowerCase()
          .indexOf(text.toLowerCase()) > -1,
    );
    setVisibleAgreements(filteredAgreements);
    setSearchText(text);
  };

  const navigateDetails = (agreement: Agreement) => {
    const contact = agreement.contact as Contact;
    navigation.navigate(AppRouteEnum.AgreementDetails, {
      agreement,
      contact: contact,
      parent: `${contact.name_first} ${contact.name_last}`,
    });
  };

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Loading Error</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={null}
        rightContent={
          <View style={styles.flexRow}>
            <AppText
              color={'textLightPurple'}
              size={12}
              font={'anMedium'}
              style={styles.switchText}>
              Show details
            </AppText>
            <Switch
              trackColor={{true: '#855C9C', false: '#f4f4f4'}}
              onValueChange={() => setShowDetails(!showDetails)}
              value={showDetails}
            />
          </View>
        }
        pageTitle={'Dashboard'}
        toolbarCenterContent={
          <View style={styles.searchContainer}>
            <AppSearchInput
              value={searchText}
              placeholderText="Search for anything"
              onChange={onFilterAgreement}
            />
          </View>
        }
        toolbarRightContent={
          <Image
            source={require('@assets/images/gamburd-logo.png')}
            style={styles.logo}
          />
        }
      />
      <ScrollView style={styles.mainContent}>
        <AppText size={22} color={'textBlack2'} font={'anSemiBold'}>
          Recent Open Agreements
        </AppText>
        <View style={styles.rowLayout} key={visibleAgreements.length}>
          {visibleAgreements.map((agreement, index) => (
            <AgreementTile
              key={index}
              agreement={agreement}
              color={BgColors[index]}
              onPress={() => navigateDetails(agreement)}
            />
          ))}
        </View>
        <CircularLoading loading={loading} />
      </ScrollView>
      <AppGradButton
        containerStyle={styles.logoutBtnContainer}
        btnStyle={styles.logoutBtn}
        textStyle={styles.logoutBtnText}
        title={'LOG OUT'}
        leftIconContent={<></>}
        onPress={onLogout}
      />
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  searchContainer: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18,
    }),
  },
  switchText: {
    marginRight: themeStyle.scale(8),
  },
  logo: {
    resizeMode: 'stretch',
    maxWidth: 230,
    height: themeStyle.scale(24),
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: themeStyle.scale(10),
  },
  mainContent: {
    paddingVertical: themeStyle.scale(30),
    paddingLeft: themeStyle.scale(20),
    flex: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 250,
  },
  logoutBtnText: {
    color: themeStyle.textWhite,
  },
  logoutBtnContainer: {
    width: 300,
    alignSelf: 'center',
    marginBottom: 50,
  },
  logoutBtn: {
    paddingLeft: 50,
  },
});
