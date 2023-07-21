import { useState, useEffect, useRef } from "react";
import { Animated, Easing, Pressable, TouchableOpacity } from "react-native";
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
  const [up, setUp] = useState(false);
  const position = useRef(new Animated.ValueXY({ x: 0, y: 200 })).current;
  const toggleUp = () => setUp((prev) => !prev);
  const moveUp = () => {
    Animated.timing(position, {
      toValue: up ? 200 : -200,
      // easing: Easing.bounce,
      useNativeDriver: false,
      duration: 1500,
    }).start(toggleUp);
  };
  const opacity = position.y.interpolate({
    inputRange: [-200, -100, 100, 200],
    outputRange: [1, 0.2, 0.2, 1],
  });
  const rotate = position.y.interpolate({
    inputRange: [-200, 200],
    outputRange: ["-360deg", "360deg"],
  });
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
            opacity,
            transform: [{ rotateY: rotate }, { translateY: position.y }],
          }}
        />
      </Pressable>
    </Container>
  );
}
