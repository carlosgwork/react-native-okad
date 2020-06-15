import { createStore, combineReducers } from 'redux'
import { persistCombineReducers, persistReducer } from 'redux-persist'
import createSensitiveStorage from 'redux-persist-sensitive-storage'
import { reducers } from './reducers'

const storage = createSensitiveStorage({
  keychainService: 'osakaiiOSKeychain',
  sharedPreferencesName: 'osakaAndroidKeychain',
  encrypt: true
});
const config = {
  key: 'primary',
  storage,
  whitelist: []
};

const combinedReducers = combineReducers(reducers);

const persistedReducers = persistReducer(config, combinedReducers);

export default createStore(
  persistedReducers
  // persistCombineReducers(config, reducers)
);
