import React, { useState, useRef, useCallback } from "react";
import { Animated, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

import {
  mainSquareHeight,
  smallSquareHeight,
  smallSquareIndent,
} from "./constants";
import { useEffect } from "react";

const { height, width } = Dimensions.get("window");

export default ({
  setIsInSwipeMode,
  setIsInCollisionMode,
  onDeleteSquare,
  isDeleted,
}) => {
  const [isCollided, setIsCollided] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;
  const deleteAnimation = useRef(new Animated.Value(1)).current;
  let lastOffsetY = useRef(0).current;

  useEffect(() => {
    if (isDeleted) {
      Animated.timing(deleteAnimation, {
        duration: 500,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => onDeleteSquare());
    }
  }, [isDeleted]);

  const onGestureEventY = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    {
      useNativeDriver: true,
      listener: ({ nativeEvent }) => {
        setIsInSwipeMode(Math.abs(nativeEvent.translationY) > 100);
        setIsInCollisionMode(
          Math.abs(nativeEvent.translationY) >=
            height / 2 -
              (mainSquareHeight / 2 + smallSquareHeight + smallSquareIndent)
        );
        setIsCollided(
          Math.abs(nativeEvent.translationY) >=
            height / 2 -
              (mainSquareHeight / 2 + smallSquareHeight + smallSquareIndent)
        );
      },
    }
  );

  const onHandlerStateChangeY = useCallback((event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastOffsetY += event.nativeEvent.translationY;
      translateY.setOffset(lastOffsetY);
      translateY.setValue(0);
      if (
        Math.abs(lastOffsetY) <=
        height / 2 -
          (mainSquareHeight / 2 + smallSquareHeight + smallSquareIndent)
      ) {
        Animated.timing(translateY, {
          toValue: translateY.flattenOffset(),
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          lastOffsetY = 0;
          translateY.setOffset(0);
          translateY.setValue(0);
          setIsInSwipeMode(false);
        });
      } else {
        onDeleteSquare();
        setIsInSwipeMode(false);
      }
    }
  }, []);

  return (
    <PanGestureHandler
      minDeltaY={5}
      onGestureEvent={onGestureEventY}
      onHandlerStateChange={onHandlerStateChangeY}
    >
      <Animated.View
        style={[
          styles.mainSquare,
          {
            transform: [
              { translateY: translateY },
              { scale: isCollided ? 0.7 : 1 },
            ],
          },
          isDeleted && {
            transform: [
              {
                translateY: deleteAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-200, 0],
                }),
              },
            ],
          },
          { opacity: deleteAnimation },
        ]}
      />
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  mainSquare: {
    width: width - 20,
    height: mainSquareHeight,
    backgroundColor: "yellow",
    margin: 10,
    alignSelf: "center",
  },
});
