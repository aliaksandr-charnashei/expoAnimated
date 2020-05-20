import React, { Component } from "react";
import { Animated, StyleSheet, View, TouchableOpacity } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const inputRange = [-101, -100, 0, 100, 101];

export default class DraggableBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isInDeleteState: false,
    };
    this._translateY = new Animated.Value(0);
    this._animatedDelete = new Animated.Value(1);
    this._lastOffset = { y: 0 };

    this._onGestureEventY = Animated.event(
      [
        {
          nativeEvent: {
            translationY: this._translateY,
          },
        },
      ],
      { useNativeDriver: true }
    );
  }

  _onHandlerStateChangeY = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.y += event.nativeEvent.translationY;
      this._translateY.setOffset(this._lastOffset.y);
      this._translateY.setValue(0);
    }
  };

  onDelete = () => {
    this.setState({ isInDeleteState: true }, () => {
      Animated.timing(this._animatedDelete, {
        toValue: 0,
        duration: 2000,
      }).start();
    });
  };

  render() {
    return (
      <View style={styles.scrollView}>
        <PanGestureHandler
          {...this.props}
          onGestureEvent={this._onGestureEventY}
          onHandlerStateChange={this._onHandlerStateChangeY}
        >
          <Animated.View
            style={[
              styles.mainSquare,
              {
                transform: [{ translateY: this._translateY }],
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
            ]}
          />
        </PanGestureHandler>
        <Animated.View
          style={[
            styles.smallSquare,
            styles.top,
            {
              opacity: this._translateY.interpolate({
                inputRange,
                outputRange: [1, 0, 0, 0, 1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.smallSquare,
            styles.bottom,
            {
              opacity: this._translateY.interpolate({
                inputRange,
                outputRange: [1, 0, 0, 0, 1],
              }),
            },
          ]}
        />
        <Animated.View
          style={[
            styles.bottomContainer,
            {
              opacity: this._translateY.interpolate({
                inputRange,
                outputRange: [0, 0, 1, 0, 0],
              }),
            },
          ]}
        >
          <TouchableOpacity onPress={this.onDelete} style={styles.button} />
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    justifyContent: "center",
  },
  mainSquare: {
    width: 150,
    height: 150,
    position: "absolute",
    alignSelf: "center",
    backgroundColor: "yellow",
    margin: 10,
  },
  smallSquare: {
    position: "absolute",
    width: 50,
    height: 50,
    alignSelf: "center",
    backgroundColor: "deepskyblue",
    margin: 10,
  },
  top: {
    top: 10,
  },
  bottom: {
    bottom: 10,
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
