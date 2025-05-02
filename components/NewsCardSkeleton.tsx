import React, { useEffect, useRef } from "react";
import { View, ViewProps } from "./Themed";
import {
  StyleSheet,
  useColorScheme,
  Animated,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function NewsCardSkeleton({ style, ...otherProps }: ViewProps) {
  const colorScheme = useColorScheme() ?? "light";
  const { width } = useWindowDimensions();
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
    outputRange: [-width * 0.9, width * 0.9],
  });

  return (
    <View style={[styles.container, style, { backgroundColor: "transparent" }]}>
      {/* Placeholder para o Título */}
      <View
        style={[styles.skeletonTitle, { backgroundColor: skeletonBaseColor }]}
      />
      {/* Placeholder para o Corpo do Texto */}
      <View
        style={[
          styles.skeletonBodyLine,
          { width: "90%", backgroundColor: skeletonBaseColor },
        ]}
      />
      <View
        style={[
          styles.skeletonBodyLine,
          { width: "80%", backgroundColor: skeletonBaseColor },
        ]}
      />
      <View
        style={[
          styles.skeletonBodyLine,
          { width: "95%", backgroundColor: skeletonBaseColor },
        ]}
      />
      <View
        style={[
          styles.skeletonBodyLine,
          { width: "70%", backgroundColor: skeletonBaseColor },
        ]}
      />
      {/* Placeholder para a Imagem */}
      <View
        style={[styles.skeletonImage, { backgroundColor: skeletonBaseColor }]}
      />

      {/* Placeholder para o Footer */}
      <View
        style={[styles.skeletonFooter, { backgroundColor: skeletonBaseColor }]}
      />

      {/* Overlay com o Gradiente Animado */}
      <AnimatedLinearGradient
      colors={shimmerGradientColors}
      style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
    />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingBottom: 20,
    marginHorizontal: 20,
    overflow: "hidden",
    position: "relative",
  },
  skeletonTitle: {
    height: 18,
    width: "70%",
    borderRadius: 4,
    marginLeft: 15,
    marginBottom: 15,
  },
  skeletonBodyLine: {
    height: 14,
    borderRadius: 4,
    marginBottom: 8,
    marginHorizontal: 15,
  },
  skeletonImage: {
    width: "100%",
    height: 180,
    marginTop: 15,
    borderRadius: 4,
  },
  skeletonFooter: {
    height: 12,
    width: "50%",
    borderRadius: 4,
    marginTop: 15,
    marginLeft: 15,
  },
});
