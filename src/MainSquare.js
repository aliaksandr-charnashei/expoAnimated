import React, { useState, useRef, useCallback } from "react";
import { StyleSheet, Dimensions, Easing } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Animated, {
  add,
  cond,
  call,
  eq,
  set,
  abs,
  block,
  lessOrEq,
} from "react-native-reanimated";

import {
  mainSquareHeight,
  smallSquareHeight,
  smallSquareIndent,
} from "./constants";

const { height, width } = Dimensions.get("window");

export default ({
  setIsInSwipeMode,
  setIsInCollisionMode,
  onDeleteSquare,
  isDeleted,
}) => {
  const [isCollided, setIsCollided] = useState(false);

  const deleteAnimation = useRef(new Animated.Value(1)).current;
  const transY = useRef(new Animated.Value(0)).current;
  const offsetY = useRef(new Animated.Value(0)).current;

  const onEnd = useCallback(() => {
    setIsInSwipeMode(false);
    onDeleteSquare();
  }, [setIsInSwipeMode, onDeleteSquare]);

  const onSwipe = useCallback(
    ([y]) => {
      setIsInSwipeMode(y > 60);
      setIsInCollisionMode(
        y >=
          height / 2 -
            (mainSquareHeight / 2 + smallSquareHeight + smallSquareIndent)
      );
      setIsCollided(
        y >=
          height / 2 -
            (mainSquareHeight / 2 + smallSquareHeight + smallSquareIndent)
      );
    },
    [setIsInSwipeMode, setIsInCollisionMode, setIsCollided]
  );

  const onGestureEvent = Animated.event([
    {
      nativeEvent: ({ translationY: y, state }) =>
        block([
          set(transY, add(y, offsetY)),
          call([abs(y)], onSwipe),
          cond(
            eq(state, State.END),
            cond(
              lessOrEq(
                abs(y),
                height / 2 -
                  (mainSquareHeight / 2 + smallSquareHeight + smallSquareIndent)
              ),
              call([set(offsetY, 0), set(transY, 0)], onEnd),
              call([set(offsetY, add(offsetY, y))], onEnd)
            )
          ),
        ]),
    },
  ]);

  Animated.useCode(() => {
    isDeleted && [
      Animated.timing(deleteAnimation, {
        duration: 500,
        toValue: 0,
        easing: Easing.linear,
      }).start(onDeleteSquare),
    ];
  }, [isDeleted]);

  // const onHandlerStateChangeY = useCallback((event) => {
  //   if (event.nativeEvent.oldState === State.ACTIVE) {
  //     lastOffsetY += event.nativeEvent.translationY;
  //     translateY.setOffset(lastOffsetY);
  //     translateY.setValue(0);
  //     if (
  //       Math.abs(lastOffsetY) <=
  //       height / 2 -
  //         (mainSquareHeight / 2 + smallSquareHeight + smallSquareIndent)
  //     ) {
  //       Animated.timing(translateY, {
  //         toValue: translateY.flattenOffset(),
  //         duration: 500,
  //         useNativeDriver: true,
  //       }).start(() => {
  //         lastOffsetY = 0;
  //         translateY.setOffset(0);
  //         translateY.setValue(0);
  //         setIsInSwipeMode(false);
  //       });
  //     } else {
  //       onDeleteSquare();
  //       setIsInSwipeMode(false);
  //     }
  //   }
  // }, []);

  return (
    <PanGestureHandler
      minDeltaY={5}
      onGestureEvent={onGestureEvent}
      onHandlerStateChange={onGestureEvent}
    >
      <Animated.View
        style={[
          styles.mainSquare,
          {
            transform: [
              { translateY: transY },
              { scale: isCollided ? 0.7 : 1 },
            ],
          },
          isDeleted && {
            transform: [
              {
                translateY: Animated.interpolate(deleteAnimation, {
                  inputRange: [0, 1],
                  outputRange: [-200, 0],
                }),
              },
            ],
          },
          {
            opacity: Animated.interpolate(deleteAnimation, {
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
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
