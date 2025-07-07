import { TitleText, View } from "./Themed";
import { StyleSheet, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import Colors from "@/constants/Colors";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { memo, useState } from "react";
import { Skeleton } from "./Skeleton";

type HighlightCardMain = {
  description: string;
  image: string;
  onPress: () => void;
};

function HighlightCardMain({ description, image, onPress }: HighlightCardMain) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const [img, setImg] = useState(image);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [displayDescription, setDisplayDescription] = useState(false);

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

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[
          styles.container,
          { borderColor: themeColors.borderColor },
          animatedStyle,
        ]}
      >
        <Skeleton show={isImageLoading}>
          <Image
            source={img}
            onError={() =>
              setImg(require("@/assets/images/image-not-found.png"))
            }
            onDisplay={() => setDisplayDescription(true)}
            style={styles.image}
            onLoadEnd={() => setIsImageLoading(false)}
            contentFit="cover"
          />
        </Skeleton>
        {displayDescription && (
          <>
            <TitleText style={styles.text}>{description}</TitleText>
            <LinearGradient
              colors={["transparent", "black"]}
              style={styles.gradient}
            />
          </>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
export default memo(HighlightCardMain);

export function HighlightCardMainSkeleton() {
  return (
    <View style={[styles.container, { borderWidth: 0 }]}>
      <Skeleton height={"100%"} width="100%" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 240,
    borderWidth: 1,
    borderRadius: 14,
    marginHorizontal: 17,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
  },
  text: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 20,
    color: "#fff",
    zIndex: 2,
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
  },
  skeletonTextGroup: {
    padding: 10,
    width: "100%",
    height: "50%",
    justifyContent: "space-evenly",
  },
});
