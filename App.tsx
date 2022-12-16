import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  RectButton,
} from "react-native-gesture-handler";
import BottomSheet, { BottomSheetRefProps } from "./components/BottomSheet";
import { useSharedValue } from "react-native-reanimated";
import { useCallback, useRef } from "react";

export default function App() {
  const ref = useRef<BottomSheetRefProps>(null)

  const onPress = useCallback(() => {
    const isActive = ref?.current?.isActive();

    if (isActive) {
      ref?.current?.scrollTo(0);
    } else {
      ref?.current?.scrollTo(-200);
    }
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <RectButton rippleColor={"#36ccd1"} style={styles.btn} onPress={onPress}>
        <Text>Press me!</Text>
      </RectButton>
      <BottomSheet ref={ref} />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bdbdbd",
    alignItems: "center",
    justifyContent: "center",
  },

  btn: {
    backgroundColor: "#ffffff6f",
    padding: 20,
    borderRadius: 1000,
  },
});
