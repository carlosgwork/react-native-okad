import {encode as btoa} from 'base-64';
import queryString from 'query-string';
import {GeolocationParams, Address} from '@utils/types';
import {API_USER, API_PASS} from '@utils/constants';
import {Alert} from 'react-native';

const BasicAuthHeader = {
  'Content-Type': 'application/json',
  Authorization: `Basic ${btoa(`${API_USER}:${API_PASS}`)}`,
};

export const fetchAddressFromLocation = async (
  params: GeolocationParams,
): Address =>
  fetch(
    `https://gamburd-kyoto.herokuapp.com/v1/addresses/_by-coords?${queryString.stringify(
      params,
    )}`,
    {
      method: 'GET',
      headers: BasicAuthHeader,
    },
  )
    .then((response) => response.json())
    .then((result) => {
      const {city, line_1, state, zip} = result.data;
      const addr: Address = {
        city: city,
        line1: line_1,
        us_state: state,
        postal_code: zip,
      };
      return addr;
    })
    .catch((error) => {
      console.error('Error:', error);
      Alert.alert(error);
    });
