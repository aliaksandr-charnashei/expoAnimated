import React, { Component } from "react";
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";

import ListItem from "./src/ListItem";

export default class DraggableBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInDeleteState: false,
      isCollided: false,
      isInSwipeMode: false,
      isInCollisionMode: false,
    };
    this._translateY = new Animated.Value(0);
    this._animatedDelete = new Animated.Value(1);
    this._lastOffset = { y: 0 };
  }

  setIsInSwipeMode = (isInSwipeMode) => {
    this.setState({ isInSwipeMode });
  };

  setIsInCollisionMode = (isInCollisionMode) => {
    this.setState({ isInCollisionMode });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatList}
          horizontal
          data={[1, 2, 3, 4]}
          keyExtractor={(item) => item.toString()}
          renderItem={({ item }) => (
            <ListItem
              setIsInSwipeMode={this.setIsInSwipeMode}
              setIsInCollisionMode={this.setIsInCollisionMode}
              isLast={item === 4}
              isInCollisionMode={this.state.isInCollisionMode}
            />
          )}
        />
        <Animated.View
          style={[
            styles.smallSquare,
            styles.top,
            { opacity: this.state.isInSwipeMode },
            this.state.isInCollisionMode && {
              transform: [{ scale: 1.2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.smallSquare,
            styles.bottom,
            { opacity: this.state.isInSwipeMode },
            this.state.isInCollisionMode && {
              transform: [{ scale: 1.2 }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.bottomContainer,
            { opacity: !this.state.isInSwipeMode },
          ]}
        >
          <TouchableOpacity onPress={this.onDelete} style={styles.button} />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  flatList: {
    flex: 1,
    paddingLeft: 75,
  },
  smallSquare: {
    position: "absolute",
    width: 50,
    height: 50,
    alignSelf: "center",
    backgroundColor: "deepskyblue",
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
