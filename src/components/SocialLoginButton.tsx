import * as React from 'react';
import {
  Image,
  TouchableOpacity,
  Text,
  ImageStyle,
  ViewStyle,
} from 'react-native';
import {useTheme} from '@global/Hooks';

import {GoogleLogo} from '@assets/assets';
import {ThemeStyle} from '@root/utils/styles';

type Props = {
  provider: string;
  onPress?: () => any;
};

export default React.memo<Props>(function SocialLoginButton(props: Props) {
  const {themeStyle} = useTheme();
  const styles = React.useMemo(() => getStyles(themeStyle), [themeStyle]);
  const {provider, onPress} = props;

  let content = null;
  if (provider === 'google') {
    content = [
      <Image
        key="logo-image"
        source={GoogleLogo}
        style={styles.iconStyle as ImageStyle}
      />,
      <Text key="logo-text" style={styles.text}>
        Sign in with Google
      </Text>,
    ];
  }
  return (
    <TouchableOpacity style={styles.buttonStyle as ViewStyle} onPress={onPress}>
      {content}
    </TouchableOpacity>
  );
});

function getStyles(themeStyle: ThemeStyle) {
  return {
    buttonStyle: {
      ...themeStyle.viewCentered,
      flexDirection: 'row',
      borderRadius: themeStyle.scale(5),
      height: themeStyle.scale(50),
      width: themeStyle.scale(300),
      backgroundColor: themeStyle.backgroundWhite,
    },
    iconStyle: {
      height: themeStyle.scale(20),
      width: themeStyle.scale(20),
      resizeMode: 'contain',
      marginRight: 10,
      marginTop: -5,
    },
    text: {
      ...themeStyle.getTextStyle({
        color: 'textBlack',
        font: 'anBold',
        size: 16,
      }),
    },
  };
}
