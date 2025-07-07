import { View, Text, ViewProps } from "./Themed";
import { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import Colors, { Department, departmentColors } from "@/constants/Colors";
import { Image } from "expo-image";
import { memo, useState } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { getOptimizedImageUrl } from "@/utils/imageOptimizer";
import { Skeleton } from "./Skeleton";

type HighlightCardProps = ViewProps & {
  description: string;
  image: string;
  department?: string;
  onPress: () => void;
  testID?: string;
  imageTestID?: string;
};

function HighlightCard({
  description,
  image,
  department,
  style,
  onPress,
  testID,
  imageTestID,
  ...otherProps
}: HighlightCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const colorsConfig = departmentColors[department as Department] || {
    backgroundColor: "#00695C",
    textColor: "#fff",
  };

  const cardWidth = Math.min(width * 0.4, 340);
  const imageWidthInPixels = Math.round(cardWidth * 2);
  const [optimizedImage, setOptimizedImage] = useState(getOptimizedImageUrl(image, {
    width: imageWidthInPixels,
  }))
  const [isImageLoading, setIsImageLoading] = useState(true);

  const accessibilityLabel = `${department || "Notícia"}: ${description}`;

  const isPressed = useSharedValue(false);

  // Gesto de toque
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      isPressed.value = true;
    })
    .onEnd((_event, success) => {
      if (success) {
        runOnJS(onPress)();
      }
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withTiming(isPressed.value ? 0.97 : 1, { duration: 150 }) },
      ],
      opacity: withTiming(isPressed.value ? 0.8 : 1, { duration: 150 }),
    };
  });

  const Badge = () => (
    <View
      style={[
        styles.badge,
        { backgroundColor: colorsConfig?.backgroundColor || "#000" },
      ]}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    >
      <Text
        style={[styles.badgeText, { color: colorsConfig?.textColor }]}
        accessible={false}
        ellipsizeMode={"tail"}
        numberOfLines={1}
      >
        {department}
      </Text>
    </View>
  );

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[
          styles.container,
          {
            width: cardWidth,
            borderColor: themeColors.borderColor,
            backgroundColor: colorScheme === "dark" ? "#181A20" : "#fff",
          },
          animatedStyle,
          style,
        ]}
        testID={testID}
        // Acessibilidade
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Toque para abrir o artigo completo"
        {...otherProps}
      >
        <View style={styles.imageContainer}>
          <Skeleton show={isImageLoading} radius={"square"}>
            <Image
              style={styles.image}
              source={optimizedImage}
              onError={() => setOptimizedImage(require("@/assets/images/image-not-found.png"))}
              transition={300}
              contentFit="cover"
              onLoadEnd={() => setIsImageLoading(false)}
              testID={imageTestID || "highlight-card-image"}
              accessible={false}
              accessibilityElementsHidden={true}
            />
          </Skeleton>
        </View>
        {/* Mostra a badge se department for fornecido */}
        {department && <Badge />}
        <Text
          ellipsizeMode={"tail"}
          numberOfLines={4}
          style={styles.descriptionText}
        >
          {description}
        </Text>
        <View
          style={[
            styles.bottomColor,
            { backgroundColor: colorsConfig.backgroundColor },
          ]}
        ></View>
      </Animated.View>
    </GestureDetector>
  );
}

export default memo(HighlightCard);

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 7.5,
    borderWidth: 1,
    overflow: "hidden",
  },
  imageContainer: {
    width: "100%",
    height: "50%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  descriptionText: {
    padding: 10,
    height: "50%",
    fontFamily: "Inter_500Medium",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginLeft: 10,
    borderRadius: 20,
    position: "absolute",
    top: 5,
    right: 5,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  bottomColor: {
    position: "absolute",
    bottom: -7,
    width: "90%",
    alignSelf: "center",
    height: 10,
    borderRadius: 20,
  },
});
