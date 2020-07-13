import * as React from 'react';

import {Input} from 'react-native-elements';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';

type Props = {
  value: string | undefined;
  onChange?: (text: string) => void;
};

export default React.memo<Props>(function AppSearchInput(props: Props) {
  const {themeStyle} = useTheme();
  const {styles} = useStyles(getStyles);

  const {value, onChange} = props;

  return (
    <Input
      placeholder="Search"
      leftIcon={{
        type: 'ionicon',
        name: 'ios-search',
        color: themeStyle.textGray,
        size: themeStyle.scale(20),
      }}
      rightIcon={{
        type: 'ionicon',
        name: 'ios-mic',
        color: themeStyle.textGray,
        size: themeStyle.scale(20),
      }}
      containerStyle={styles.container}
      inputContainerStyle={styles.inputContainer}
      inputStyle={styles.input}
      onChangeText={onChange}
      value={value}
      errorStyle={styles.error}
    />
  );
});

const getStyles = (themeStyle: StyleType) => ({
  container: {
    paddingHorizontal: 0,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: themeStyle.scale(40),
    paddingHorizontal: 10,
    minWidth: 200,
    height: 35,
  },
  input: {
    padding: 0,
    ...themeStyle.getTextStyle({
      color: 'textGray',
      font: 'anRegular',
      size: 14,
    }),
  },
  error: {
    height: 0,
    padding: 0,
    margin: 0,
  },
});
