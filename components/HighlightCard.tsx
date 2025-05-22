import { View, Text, ViewProps } from "./Themed";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Pressable,
} from "react-native";
import Colors, { Department, departmentColors } from "@/constants/Colors";
import { Image } from "expo-image";

type HighlightCardProps = ViewProps & {
  description?: string;
  image?: string;
  department: string;
  onPress?: () => void;
  testID?: string;
  imageTestID?: string;
};

const randomImage = "https://picsum.photos/170/200";

export default function HighlightCard({
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
  const colorsConfig = departmentColors[department as Department];

  const cardWidth = Math.min(width * 0.4, 340);

  const Badge = () => {
    return (
      <View
        style={[
          styles.badge,
          { backgroundColor: colorsConfig.backgroundColor ?? "#E3F2FD" },
        ]}
      >
        <Text style={[styles.badgeText, { color: colorsConfig.textColor }]}>
          {department ?? "Notícias"}
        </Text>
      </View>
    );
  };

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
            : colorScheme === "dark"
            ? "#181A20"
            : "#fff",
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
        <Badge />
        <Text
          ellipsizeMode={"tail"}
          numberOfLines={4}
          style={styles.descriptionText}
        >
          {description
            ? description
            : "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet"}
        </Text>
        <View
          style={[
            styles.bottomColor,
            { backgroundColor: colorsConfig.textColor },
          ]}
        ></View>
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
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    position: "absolute",
    top: 5,
    right: 5,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 500,
  },
  bottomColor: {
    position: "absolute",
    bottom: -15,
    width: "90%",
    alignSelf: "center",
    height: 10,
    borderRadius: 20,
  },
});
