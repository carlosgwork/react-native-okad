//@flow

import React, { useEffect, useState } from 'react'
import { Text, Image, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useStyles } from '@global/Hooks'
import type { Theme, ThemeStyle as StyleType } from '@utils/style'
import { Logo } from '@assets/assets'

type Props = {}

export default React.memo<Props>(function Loading() {
  const { styles } = useStyles(getStyles)
  const loading = useSelector((state: any) => state.loading)

  if (!loading) {
    return null
  }
  return (
    <View style={styles.main}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.byline}>Loading...</Text>
    </View>
  )
})

const getStyles = (themeStyle: StyleType<Theme>) => ({
  main: {
    position: 'absolute',
    backgroundColor: '#fff',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 9999999
  },
  logo: {
    width: themeStyle.window.width * 0.6,
  },
})
