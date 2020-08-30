import React from 'react';
import {View, Image, ScrollView, TouchableOpacity} from 'react-native';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {AppHeader, AppText, NavBackBtn} from '@root/components';
import TemplateTile from './TemplateTile';
import {
  ContactsNavProps,
  ContactsStackParamList,
  AppRouteEnum,
} from '@root/routes/types';
import {setAction} from '@root/redux/actions';

const Templates = [
  {
    name: 'BrunoStraightStairlift',
    logo: require('@assets/images/template-logos/bruno-straight-stairlift.png'),
  },
  {
    name: 'BrunoCustomStairlift',
    logo: require('@assets/images/template-logos/bruno-custom-stairlift.png'),
  },
  {
    name: 'HarmarStraightStairlift',
    logo: require('@assets/images/template-logos/harmar-straight-stairlift.png'),
  },
];

export default function NewAgreement({
  route,
  navigation,
}: ContactsNavProps<AppRouteEnum.NewAgreement>) {
  const {styles} = useStyles(getStyles);
  const {contact, parent = '', itemTitle = ''} = route.params || {};
  const navigateTemplate = (index: number) => {
    // Init Cart state
    setAction('cart', {product: {}, items: []});
    const templateName = Templates[index].name as keyof ContactsStackParamList;
    navigation.navigate(templateName, {
      parent: 'New Agreement',
      templateId: 1,
      contact: contact,
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn
            title={parent ? parent : itemTitle}
            onClick={() => navigation.pop()}
          />
        }
        rightContent={
          <TouchableOpacity
            style={styles.switchText}
            onPress={() => {
              navigation.navigate(AppRouteEnum.ContactDetails, {
                itemId: contact.id,
                itemTitle,
              });
            }}>
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
            <TemplateTile
              key={index}
              logo={template.logo}
              onPress={() => navigateTemplate(index)}
            />
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
