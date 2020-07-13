import * as types from '@redux/actions/types';
import {UserType} from '../../utils/types';

export const initialUser: UserType = {
  name: '',
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
