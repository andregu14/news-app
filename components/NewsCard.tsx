import { View, Text, ViewProps, BodyText, TitleText } from "./Themed";
import { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";
import Colors from "@/constants/Colors";
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

type NewsCardProps = ViewProps & {
  title: string;
  bodyText: string;
  image: string;
  sourceName?: string;
  time: string;
  onPress: () => void;
  testID?: string;
  imageTestID?: string;
};

function NewsCard({
  title,
  bodyText,
  image,
  sourceName,
  time,
  style,
  onPress,
  testID,
  imageTestID,
  ...otherProps
}: NewsCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const { width: screenWidth } = useWindowDimensions();
  const [optimizedImage, setOptimizedImage] = useState(
    getOptimizedImageUrl(image, {
      width: screenWidth,
    })
  );
  const [isImageLoading, setIsImageLoading] = useState(true);

  const accessibilityLabel = `Notícia: ${title}. ${bodyText}. Publicado ${time} • Em ${
    sourceName || "Fonte Desconhecida"
  }`;

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
      opacity: withTiming(isPressed.value ? 0.8 : 1),
    };
  });

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        testID={testID}
        style={[
          styles.container,
          { borderColor: themeColors.borderColor },
          style,
          animatedStyle,
        ]}
        // Acessibilidade
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint="Toque para ver mais detalhes"
        {...otherProps}
      >
        <TitleText
          style={styles.title}
          accessible={false}
          accessibilityRole="header"
        >
          {title}
        </TitleText>
        <View style={styles.imageContainer}>
          <Skeleton show={isImageLoading}>
            <Image
              style={styles.image}
              source={optimizedImage}
              onError={() =>
                setOptimizedImage(
                  require("@/assets/images/image-not-found.png")
                )
              }
              transition={300}
              contentFit="cover"
              onLoadEnd={() => setIsImageLoading(false)}
              testID={imageTestID || "news-card-image"}
              accessible={false}
              accessibilityElementsHidden={true}
            />
          </Skeleton>
        </View>
        <BodyText
          style={styles.bodyText}
          ellipsizeMode={"tail"}
          numberOfLines={4}
          accessible={false}
        >
          {bodyText}
        </BodyText>

        <View style={styles.footerContainer}>
          <Text
            style={[
              styles.footerText,
              { color: themeColors.secondaryText, marginRight: 3 },
            ]}
          >
            {`${time}`}
          </Text>
          <Text
            style={[
              styles.footerText,
              { color: themeColors.secondaryText, fontSize: 9 },
            ]}
          >
            {" • "}
          </Text>
          <Text
            style={[
              styles.footerText,
              { color: themeColors.secondaryText, marginLeft: 3 },
            ]}
          >
            Em {sourceName || "Fonte Desconhecida"}
          </Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

export default memo(NewsCard);

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    paddingVertical: 20,
    minHeight: 44,
  },
  title: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    fontSize: 24,
    fontFamily: "Inter_700Bold",
  },
  bodyText: {
    marginVertical: 10,
    paddingHorizontal: 15,
    lineHeight: 22,
  },
  imageContainer: {
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2.5,
  },
  image: {
    width: "100%",
    height: 220,
  },
  footerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 15,
  },
  footerText: {
    fontSize: 12,
    lineHeight: 16,
  },
});
