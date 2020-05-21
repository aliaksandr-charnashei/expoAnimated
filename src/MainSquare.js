import React, { useState, useRef, useCallback } from "react";
import { Animated, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const { height } = Dimensions.get("window");

export default ({
  item,
  setIsInSwipeMode,
  setIsInCollisionMode,
  onDeleteSquare,
  isLast,
  index,
}) => {
  const [isInDeleteState, setIsInDeleteState] = useState(false);
  const [isCollided, setIsCollided] = useState(false);

  const translateY = useRef(new Animated.Value(0)).current;
  const animatedDelete = useRef(new Animated.Value(1)).current;
  let lastOffsetY = useRef(0).current;

  const onGestureEventY = useCallback(({ nativeEvent }) => {
    translateY.setValue(nativeEvent.translationY);
    setIsInSwipeMode(Math.abs(nativeEvent.translationY) > 100);
    setIsInCollisionMode(
      Math.abs(nativeEvent.translationY) >= height / 2 - 170
    );
    setIsCollided(Math.abs(nativeEvent.translationY) >= height / 2 - 170);
  }, []);

  const onHandlerStateChangeY = useCallback(
    (event) => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        lastOffsetY += event.nativeEvent.translationY;
        translateY.setOffset(lastOffsetY);
        translateY.setValue(0);
        if (Math.abs(lastOffsetY) <= height / 2 - 70 - 100) {
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
          onDeleteSquare(index);
          setIsInSwipeMode(false);
        }
      }
    },
    [index]
  );

  const onDelete = useCallback(() => {
    setIsInDeleteState(true);
    Animated.timing(animatedDelete, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setIsInDeleteState(false);
      animatedDelete.setValue(1);
    });
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
          { backgroundColor: colorScheme[item] },
          {
            transform: [
              { translateY: translateY },
              { scale: isCollided ? 0.8 : 1 },
            ],
          },
          isInDeleteState && {
            transform: [
              {
                translateY: animatedDelete.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-200, 0],
                }),
              },
            ],
          },
          { opacity: animatedDelete },
          isLast && { marginRight: 170 },
        ]}
      />
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  mainSquare: {
    width: 200,
    height: 200,
    margin: 10,
    alignSelf: "center",
  },
});

const colorScheme = {
  1: "yellow",
  2: "blue",
  3: "green",
  4: "red",
};
