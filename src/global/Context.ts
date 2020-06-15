
import React from 'react'
import { Theme, ThemeStyle } from '@utils/styles'

export type ThemeContextType = {
  // setTheme: Theme => any,
  setTheme: any,
  theme: Theme,
  themeStyle: ThemeStyle<Theme>
}

export const ThemeContext = React.createContext<ThemeContextType>({})
