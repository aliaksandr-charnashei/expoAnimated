import React, { useCallback, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import MainSquare from "./src/MainSquare";
import SmallSquare from "./src/SmallSquare";
import { smallSquareIndent } from "./src/constants";

const { width } = Dimensions.get("window");

export default ({}) => {
  const [data, setData] = useState([1, 2, 3, 4]);
  const [isInCollisionMode, setIsInCollisionMode] = useState(false);
  const [isInSwipeMode, setIsInSwipeMode] = useState(false);
  const [isInDeleState, setIsInDeleState] = useState(false);

  const onDeleteSquare = useCallback(() => {
    setIsInDeleState(false);
    setData((data) => data.map(() => Math.random() * 10));
  }, []);

  const onDeleteButtonPress = useCallback(() => {
    setIsInDeleState(true);
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item) => item.toString()}
        snapToAlignment={"center"}
        snapToInterval={width}
        decelerationRate={"fast"}
        pagingEnabled
        renderItem={({}) => (
          <MainSquare
            setIsInSwipeMode={setIsInSwipeMode}
            setIsInCollisionMode={setIsInCollisionMode}
            isInCollisionMode={isInCollisionMode}
            onDeleteSquare={onDeleteSquare}
            isDeleted={isInDeleState}
          />
        )}
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
        <TouchableOpacity style={styles.button} onPress={onDeleteButtonPress} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    top: smallSquareIndent,
  },
  bottom: {
    bottom: smallSquareIndent,
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
