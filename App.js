import React, { useCallback } from "react";
import { Animated, StyleSheet, View, TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import MainSquare from "./src/MainSquare";
import SmallSquare from "./src/SmallSquare";
import { useState } from "react";

export default ({}) => {
  const [data, setData] = useState([1, 2, 3, 4]);
  const [isInCollisionMode, setIsInCollisionMode] = useState(false);
  const [isInSwipeMode, setIsInSwipeMode] = useState(false);

  const onDeleteSquare = useCallback((index) => {
    setData((data) => [...data.slice(0, index), ...data.slice(index + 1)]);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        horizontal
        data={data}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item, index }) => (
          <MainSquare
            setIsInSwipeMode={setIsInSwipeMode}
            setIsInCollisionMode={setIsInCollisionMode}
            isLast={item === 4}
            index={index}
            item={item}
            isInCollisionMode={isInCollisionMode}
            onDeleteSquare={onDeleteSquare}
          />
        )}
      />
      <Animated.View
        style={[
          styles.smallSquare,
          styles.top,
          { opacity: isInSwipeMode ? 1 : 0 },
          isInCollisionMode && {
            transform: [{ scale: 1.2 }],
          },
        ]}
      />
      <SmallSquare
        style={styles.top}
        isInSwipeMode={isInSwipeMode}
        isInCollisionMode={isInCollisionMode}
      />
      <SmallSquare
        style={styles.bottom}
        isInSwipeMode={isInSwipeMode}
        isInCollisionMode={isInCollisionMode}
      />
      <Animated.View
        style={[styles.bottomContainer, { opacity: !isInSwipeMode ? 1 : 0 }]}
      >
        <TouchableOpacity style={styles.button} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  flatList: {
    flex: 1,
    paddingLeft: 75,
  },
  top: {
    top: 20,
  },
  bottom: {
    bottom: 20,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    backgroundColor: "deepskyblue",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "darkviolet",
  },
});
