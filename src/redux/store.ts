import {createStore, combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';
import createSensitiveStorage from 'redux-persist-sensitive-storage';
import {reducers} from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';

const storage = createSensitiveStorage({
  keychainService: 'osakaiiOSKeychain',
  sharedPreferencesName: 'osakaAndroidKeychain',
  encrypt: true,
});
const config = {
  key: 'primary',
  storage,
  whitelist: ['user'],
};

const combinedReducers = combineReducers(reducers);

const persistedReducers = persistReducer(config, combinedReducers);

export default createStore(
  persistedReducers,
  composeWithDevTools(),
  // persistCombineReducers(config, reducers)
);
