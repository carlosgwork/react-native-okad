import * as React from 'react'
import { Image, View, Text } from 'react-native'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'
import { useStyles } from '@global/Hooks'

export default function Home() {
  const { navigate } = useNavigation()
  const { styles } = useStyles(getStyles)
  const user = useSelector((state: any) => state.user)
  const [storeReady, setStoreReady] = React.useState(false)

  return (
    <View style={styles.container}>
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
