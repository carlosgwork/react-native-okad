import * as React from 'react'
import { Image, View, Text, TouchableOpacity, TextStyleIOS } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import { useSelector } from 'react-redux'
import { setAction } from '@redux/actions'

import { Header } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient'

import type { Theme, ThemeStyle as StyleType } from '@utils/style'
import { useStyles, useTheme } from '@global/Hooks'
import { navigateHome } from '@utils/functions'
import { TextStyleInputs } from '@root/utils/styles'

type Props = TextStyleInputs & {
  children: JSX.Element,
  [key: string]: any,
}

function AppText(props: Props) {
  const { themeStyle } = useTheme()
  const { navigate } = useNavigation()
  const { styles } = useStyles(getStyles)

  const {
    color,
    font,
    size,
    children,
    style,
    ...otherProps
  } = props

  return (
    <Text
      style={[{...themeStyle.getTextStyle({ color, font, size }) }, style]}
      {...otherProps}
    >
      {children}
    </Text>
  )
}

AppText.defaultProps = {
  size: 16,
  font: 'anRegular',
  color: 'textBlack',
}

export default React.memo<Props>(AppText)

const getStyles = (themeStyle: StyleType<Theme>) => ({
  container: {
    backgroundColor: themeStyle.backgroundWhite,
    borderRadius: themeStyle.scale(40),
  },
})
