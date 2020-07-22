import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Input} from 'react-native-elements';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';
import {AppHeader, AppText, NavBackBtn} from '@root/components';
import {ContactsProps} from '@routes/types';
import {Contact, Address} from '@root/utils/types';
import {fetchAddressFromLocation} from '@root/utils/apis';
import {emptyContact} from '@root/utils/constants';

export default function NewContact({navigation}: ContactsProps) {
  const {styles} = useStyles(getStyles);
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
    Geolocation.getCurrentPosition(
      (position: GeolocationResponse) => {
        const params = {
          long: position.coords.longitude,
          lat: position.coords.latitude,
        };
        fetchAddressFromLocation(params).then((addr: Address) => {
          const newForm = Object.assign({}, form);
          newForm.address = addr;
          setForm(newForm);
        });
      },
      (error) => {
        console.log(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
      },
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader
        leftContent={
          <NavBackBtn title="Back" onClick={() => navigation.goBack()} />
        }
        rightContent={null}
        pageTitle={'New contact'}
        toolbarCenterContent={null}
        toolbarRightContent={
          <TouchableOpacity onPress={getAddressFromCurrentLocation}>
            <AppText size={14} color={'lightPurple'} font="anSemiBold">
              Use my current location
            </AppText>
          </TouchableOpacity>
        }
      />
      <View style={styles.mainContent}>
        <View style={styles.row}>
          <View style={styles.col8}>
            <Input
              placeholder="John"
              label="First Name"
              labelStyle={styles.labelStyle}
              inputStyle={styles.input}
              onChangeText={(val) => changeForm('name_first', val)}
              value={form.name_first}
            />
          </View>
          <View style={styles.col8}>
            <Input
              placeholder="Doe"
              label="Last Name"
              labelStyle={styles.labelStyle}
              inputStyle={styles.input}
              onChangeText={(val) => changeForm('name_last', val)}
              value={form.name_last}
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col16}>
            <Input
              label="Company"
              labelStyle={styles.labelStyle}
              inputStyle={styles.input}
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
              inputStyle={styles.input}
              onChangeText={(val) => changeAddress('line1', val)}
              value={form.address.line1}
            />
          </View>
          <View style={styles.col16}>
            <Input
              placeholder="Apt4"
              inputStyle={styles.input}
              labelStyle={styles.labelStyle}
              onChangeText={(val) => changeAddress('line2', val)}
              value={form.address.line2}
            />
          </View>
          <View style={styles.col11}>
            <Input
              placeholder="Los Angeles"
              labelStyle={styles.labelStyle}
              inputStyle={styles.input}
              onChangeText={(val) => changeAddress('city', val)}
              value={form.address.city}
            />
          </View>
          <View style={styles.col2}>
            <Input
              placeholder="CA"
              labelStyle={styles.labelStyle}
              inputStyle={styles.input}
              onChangeText={(val) => changeAddress('us_state', val)}
              value={form.address.us_state}
            />
          </View>
          <View style={styles.col3}>
            <Input
              placeholder="90210"
              labelStyle={styles.labelStyle}
              inputStyle={styles.input}
              onChangeText={(val) => changeAddress('postal_code', val)}
              value={form.address.postal_code}
              keyboardType="phone-pad"
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.col8}>
            <Input
              placeholder="(888) 991-3991"
              label="PHONE (MOBILE)"
              labelStyle={styles.labelStyle}
              inputStyle={styles.input}
              onChangeText={(val) => changeForm('phone_mobile', val)}
              value={form.phone_mobile}
              textContentType="telephoneNumber"
              dataDetectorTypes="phoneNumber"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
          <View style={styles.col8}>
            <Input
              placeholder="(888) 991-3992"
              label="PHONE (OFFICE)"
              labelStyle={styles.labelStyle}
              inputStyle={styles.input}
              onChangeText={(val) => changeForm('phone_office', val)}
              value={form.phone_office}
              textContentType="telephoneNumber"
              dataDetectorTypes="phoneNumber"
              keyboardType="phone-pad"
              maxLength={15}
            />
          </View>
        </View>
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: themeStyle.scale(30),
  },
  col8: {
    width: '48%',
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
    paddingVertical: themeStyle.scale(15),
    fontSize: 18,
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
});
