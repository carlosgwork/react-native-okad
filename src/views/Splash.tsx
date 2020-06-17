import * as React from 'react'
import { Image, View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { persistStore } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'
import { useNavigation } from '@react-navigation/native'

import { navigateHome } from '@utils/functions'
import { useStyles } from '@global/Hooks'
import store from '@redux/store'
import { cleanAction } from '@redux/actions'

import { Logo } from '@assets/assets'
// const Logo = require('../assets/images/gamburd-logo.png')

const loadStore = async (setStoreReady: (boolean) => any) => {
  let persist = true
  try {
    let newInstallCheck = await AsyncStorage.getItem('loadStore')
    if (newInstallCheck == null) {
      persist = false
    }
  } catch (e) {
    persist = false
  }
  let persistor = persistStore(store, { manualPersist: true }, async () => {
    await AsyncStorage.setItem('loadStore', 'yes')
    setStoreReady(true)
  })
  if (!persist) {
    await persistor.purge()
    persistor.persist()
  } else {
    persistor.persist()
  }
}

export default function Splash() {
  const { replace } = useNavigation()
  const { styles } = useStyles(getStyles)
  const user = useSelector((state: any) => state.user)
  const [storeReady, setStoreReady] = React.useState(false)
  React.useEffect(() => {
    loadStore(setStoreReady)
  }, [])
  React.useEffect(() => {
    cleanAction('loading')
    if (storeReady) {
      if (user && user.name) {
        navigateHome(replace)
      } else {
        replace('Auth')
      }
    }
  }, [storeReady, user])
  
  return (
    <View style={styles.content}>
      <Image source={Logo} style={styles.logo} />
    </View>
  )
}

const getStyles = (themeStyle) => ({
  content: {
    ...themeStyle.viewCentered,
    backgroundColor: themeStyle.white,
    flex: 1
  },
  logo: {
    height: 200,
    width: 400,
    resizeMode: 'stretch',
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 16
    }),
  }
})
