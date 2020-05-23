import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { smallSquareHeight } from "./constants";

export default ({ isInSwipeMode, style, isInCollisionMode }) => {
  return (
    <Animated.View
      style={[
        styles.smallSquare,
        { opacity: isInSwipeMode ? 1 : 0 },
        {
          transform: [{ scale: isInCollisionMode ? 1.2 : 1 }],
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  smallSquare: {
    position: "absolute",
    width: smallSquareHeight,
    height: smallSquareHeight,
    alignSelf: "center",
    backgroundColor: "deepskyblue",
  },
});
