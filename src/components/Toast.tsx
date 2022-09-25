//@flow

import * as React from 'react'
import { useSelector } from 'react-redux'
import { Text, View } from 'react-native'
import { useTheme } from '@global/Hooks'
import type { Theme, ThemeStyle as StyleType } from '@utils/style'
import { cleanAction } from '@redux/actions'
import { ReduxState } from '@redux/reducers'

export default function Toast() {
  const toast = useSelector((state: ReduxState) => state.toast)
  const { themeStyle } = useTheme()
  const styles = React.useMemo(() => getStyles(themeStyle), [themeStyle])
  const { text, type } = toast
  React.useEffect(() => {
    if (text != '') {
      setTimeout(() => cleanAction('toast'), 3000)
    }
  }, [text])
  if (text == '') {
    return null
  }
  return (
    <View
      style={[styles.toastView, type == 'success' && { backgroundColor: themeStyle.lightBlue }]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

function getStyles(themeStyle: StyleType<Theme>) {
  return {
    toastView: {
      ...themeStyle.viewCentered,
      alignSelf: 'center',
      elevation: 999999999,
      position: 'absolute',
      bottom: themeStyle.scale(40),
      backgroundColor: themeStyle.orange,
      borderRadius: themeStyle.scale(5),
      paddingHorizontal: themeStyle.scale(20),
      paddingVertical: themeStyle.scale(10),
      minHeight: themeStyle.scale(40),
      maxWidth: themeStyle.window.width - themeStyle.scale(40),
      zIndex: 99999999
    },
    text: themeStyle.getTextStyle({ color: 'textWhite', font: 'osSemiBold', size: 14 })
  }
}
