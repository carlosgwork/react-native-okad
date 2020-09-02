import * as React from 'react';
import {View} from 'react-native';
import {Input} from 'react-native-elements';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';

type Props = {
  value: string | undefined;
  placeholderText?: string;
  onChange?: (text: string) => void;
};

export default React.memo<Props>(function AppSearchInput(props: Props) {
  const {themeStyle} = useTheme();
  const {styles} = useStyles(getStyles);

  const {value, placeholderText = 'Search', onChange} = props;

  return (
    <View style={styles.container}>
      <Input
        placeholder={placeholderText}
        leftIcon={{
          type: 'ionicon',
          name: 'ios-search',
          color: themeStyle.textGray,
          size: themeStyle.scale(22),
          style: {marginLeft: 5, marginTop: 2},
        }}
        rightIcon={{
          type: 'font-awesome',
          name: 'microphone',
          color: themeStyle.textGray,
          size: themeStyle.scale(20),
          style: {marginRight: 5},
        }}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        placeholderTextColor={themeStyle.textGray}
        onChangeText={onChange}
        numberOfLines={1}
        value={value}
        errorStyle={styles.error}
      />
    </View>
  );
});

const getStyles = (themeStyle: StyleType) => ({
  container: {
    paddingHorizontal: 0,
    width: 300,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: themeStyle.scale(40),
    minWidth: 200,
    height: 35,
  },
  input: {
    padding: 0,
    paddingHorizontal: 3,
    color: themeStyle.textBlack,
    fontSize: 14,
    fontFamily: 'Metropolis-Medium',
  },
  error: {
    height: 0,
    padding: 0,
    margin: 0,
  },
});
