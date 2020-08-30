import React, {useState} from 'react';
import {View, TouchableOpacity, Alert} from 'react-native';
import {Input} from 'react-native-elements';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import phone from 'phone';
import {ContactsNavProps, AppRouteEnum} from '@root/routes/types';
import {useMutation} from '@apollo/client';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';
import {
  AppHeader,
  AppText,
  AppGradButton,
  CircularLoading,
} from '@root/components';
import {Contact, Address} from '@root/utils/types';
import {fetchAddressFromLocation} from '@root/utils/apis';
import {emptyContact} from '@root/utils/constants';
import {CREATE_CONTACT} from '../graphql';
import Icon from 'react-native-vector-icons/Ionicons';

export default function NewContact({
  navigation,
}: ContactsNavProps<AppRouteEnum.NewContactModal>) {
  const {styles} = useStyles(getStyles);
  const {themeStyle} = useTheme();
  const [insert_contacts] = useMutation(CREATE_CONTACT, {
    onCompleted() {
      Alert.alert('New contact was successfully created.');
      setTimeout(() => navigation.pop(), 2000);
    },
  });
  const [loadingLocation, setLoadingLocation] = useState<boolean>(false);
  const [error, setError] = useState<Contact>(emptyContact);
  const [form, setForm] = useState<Contact>(emptyContact);
  const changeForm = (field: keyof Contact, value: string) => {
    const newForm: Contact = Object.assign({}, form);
    if (
      field === 'phone_home' ||
      field === 'phone_office' ||
      field === 'phone_mobile'
    ) {
      const cleaned = ('' + value).replace(/\D/g, '');
      const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
      if (match) {
        const intlCode = match[1] ? '+1 ' : '',
          number = [
            intlCode,
            '(',
            match[2],
            ') ',
            match[3],
            '-',
            match[4],
          ].join('');
        newForm[field] = number;
      } else {
        newForm[field] = value as never;
      }
    } else {
      newForm[field] = value as never;
    }
    setForm(newForm);
  };
  const changeAddress = (field: keyof Address, value: string) => {
    const newAddress: Address = Object.assign({}, form.address);
    newAddress[field] = value as never;
    const newForm = Object.assign({}, form);
    newForm.address = newAddress;
    setForm(newForm);
  };
  const getAddressFromCurrentLocation = () => {
    setLoadingLocation(true);
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        const params = {
          long: position.coords.longitude,
          lat: position.coords.latitude,
        };
        fetchAddressFromLocation(params).then((addr: Address) => {
          const newForm = Object.assign({}, form);
          newForm.address = addr;
          setLoadingLocation(false);
          setForm(newForm);
        });
      },
      (err) => {
        setLoadingLocation(false);
        console.log(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };
  const validateForm = () => {
    let valid = true;
    const newError = Object.assign({}, emptyContact);
    const newForm = Object.assign({}, form);
    if (!form.name_first) {
      newError.name_first = 'Required';
      valid = false;
    }
    if (!form.name_last) {
      newError.name_last = 'Required';
      valid = false;
    }
    if (form.phone_mobile && phone(form.phone_mobile).length === 0) {
      newError.phone_mobile = 'Invalid Phone number';
      valid = false;
    } else if (form.phone_mobile) {
      newForm.phone_mobile = phone(form.phone_mobile)[0];
    }
    if (form.phone_office && phone(form.phone_office).length === 0) {
      newError.phone_office = 'Invalid Phone number';
      valid = false;
    } else if (form.phone_office) {
      newForm.phone_office = phone(form.phone_office)[0];
    }
    if (!form.address.line1) {
      newError.address.line1 = 'Required';
      valid = false;
    }
    if (!form.address.line1) {
      newError.address.line1 = 'Required';
      valid = false;
    }
    if (!form.address.us_state) {
      newError.address.us_state = 'Required';
      valid = false;
    }
    if (form.address.us_state && form.address.us_state.length !== 2) {
      newError.address.us_state = 'Invalid State';
      valid = false;
    }
    if (!form.address.city) {
      newError.address.city = 'Required';
      valid = false;
    }
    if (!form.address.postal_code) {
      newError.address.postal_code = 'Required';
      valid = false;
    }
    if (!form.address.line2) {
      newForm.address.line2 = '';
    }
    const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (form.email && !re.test(String(form.email).toLowerCase())) {
      newError.email = 'Email is invalid';
      valid = false;
    }
    if (!valid) {
      setError(newError);
      return;
    }
    createContact(newForm);
  };

  const createContact = (formData: Contact) => {
    insert_contacts({
      variables: {
        company: formData.company,
        email: formData.email,
        name_first: formData.name_first,
        name_last: formData.name_last,
        phone_mobile: formData.phone_mobile,
        phone_office: formData.phone_office,
        title: formData.title,
        city: formData.address.city,
        line1: formData.address.line1,
        line2: formData.address.line2,
        postal_code: formData.address.postal_code,
        us_state: formData.address.us_state,
        organization_id: 1,
      },
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <TouchableOpacity onPress={() => navigation.pop()}>
            <AppText size={16} color={'textLightPurple'} font="anMedium">
              Cancel
            </AppText>
          </TouchableOpacity>
        }
        rightContent={null}
        pageTitle={'New contact'}
        toolbarCenterContent={null}
        toolbarRightContent={
          <TouchableOpacity
            onPress={getAddressFromCurrentLocation}
            style={styles.rowLayout}>
            <Icon
              name={'navigate'}
              color={themeStyle.textLightPurple}
              size={16}
            />
            <AppText size={14} color={'textLightPurple'} font="anMedium">
              &nbsp;Use my current location
            </AppText>
          </TouchableOpacity>
        }
      />
      <View style={styles.mainContent}>
        <View style={styles.row}>
          <View style={styles.col2}>
            <Input
              placeholder="Mr."
              label="Title"
              labelStyle={styles.labelStyle}
              placeholderTextColor={themeStyle.lightBorderColor}
              inputContainerStyle={styles.input}
              onChangeText={(val) => changeForm('title', val)}
              value={form.title}
            />
          </View>
          <View style={styles.col7}>
            <Input
              placeholder="John"
              label="First Name"
              placeholderTextColor={themeStyle.lightBorderColor}
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.input}
              onChangeText={(val) => changeForm('name_first', val)}
              value={form.name_first}
              errorMessage={error.name_first}
              autoFocus
            />
          </View>
          <View style={styles.col7}>
            <Input
              placeholder="Doe"
              label="Last Name"
              labelStyle={styles.labelStyle}
              placeholderTextColor={themeStyle.lightBorderColor}
              inputContainerStyle={styles.input}
              onChangeText={(val) => changeForm('name_last', val)}
              value={form.name_last}
              errorMessage={error.name_last}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col16}>
            <Input
              label="Company"
              labelStyle={styles.labelStyle}
              placeholderTextColor={themeStyle.lightBorderColor}
              inputContainerStyle={styles.input}
              onChangeText={(val) => changeForm('company', val)}
              value={form.company}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col16}>
            <Input
              label="Address"
              placeholder="123 Maple Ln"
              labelStyle={styles.labelStyle}
              placeholderTextColor={themeStyle.lightBorderColor}
              inputContainerStyle={styles.input}
              onChangeText={(val) => changeAddress('line1', val)}
              value={form.address.line1}
              errorMessage={error.address.line1}
            />
          </View>
          <View style={styles.col16}>
            <Input
              placeholder="Apt4"
              inputContainerStyle={styles.input}
              placeholderTextColor={themeStyle.lightBorderColor}
              labelStyle={styles.labelStyle}
              onChangeText={(val) => changeAddress('line2', val)}
              value={form.address.line2}
            />
          </View>
          <View style={styles.col11}>
            <Input
              placeholder="Los Angeles"
              labelStyle={styles.labelStyle}
              placeholderTextColor={themeStyle.lightBorderColor}
              inputContainerStyle={styles.input}
              onChangeText={(val) => changeAddress('city', val)}
              value={form.address.city}
              errorMessage={error.address.city}
            />
          </View>
          <View style={styles.col2}>
            <Input
              placeholder="CA"
              labelStyle={styles.labelStyle}
              placeholderTextColor={themeStyle.lightBorderColor}
              inputContainerStyle={styles.input}
              onChangeText={(val) => changeAddress('us_state', val)}
              value={form.address.us_state}
              maxLength={2}
              errorMessage={error.address.us_state}
            />
          </View>
          <View style={styles.col3}>
            <Input
              placeholder="90210"
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.input}
              placeholderTextColor={themeStyle.lightBorderColor}
              onChangeText={(val) => changeAddress('postal_code', val)}
              value={form.address.postal_code}
              keyboardType="phone-pad"
              errorMessage={error.address.postal_code}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col8}>
            <Input
              placeholder="(888) 991-3991"
              label="PHONE (MOBILE)"
              labelStyle={styles.labelStyle}
              placeholderTextColor={themeStyle.lightBorderColor}
              inputContainerStyle={styles.input}
              onChangeText={(val) => changeForm('phone_mobile', val)}
              value={form.phone_mobile}
              textContentType="telephoneNumber"
              dataDetectorTypes="phoneNumber"
              keyboardType="phone-pad"
              maxLength={15}
              errorMessage={error.phone_mobile}
            />
          </View>
          <View style={styles.col8}>
            <Input
              placeholder="(888) 991-3992"
              label="PHONE (OFFICE)"
              labelStyle={styles.labelStyle}
              placeholderTextColor={themeStyle.lightBorderColor}
              inputContainerStyle={styles.input}
              onChangeText={(val) => changeForm('phone_office', val)}
              value={form.phone_office}
              textContentType="telephoneNumber"
              dataDetectorTypes="phoneNumber"
              keyboardType="phone-pad"
              maxLength={15}
              errorMessage={error.phone_office}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col16}>
            <Input
              label="Email"
              placeholder="john.doe@gmail.com"
              placeholderTextColor={themeStyle.lightBorderColor}
              labelStyle={styles.labelStyle}
              inputContainerStyle={styles.input}
              autoCapitalize="none"
              onChangeText={(val) => changeForm('email', val)}
              value={form.email}
              errorMessage={error.email}
            />
          </View>
        </View>
        <CircularLoading loading={loadingLocation} />
      </View>
      <View style={styles.bottomBtnView}>
        <AppGradButton
          containerStyle={styles.createBtnContainer}
          textStyle={styles.createBtnText}
          btnStyle={styles.createBtn}
          title={'Create Contact'}
          leftIconContent={<></>}
          onPress={validateForm}
        />
      </View>
    </View>
  );
}

const getStyles = (themeStyle: StyleType) => ({
  container: {
    flex: 1,
    backgroundColor: themeStyle.backgroundWhite,
  },
  mainContent: {
    paddingVertical: themeStyle.scale(10),
    paddingHorizontal: themeStyle.scale(15),
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: themeStyle.scale(30),
  },
  col8: {
    width: '49%',
  },
  col7: {
    width: '42%',
  },
  col16: {
    width: '100%',
  },
  col2: {
    width: '12%',
  },
  col3: {
    width: '18%',
  },
  col11: {
    width: '66%',
  },
  input: {
    paddingVertical: themeStyle.scale(5),
    borderBottomWidth: 1,
    borderBottomColor: themeStyle.lightBorderColor,
    ...themeStyle.getTextStyle({
      color: 'textBlack1',
      font: 'anMedium',
      size: 18,
    }),
    height: 'auto',
  },
  labelStyle: {
    textTransform: 'uppercase',
    paddingBottom: 10,
    ...themeStyle.getTextStyle({
      color: 'textBlack2',
      font: 'anSemiBold',
      size: 12,
    }),
  },
  bottomBtnView: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  createBtnContainer: {
    width: '100%',
  },
  createBtn: {
    borderTopLeftRadius: 0,
    paddingVertical: 12,
    borderTopRightRadius: 0,
  },
  createBtnText: {
    textTransform: 'uppercase',
    ...themeStyle.getTextStyle({
      color: 'white',
      font: 'anSemiBold',
      size: 16,
    }),
    letterSpacing: 2.9,
  },
  rowLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
