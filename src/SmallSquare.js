import React from "react";
import { Animated, StyleSheet } from "react-native";

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
    width: 50,
    height: 50,
    alignSelf: "center",
    backgroundColor: "deepskyblue",
  },
});
