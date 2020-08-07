import React from 'react';
import {View, Image} from 'react-native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';

import {AppHeader, NavBackBtn} from '@root/components';
import {ContactsNavProps, AppRouteEnum} from '@root/routes/types';

export default function ContactDetails({
  route,
  navigation,
}: ContactsNavProps<AppRouteEnum.ContactDetails>) {
  const {styles} = useStyles(getStyles);
  const {parent = 'Contacts', itemTitle = ''} = route.params || {};

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn title={parent} onClick={() => navigation.pop()} />
        }
        rightContent={null}
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
