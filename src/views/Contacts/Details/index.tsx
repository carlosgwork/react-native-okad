import React from 'react';
import {TouchableOpacity, View, Image} from 'react-native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';

import {AppHeader, NavBackBtn, AppText} from '@root/components';
import {ContactsNavProps, AppRouteEnum} from '@root/routes/types';

export default function ContactDetails({route, navigation}: ContactsNavProps) {
  const {styles} = useStyles(getStyles);
  const {parent = 'Contacts', itemTitle = ''} = route.params || {};

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn
            title={parent}
            onClick={() => navigation.navigate(AppRouteEnum.MainContacts, {})}
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
        pageTitle={itemTitle}
        toolbarCenterContent={null}
        toolbarRightContent={
          <Image
            source={require('@assets/images/gamburd-logo.png')}
            style={styles.logo}
          />
        }
      />
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  logo: {
    resizeMode: 'stretch',
    maxWidth: 230,
    height: themeStyle.scale(24),
  },
});
