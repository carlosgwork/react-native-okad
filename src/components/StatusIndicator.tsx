import * as React from 'react';
import {View, Image} from 'react-native';
import {useStyles} from '@global/Hooks';

import AppText from './AppText';
import {
  StatusOpenIcon,
  StatusUpIcon,
  StatusEyeIcon,
  StatusTickIcon,
} from '@root/assets/assets';

type Props = {
  status: string;
};

function StatusIndicator(props: Props) {
  const {status} = props;
  const {styles} = useStyles(getStyles);

  return (
    <>
      {status === 'open' && (
        <View style={styles.statusSymbol}>
          <AppText
            size={14}
            color={'textBlue'}
            font={'anSemiBold'}
            style={styles.statusText}>
            OPEN
          </AppText>
          <Image source={StatusOpenIcon} style={styles.symbolIcon} />
        </View>
      )}
      {status === 'sent' && (
        <View style={styles.statusSymbol}>
          <AppText
            size={14}
            color={'lightBlueColor'}
            font={'anSemiBold'}
            style={styles.statusText}>
            SENT
          </AppText>
          <Image source={StatusUpIcon} style={styles.symbolIcon} />
        </View>
      )}
      {status === 'viewed' && (
        <View style={styles.statusSymbol}>
          <AppText
            size={14}
            color={'lightBlueColor'}
            font={'anSemiBold'}
            style={styles.statusText}>
            VIEWED
          </AppText>
          <Image
            source={StatusEyeIcon}
            style={[styles.symbolIcon, styles.symbolEyeIcon]}
          />
        </View>
      )}
      {status === 'accepted' && (
        <View style={styles.statusSymbol}>
          <AppText
            size={14}
            color={'lightGreenColor'}
            font={'anSemiBold'}
            style={styles.statusText}>
            ACCEPTED
          </AppText>
          <Image source={StatusTickIcon} style={styles.symbolIcon} />
        </View>
      )}
    </>
  );
}

export default React.memo<Props>(StatusIndicator);

const getStyles = () => ({
  statusSymbol: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    height: 40,
  },
  iconStyle: {
    marginRight: -5,
    marginTop: 2,
  },
  statusText: {
    marginTop: 1,
    marginRight: 5,
  },
  symbolIcon: {
    marginBottom: 2,
    width: 16,
    resizeMode: 'contain',
  },
  symbolEyeIcon: {
    width: 20,
    height: 16,
  },
});
