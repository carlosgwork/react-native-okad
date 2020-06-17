import * as React from 'react'
import { Image, View, Text, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { setAction } from '@redux/actions'

import { Header } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'

import type { Theme, ThemeStyle as StyleType } from '@utils/style'
import { useStyles, useTheme } from '@global/Hooks'
import { navigateHome } from '@utils/functions'

type Props = {
  leftIconContent?: React.ReactElement,
  title: string,
  onPress?: () => any,
}

export default React.memo<Props>(function AppGradButton(props: Props) {
  const { themeStyle } = useTheme()
  const { navigate } = useNavigation()
  const { styles } = useStyles(getStyles)

  const {
    leftIconContent = null,
    onPress,
    title,
  } = props

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <LinearGradient
        style={styles.btn}
        start={{ x: 0.0, y: 0.0 }} end={{x: 1.0, y: 0.0}}
        locations={[0.7, 0.3]}
        colors={[themeStyle.purple, themeStyle.lightPurple]}
      >
        <View style={styles.iconCont}>
          { leftIconContent }
        </View>
        <Text style={styles.text}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
})

const getStyles = (themeStyle: StyleType<Theme>) => ({
  container: {
    backgroundColor: themeStyle.backgroundWhite,
    borderRadius: themeStyle.scale(40),
  },
  btn: {
    flexDirection: 'row',
    paddingLeft: themeStyle.scale(10),
    paddingRight: themeStyle.scale(30),
    paddingVertical: themeStyle.scale(10),
    borderRadius: themeStyle.scale(20),
    ...themeStyle.centerAll,
  },
  iconCont: {
    marginRight: themeStyle.scale(10),
  },
  text: {
    ...themeStyle.getTextStyle({
      color: 'textWhite',
      font: 'anBold',
      size: 16
    }),
    alignSelf: 'flex-end'
  }
})
