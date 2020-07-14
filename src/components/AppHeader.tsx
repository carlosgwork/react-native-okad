import * as React from 'react';
import {View, Text} from 'react-native';

import {Header} from 'react-native-elements';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles, useTheme} from '@global/Hooks';

type Props = {
  leftContent?: React.ReactElement | any;
  rightContent?: React.ReactElement | any;
  toolbarLeftContent?: React.ReactElement | any;
  toolbarCenterContent?: React.ReactElement | any;
  toolbarRightContent?: React.ReactElement | any;
  pageTitle: string;
};

export default React.memo<Props>(function AppHeader(props: Props) {
  const {themeStyle} = useTheme();
  const {styles} = useStyles(getStyles);

  const defaultLeft = <View />;
  const defaultRight = <View />;
  const defaultToolbarLeft = props.pageTitle ? (
    <Text style={styles.pageTitle}>{props.pageTitle}</Text>
  ) : null;
  const defaultToolbarCenter = <View />;
  const defaultToolbarRight = <View />;

  const {
    leftContent = defaultLeft,
    rightContent = defaultRight,
    toolbarLeftContent = defaultToolbarLeft,
    toolbarCenterContent = defaultToolbarCenter,
    toolbarRightContent = defaultToolbarRight,
  } = props;

  return (
    <View style={styles.container}>
      <Header
        leftComponent={leftContent}
        rightComponent={rightContent}
        containerStyle={{
          backgroundColor: themeStyle.backgroundWhite,
        }}
      />
      <View style={styles.toolbar}>
        <View style={styles.toolbarLeft}>{toolbarLeftContent}</View>
        <View style={styles.toolbarCenter}>{toolbarCenterContent}</View>
        <View style={styles.toolbarRight}>{toolbarRightContent}</View>
      </View>
    </View>
  );
});

const getStyles = (themeStyle: StyleType) => ({
  container: {
    backgroundColor: themeStyle.backgroundWhite,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: themeStyle.scale(20),
    paddingVertical: themeStyle.scale(10),
    borderBottomWidth: 1,
    borderColor: themeStyle.gray1,
  },
  toolbarLeft: {
    marginRight: themeStyle.scale(30),
  },
  toolbarCenter: {
    flex: 1,
  },
  toolbarRight: {
    marginLeft: themeStyle.scale(20),
  },

  pageTitle: {
    ...themeStyle.getTextStyle({
      color: 'textPurple',
      font: 'anSemiBold',
      size: 40,
    }),
  },

  text: {
    ...themeStyle.getTextStyle({
      color: 'textBlack',
      font: 'anBold',
      size: 18,
    }),
  },
});
