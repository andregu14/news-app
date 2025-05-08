import { View, Text, ViewProps } from "./Themed";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Pressable,
} from "react-native";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";

type HighlightCardProps = ViewProps & {
  description?: string;
  image?: string;
  onPress?: () => void;
  testID?: string;
  imageTestID?: string;
};

const randomImage = "https://picsum.photos/170/200";

export default function HighlightCard({
  description,
  image,
  style,
  onPress,
  testID,
  imageTestID,
  ...otherProps
}: HighlightCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const { width } = useWindowDimensions();

  const cardWidth = Math.min(width * 0.4, 340);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        {
          width: cardWidth,
          borderColor: themeColors.borderColor,
          opacity: pressed ? 0.8 : 1,
          backgroundColor: pressed
            ? colorScheme === "dark"
              ? "#333"
              : "#f5f5f5"
            : "transparent",
        },
      ]}
      testID={testID}
    >
      <View
        style={[
          {
            width: cardWidth,
            backgroundColor: "transparent",
          },
          style,
        ]}
        {...otherProps}
      >
        <Image
          style={styles.imageContainer}
          source={{ uri: image ?? randomImage }}
          contentFit="cover"
          testID={imageTestID}
        />
        <Text
          ellipsizeMode={"tail"}
          numberOfLines={4}
          style={styles.descriptionText}
        >
          {description
            ? description
            : "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet"}
        </Text>
      </View>
    </Pressable>
  );
}

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
  descriptionText: {
    padding: 10,
  },
});
