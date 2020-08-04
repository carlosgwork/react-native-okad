/* eslint-disable react-hooks/exhaustive-deps */

import React, {useEffect, useMemo, useRef, Ref} from 'react';
import {Animated, BackHandler} from 'react-native';
import {State} from 'react-native-gesture-handler';
import {ThemeContext, ThemeContextType} from './Context';
import type {ThemeStyle as StyleType} from '@root/utils/styles';

export const useBackHandler = () => {
  React.useEffect(() => {
    const backListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => {
      backListener.remove();
    };
  }, []);
};

export const usePinchGesture = (reset: boolean) => {
  const baseScale = React.useRef(new Animated.Value(1));
  const pinchScale = React.useRef(new Animated.Value(1));
  const lastScale = React.useRef(1);
  const onPinchGestureEvent = Animated.event(
    [{nativeEvent: {scale: pinchScale.current}}],
    {
      useNativeDriver: true,
    },
  );
  const onPinchHandlerStateChange = React.useCallback(
    (event: any) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        lastScale.current *= event.nativeEvent.scale;
        baseScale.current.setValue(lastScale.current);
        pinchScale.current.setValue(1);
      }
    },
    [baseScale.current, lastScale.current, pinchScale.current],
  );
  React.useEffect(() => {
    if (reset) {
      baseScale.current = new Animated.Value(1);
      lastScale.current = 1;
      pinchScale.current = new Animated.Value(1);
    }
  }, [reset]);
  return {
    onPinchGestureEvent,
    onPinchHandlerStateChange,
    scale: Animated.multiply(baseScale.current, pinchScale.current),
  };
};

export const useStyles = (getStyles: GetStyles): UseStyles => {
  const {theme, themeStyle}: ThemeContextType = React.useContext(ThemeContext);
  const styles = useMemo(() => getStyles(themeStyle), [getStyles, themeStyle]);
  return {styles, theme, themeStyle};
};

export function useTheme(): ThemeContextType {
  return React.useContext(ThemeContext);
}

export const useTimingAnimation = (
  animationParams: {duration?: number; useNativeDriver: boolean},
  toggle: boolean,
) => {
  const value: Ref<any> = useRef(new Animated.Value(0));
  useEffect(() => {
    Animated.timing(value.current, {
      ...animationParams,
      toValue: toggle ? 1 : 0,
    }).start();
  }, [animationParams, toggle]);
  return value.current;
};

type GetStyles = (themeStyle: StyleType) => {[key: string]: any};
export type ThemeStyle = StyleType;
type UseStyles = {
  styles: {[key: string]: any};
  theme: string;
  themeStyle: StyleType;
};
