import React, {useState, useEffect} from 'react';
import {View, Switch, Image, ScrollView, Alert} from 'react-native';
import randomColor from 'randomcolor';
import {GoogleSignin} from '@react-native-community/google-signin';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {Agreement, AgreementEvent, Contact} from '@utils/types';
import {AppHeader, AppText, AppSearchInput} from '@root/components';
import {logout} from '@redux/actions';
import AppGradButton from '@components/AppGradButton';
import {AppNavProps, AppRouteEnum} from '@root/routes/types';
import AgreementTile from './AgreementTile';

export default function Dashboard({
  navigation,
}: AppNavProps<AppRouteEnum.TEMPLATES>) {
  const {styles} = useStyles(getStyles);
  const {replace} = useNavigation<any>();
  const {agreements} = useSelector((state: any) => ({
    agreements: state.agreements.agreements,
  }));
  const [BgColors, setBgColors] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string | undefined>('');
  const [visibleAgreements, setVisibleAgreements] = useState<Agreement[]>([]);
  const [openAgreements, setOpenAgreements] = useState<Agreement[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  useEffect(() => {
    setSearchText('');
    const ags = [];
    let i = 0;
    while (ags.length < 10) {
      const ag = agreements[i];
      const index = ag?.agreement_events.findIndex(
        (event: AgreementEvent) => event.type === 'accepted',
      );
      if (index < 0) {
        ags.push(ag);
      }
      i++;
    }
    setOpenAgreements(ags);
    setVisibleAgreements(ags);
    setBgColors(randomColor({luminosity: 'dark', count: ags.length}));
  }, [agreements]);

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
    const filteredAgreements = openAgreements.filter(
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
    navigation.navigate(AppRouteEnum.DashboardAgreementDetails, {
      agreement,
      contact: contact,
      parent: `${contact.name_first} ${contact.name_last}`,
    });
  };

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
