import * as types from '@redux/actions/types';
import {UserType} from '../../utils/types';

export const initialUser: UserType = {
  lastAgreementNumber: 0,
  deleted: false,
  default_sales_tax_rate: 0,
  created: new Date(),
  email: '',
  google_id: undefined,
  id: -1,
  last_modified: undefined,
  name_first: '',
  name_last: '',
  organization_id: -1,
  prefix: '',
  public_id: undefined,
  pres: undefined,
};

export const user = (state: UserType = initialUser, action: UserAction) => {
  const {payload = {}, type} = action;
  switch (type) {
    case 'clean_user':
      return initialUser;
    case 'set_user':
      return {...state, ...payload};

    case types.LOGOUT:
      return initialUser;
    default:
      return state;
  }
};

export type UserAction = {payload?: Partial<UserType>; type: string};
