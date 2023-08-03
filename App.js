import { useState, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function App() {
  const [up, setUp] = useState(false);
  const position = useRef(
    new Animated.ValueXY({
      x: -SCREEN_WIDTH / 2 + 100,
      y: -SCREEN_HEIGHT / 2 + 100,
    })
  ).current;
  const topLeft = Animated.timing(position, {
    toValue: { x: -SCREEN_WIDTH / 2 + 100, y: -SCREEN_HEIGHT / 2 + 100 },
    useNativeDriver: false,
  });
  const bottomLeft = Animated.timing(position, {
    toValue: { x: -SCREEN_WIDTH / 2 + 100, y: SCREEN_HEIGHT / 2 - 100 },
    useNativeDriver: false,
  });
  const bottomRight = Animated.timing(position, {
    toValue: { x: SCREEN_WIDTH / 2 - 100, y: SCREEN_HEIGHT / 2 - 100 },
    useNativeDriver: false,
  });
  const topRight = Animated.timing(position, {
    toValue: { x: SCREEN_WIDTH / 2 - 100, y: -SCREEN_HEIGHT / 2 + 100 },
    useNativeDriver: false,
  });
  const moveUp = () => {
    Animated.loop(
      Animated.sequence([bottomLeft, bottomRight, topRight, topLeft])
    ).start();
  };

  const borderRadius = position.y.interpolate({
    inputRange: [-200, 200],
    outputRange: [100, 0],
  });
  const backgroundColor = position.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["rgb(255,99,71)", "rgb(255,100,200)"],
  });
  return (
    <Container>
      <Pressable onPress={moveUp}>
        <AnimatedBox
          style={{
            borderRadius,
            backgroundColor,
            transform: [...position.getTranslateTransform()],
          }}
        />
      </Pressable>
    </Container>
  );
}
