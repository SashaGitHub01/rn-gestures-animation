import React, {
  PropsWithChildren,
  useCallback,
  useImperativeHandle,
} from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const WINDOW = Dimensions.get("window");

interface BottomSheetProps {}

export type BottomSheetRefProps = {
  scrollTo: (destination: number) => void;
  isActive: () => boolean;
};

const MAX_TRANSLATE_Y = -WINDOW.height + 50;

const BottomSheet = React.forwardRef<BottomSheetRefProps, BottomSheetProps>(
  ({ children }, ref) => {
    const y = useSharedValue(0);
    const active = useSharedValue(false);
    const context = useSharedValue({ y: 0 });

    const scrollTo = useCallback((destination: number) => {
      "worklet";
      active.value = destination !== 0;
      y.value = withSpring(destination, { damping: 50 });
    }, []);

    const isActive = useCallback(() => {
      return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [
      scrollTo,
      isActive,
    ]);

    const gesture = Gesture.Pan()
      .onStart(() => {
        context.value = { y: y.value };
      })
      .onUpdate((e) => {
        y.value = context.value.y + e.translationY;
      })
      .onEnd((e) => {
        if (y.value > -WINDOW.height / 2) {
          scrollTo(0);
        } else {
          scrollTo(MAX_TRANSLATE_Y);
        }
      });

    const animatedStyles = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: y.value }],
        borderRadius: interpolate(
          y.value,
          [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
          [25, 0],
          Extrapolation.CLAMP
        ),
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.wrapper, animatedStyles]}>
          <View style={styles.line} />
        </Animated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    height: WINDOW.height,
    left: 0,
    top: WINDOW.height,
    backgroundColor: "white",
    width: "100%",
  },

  line: {
    marginVertical: 15,
    alignSelf: "center",
    width: 150,
    backgroundColor: "gray",
    height: 5,
    borderRadius: 3,
  },
});

export default BottomSheet;
