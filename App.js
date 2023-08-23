import { useState, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Pressable,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Box = styled.View`
  width: 200px;
  height: 200px;
  background: tomato;
`;
const AnimatedBox = Animated.createAnimatedComponent(Box);

export default function App() {
  // Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
  });

  // Animation
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -230) {
          Animated.spring(position, {
            toValue: -500,
            useNativeDriver: true,
          }).start();
        } else if (dx > 230) {
          Animated.spring(position, {
            toValue: 500,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;

  return (
    <Container>
      <AnimatedBox
        {...panResponder.panHandlers}
        style={{
          transform: [
            { scale },
            { translateX: position },
            { rotateZ: rotation },
          ],
        }}
      />
    </Container>
  );
}
