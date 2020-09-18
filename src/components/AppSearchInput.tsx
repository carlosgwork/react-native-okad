import React, {useState} from 'react';
import {View} from 'react-native';
import {Input, Icon} from 'react-native-elements';

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
  const [isFocus, setIsFocus] = useState<boolean>(false);

  const {value, placeholderText = 'Search', onChange} = props;
  return (
    <View>
      <Input
        placeholder={placeholderText}
        leftIcon={
          <Icon
            type="ionicon"
            name="ios-search"
            color={themeStyle.textGray}
            size={themeStyle.scale(22)}
            style={styles.leftIconStyle}
          />
        }
        rightIcon={
          isFocus ? (
            <Icon
              type="ionicon"
              name="close-circle"
              color={themeStyle.textGray}
              size={themeStyle.scale(25)}
              style={styles.rightCloseIcon}
              onPress={() => {
                setIsFocus(false);
                onChange && onChange('');
              }}
            />
          ) : (
            <Icon
              type="font-awesome"
              name="microphone"
              color={themeStyle.textGray}
              size={themeStyle.scale(20)}
              style={styles.rightIconStyle}
            />
          )
        }
        containerStyle={styles.container}
        inputContainerStyle={styles.inputContainer}
        inputStyle={styles.input}
        placeholderTextColor={themeStyle.textGray}
        onChangeText={onChange}
        numberOfLines={1}
        value={value}
        errorStyle={styles.error}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
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
  leftIconStyle: {
    marginLeft: 5,
    marginTop: 2,
  },
  rightIconStyle: {
    marginRight: 5,
  },
  rightCloseIcon: {
    marginLeft: 1,
    marginTop: 2,
  },
});
