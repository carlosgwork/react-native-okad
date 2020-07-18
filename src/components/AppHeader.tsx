import * as React from 'react';
import {View, Text} from 'react-native';

import {Header} from 'react-native-elements';

import type {ThemeStyle as StyleType} from '@root/utils/styles';
import {useStyles} from '@global/Hooks';

type Props = {
  leftContent?: React.ReactElement | any;
  rightContent?: React.ReactElement | any;
  toolbarLeftContent?: React.ReactElement | any;
  toolbarCenterContent?: React.ReactElement | any;
  toolbarRightContent?: React.ReactElement | any;
  pageTitle: string;
};

export default React.memo<Props>(function AppHeader(props: Props) {
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
    <View>
      <Header
        leftComponent={<View style={styles.topContainer}>{leftContent}</View>}
        rightComponent={<View style={styles.topContainer}>{rightContent}</View>}
        containerStyle={styles.headerTopContainer}
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
  headerTopContainer: {
    backgroundColor: themeStyle.backgroundWhite,
    borderBottomWidth: 0,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: themeStyle.scale(20),
    paddingVertical: themeStyle.scale(10),
    borderBottomWidth: 1,
    borderColor: themeStyle.gray1,
  },
  topContainer: {
    paddingVertical: themeStyle.scale(20),
    paddingRight: themeStyle.scale(10),
  },
  toolbarLeft: {
    flex: 1,
    marginRight: themeStyle.scale(30),
  },
  toolbarCenter: {
    flex: 1,
  },
  toolbarRight: {
    flex: 1,
    marginLeft: themeStyle.scale(30),
    alignItems: 'flex-end',
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
