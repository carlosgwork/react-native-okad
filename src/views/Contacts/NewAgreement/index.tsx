import React from 'react';
import {View, Image, ScrollView} from 'react-native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {AppHeader, AppText} from '@root/components';
import TemplateTile from './TemplateTile';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Templates = [
  {
    logo: '@assets/images/template-logos/bruno-straight-stairlift.png',
  },
  {
    logo: '@assets/images/template-logos/bruno-custom-stairlift.png',
  },
  {
    logo: '@assets/images/template-logos/harmar-straight-stairlift.png',
  },
];

export default function NewAgreement() {
  const {styles} = useStyles(getStyles);

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={null}
        rightContent={
          <TouchableOpacity style={styles.switchText}>
            <AppText size={16} color={'textLightPurple'}>
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
    marginTop: themeStyle.scale(10),
  },
  mainContent: {
    paddingVertical: themeStyle.scale(30),
    paddingLeft: themeStyle.scale(20),
  },
});
