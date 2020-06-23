import * as React from 'react'
import { Image, View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

import { Button } from 'react-native-elements'

import { useStyles } from '@global/Hooks'

import { logout } from '@redux/actions'

export default function Home() {
  const { navigate, replace } = useNavigation()
  const { styles } = useStyles(getStyles)
  const user = useSelector((state: any) => state.user)
  const [storeReady, setStoreReady] = React.useState(false)

  const onLogout = React.useCallback(() => {
    logout()

    replace('Auth')
  }, [])
  return (
    <View style={styles.container}>
      <Button
        style={{ marginTop: 100, height: 100 }}
        onPress={onLogout}
        title={'Logout'}
      />
    </View>
  )
}

const getStyles = (themeStyle) => ({
  container: {
    backgroundColor: themeStyle.white,
    flex: 1
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 16
    }),
  }
})
