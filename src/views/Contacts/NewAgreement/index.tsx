import React from 'react';
import {View, Image, ScrollView} from 'react-native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {AppHeader, AppText, NavBackBtn} from '@root/components';
import TemplateTile from './TemplateTile';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ContactsNavProps} from '@root/routes/types';

const Templates = [
  {
    logo: require('@assets/images/template-logos/bruno-straight-stairlift.png'),
  },
  {
    logo: require('@assets/images/template-logos/bruno-custom-stairlift.png'),
  },
  {
    logo: require('@assets/images/template-logos/harmar-straight-stairlift.png'),
  },
];

export default function NewAgreement({navigation}: ContactsNavProps) {
  const {styles} = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn title="Back" onClick={() => navigation.pop()} />
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
        pageTitle={'New Agreement'}
        toolbarCenterContent={null}
        toolbarRightContent={
          <Image
            source={require('@assets/images/gamburd-logo.png')}
            style={styles.logo}
          />
        }
      />
      <ScrollView style={styles.mainContent}>
        <AppText size={20} color={'textBlack2'} font={'anSemiBold'}>
          Templates
        </AppText>
        <View style={styles.rowLayout}>
          {Templates.map((template, index) => (
            <TemplateTile key={index} logo={template.logo} />
          ))}
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
});
