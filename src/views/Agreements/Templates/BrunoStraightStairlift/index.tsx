import React, {useState} from 'react';
import {View, Image, ScrollView, TouchableOpacity} from 'react-native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {
  AppHeader,
  AppText,
  NavBackBtn,
  IndoorOutdoorSwitch,
  CircularLoading,
} from '@root/components';
import {ContactsNavProps} from '@root/routes/types';

export default function NewAgreement({route, navigation}: ContactsNavProps) {
  const {styles} = useStyles(getStyles);
  const {itemId, parent = '', itemTitle = ''} = route.params || {};
  const [isIndoor, setIsIndoor] = useState<boolean>(true);
  const [loadingCatalogs, setLoadingCatalogs] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn
            title={itemId ? itemTitle : parent}
            onClick={() => navigation.pop()}
          />
        }
        rightContent={
          <TouchableOpacity
            style={styles.switchText}
            onPress={() => navigation.pop()}>
            <AppText size={16} font={'anSemiBold'} color={'textLightPurple'}>
              Cancel
            </AppText>
          </TouchableOpacity>
        }
        pageTitle={'Bruno Straight Stairlift'}
        toolbarCenterContent={null}
        toolbarRightContent={
          <Image
            source={require('@assets/images/gamburd-logo.png')}
            style={styles.logo}
          />
        }
      />
      <ScrollView style={styles.mainContent}>
        <IndoorOutdoorSwitch isIndoor={isIndoor} setIsIndoor={setIsIndoor} />
        <View style={styles.galleryContainer}>
          <CircularLoading loading={loadingCatalogs} />
        </View>
      </ScrollView>
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
  logo: {
    resizeMode: 'stretch',
    maxWidth: 230,
    height: themeStyle.scale(24),
  },
  rowLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: themeStyle.scale(10),
  },
  mainContent: {
    paddingVertical: themeStyle.scale(30),
    paddingHorizontal: themeStyle.scale(20),
  },
  galleryContainer: {
    marginTop: themeStyle.scale(30),
  },
});
