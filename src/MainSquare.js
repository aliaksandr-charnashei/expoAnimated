import React, { Component } from "react";
import { Animated, StyleSheet, Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const { height } = Dimensions.get("window");

export default class MainSquare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInDeleteState: false,
      isCollided: false,
    };
    this._translateY = new Animated.Value(0);
    this._animatedDelete = new Animated.Value(1);
    this._lastOffset = { y: 0 };
  }

  _onGestureEventY = ({ nativeEvent }) => {
    this._translateY.setValue(nativeEvent.translationY);
    this.props.setIsInSwipeMode(Math.abs(nativeEvent.translationY) > 100);
    this.props.setIsInCollisionMode(
      Math.abs(nativeEvent.translationY) >= height / 2 - 170
    );
    this.setState({
      isCollided: Math.abs(nativeEvent.translationY) >= height / 2 - 170,
    });
  };

  _onHandlerStateChangeY = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
      if (Math.abs(this._lastOffset.y) <= height / 2 - 70 - 100) {
        Animated.timing(this._translateY, {
          toValue: this._translateY.flattenOffset(),
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          this._lastOffset.y = 0;
          this._translateY.setOffset(0);
          this._translateY.setValue(0);
          this.props.setIsInSwipeMode(false);
        });
      } else {
        this.props.onDeleteSquare(this.props.index);
      }
    }
  };

  onDelete = () => {
    this.setState({ isInDeleteState: true }, () => {
      Animated.timing(this._animatedDelete, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        this.setState({ isInDeleteState: false }, () =>
          this._animatedDelete.setValue(1)
        );
      });
    });
  };

  render() {
    return (
      <PanGestureHandler
        minDeltaY={5}
        onGestureEvent={this._onGestureEventY}
        onHandlerStateChange={this._onHandlerStateChangeY}
      >
        <Animated.View
          style={[
            styles.mainSquare,
            { backgroundColor: colorScheme[this.props.item] },
            {
              transform: [
                { translateY: this._translateY },
                { scale: this.state.isCollided ? 0.8 : 1 },
              ],
            },
            this.state.isInDeleteState && {
              transform: [
                {
                  translateY: this._animatedDelete.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-200, 0],
                  }),
                },
              ],
            },
            { opacity: this._animatedDelete },
            this.props.isLast && { marginRight: 170 },
          ]}
        />
      </PanGestureHandler>
    );
  }
}

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
