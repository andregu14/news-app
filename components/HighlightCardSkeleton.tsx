import React, { useEffect, useRef } from "react";
import { View } from "./Themed";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Animated,
} from "react-native";
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function HighlightCardSkeleton() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.4, 340);
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  const skeletonBaseColor = colorScheme === "dark" ? "#333" : "#E0E0E0";

  const shimmerGradientColors =
    colorScheme === "dark"
      ? (["transparent", "rgba(255,255,255,0.1)", "transparent"] as const)
      : (["transparent", "rgba(0,0,0,0.05)", "transparent"] as const);

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-cardWidth, cardWidth],
  });

  return (
    <View
      style={[
        styles.container,
        {
          width: cardWidth,
          borderColor: themeColors.borderColor,
          backgroundColor: skeletonBaseColor,
        },
      ]}
    >
      {/* Elementos do Skeleton (imagem e texto) */}
      <View
        style={[styles.imageContainer, { backgroundColor: skeletonBaseColor }]}
      />
      <View style={styles.skeletonTextGroup}>
        <View
          style={[
            styles.skeletonText,
            { width: "90%", backgroundColor: skeletonBaseColor },
          ]}
        />
        <View
          style={[
            styles.skeletonText,
            { width: "70%", backgroundColor: skeletonBaseColor },
          ]}
        />
        <View
          style={[
            styles.skeletonText,
            { width: "80%", backgroundColor: skeletonBaseColor },
          ]}
        />
      </View>

      {/* Overlay com o Gradiente Animado */}
      <AnimatedLinearGradient
        colors={shimmerGradientColors}
        style={[
          StyleSheet.absoluteFill, // Cobrir todo o container
          { transform: [{ translateX }] }, // Aplicar a translação animada
        ]}
        start={{ x: 0, y: 0.5 }} // Gradiente horizontal
        end={{ x: 1, y: 0.5 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 14,
    marginHorizontal: 7.5,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: "50%",
  },
  skeletonTextGroup: {
    padding: 10,
    width: "100%",
    height: "50%",
  },
  skeletonText: {
    height: 14,
    borderRadius: 4,
    marginBottom: 6,
  },
});
