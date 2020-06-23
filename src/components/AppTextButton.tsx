import * as React from 'react'
import { Image, View, Text, TouchableOpacity, ViewStyle } from 'react-native'
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
  onPress?: () => any,
  children: React.ReactElement,
  style: ViewStyle
}

export default React.memo<Props>(function AppGradButton(props: Props) {
  const { themeStyle } = useTheme()
  const { navigate } = useNavigation()
  const { styles } = useStyles(getStyles)

  const {
    leftIconContent = null,
    onPress,
    children,
    style: extendStyles
  } = props

  return (
    <TouchableOpacity style={[styles.container, extendStyles]} onPress={onPress}>
      { leftIconContent && <View style={styles.iconCont}>
          { leftIconContent }
        </View>
      }
      {children}
    </TouchableOpacity>
  )
})

const getStyles = (themeStyle: StyleType<Theme>) => ({
  container: {
  },
  iconCont: {
    marginRight: themeStyle.scale(10),
  },
})
