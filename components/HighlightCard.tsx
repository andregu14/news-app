import { View, Text, ViewProps } from "./Themed";
import {
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Pressable,
} from "react-native";
import Colors, { Department, departmentColors } from "@/constants/Colors";
import { Image } from "expo-image";
import { memo } from "react";

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
  const accessibilityLabel = `${department || "Notícia"}: ${description}`;

  const Badge = () => {
    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colorsConfig?.backgroundColor || "#000",
          },
        ]}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        <Text
          style={[
            styles.badgeText,
            {
              color: colorsConfig?.textColor,
            },
          ]}
          accessible={false}
        >
          {department}
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
          backgroundColor: colorScheme === "dark" ? "#181A20" : "#fff",
        },
      ]}
      testID={testID}
      // Acessibilidade
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Toque para abrir o artigo completo"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      android_ripple={{
        color:
          colorScheme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      }}
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
          source={{ uri: image }}
          contentFit="cover"
          testID={imageTestID || "highlight-card-image"}
          accessible={false}
          accessibilityElementsHidden={true}
        />
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
      </View>
    </Pressable>
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
  descriptionText: {
    padding: 10,
    height: "50%",
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
    fontFamily: "Inter_500Medium",
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
