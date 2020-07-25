import React from 'react';
import {Theme, ThemeStyle} from '@root/utils/styles';

export type ThemeContextType = {
  // setTheme: Theme => any,
  setTheme: any;
  theme: Theme;
  themeStyle: ThemeStyle;
};

export const ThemeContext = React.createContext<ThemeContextType>({
  setTheme: () => {},
  theme: 'normal',
  themeStyle: {},
});
