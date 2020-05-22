import React from "react";
import { Animated, StyleSheet } from "react-native";
import { smallSquareHeight } from "./constants";

export default ({ isInSwipeMode, style, isInCollisionMode }) => {
  return (
    <Animated.View
      style={[
        styles.smallSquare,
        { opacity: isInSwipeMode ? 1 : 0 },
        isInCollisionMode && {
          transform: [{ scale: 1.2 }],
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
