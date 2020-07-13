import * as React from 'react';
import {Text} from 'react-native';

import type {TextStyleInputs} from '@root/utils/styles';
import {useTheme} from '@global/Hooks';

type Props = Partial<
  TextStyleInputs & {
    children: JSX.Element | string | undefined;
    [key: string]: any;
  }
>;

function AppText(props: Props) {
  const {themeStyle} = useTheme();

  const {
    color = 'textBlack',
    font = 'anRegular',
    size = 16,
    children,
    style,
    ...otherProps
  } = props;

  return (
    <Text
      style={[{...themeStyle.getTextStyle({color, font, size})}, style]}
      {...otherProps}>
      {children}
    </Text>
  );
}

export default React.memo<Props>(AppText);
