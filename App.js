import { useState, useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styled from "styled-components/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import icons from "./icons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Card = styled(Animated.createAnimatedComponent(View))`
  justify-content: center;
  align-items: center;
  width: 250px;
  height: 250px;
  background: tomato;
  position: absolute;
`;

const Button = styled.TouchableOpacity`
  margin: 0 5px;
`;
const ButtonContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;
const CardContainer = styled.View`
  justify-content: center;
  align-items: center;
  flex: 3;
`;

export default function App() {
  // Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const rotation = position.interpolate({
    inputRange: [-250, 250],
    outputRange: ["-15deg", "15deg"],
  });
  const secondScale = position.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [1, 0.5, 1],
    extrapolate: "clamp",
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

  const goLeft = Animated.spring(position, {
    toValue: -500,
    tension: 5,
    useNativeDriver: true,
  });
  const goRight = Animated.spring(position, {
    toValue: 500,
    tension: 5,
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
          goLeft.start(onDismiss);
        } else if (dx > 230) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;

  // State
  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    scale.setValue(1);
    position.setValue(0);
    setIndex((prev) => prev + 1);
  };
  const closePress = () => {
    goLeft.start(onDismiss);
  };
  const checkPress = () => {
    goRight.start(onDismiss);
  };
  return (
    <Container>
      <CardContainer>
        <Card style={{ transform: [{ scale: secondScale }] }}>
          <Ionicons name={icons[index + 1]} size={50} color="white" />
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{
            transform: [
              { scale },
              { translateX: position },
              { rotateZ: rotation },
            ],
          }}
        >
          <Ionicons name={icons[index]} size={50} color="white" />
        </Card>
      </CardContainer>

      <ButtonContainer>
        <Button onPress={closePress}>
          <Ionicons name="close-circle" size={50} color="#333" />
        </Button>
        <Button onPress={checkPress}>
          <Ionicons name="checkmark-circle" size={50} color="#333" />
        </Button>
      </ButtonContainer>
    </Container>
  );
}
