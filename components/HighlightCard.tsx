import { View, Text, ViewProps } from "./Themed";
import { Dimensions, Image, StyleSheet, useColorScheme } from "react-native";

type HighlightCardProps = {
  description?: string;
  image?: string;
};

const randomImage = "https://picsum.photos/170/200";

export default function HighlightCard({
  description,
  image,
}: HighlightCardProps, style: ViewProps) {
  const colorScheme = useColorScheme();

  return (
    <View style={[styles.container, style, { borderColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.2)" : "#eee" }]}>
      <Image
        style={styles.imageContainer}
        source={{ uri: image ?? randomImage }}
        resizeMode="cover"
      />
      <Text ellipsizeMode={"tail"} numberOfLines={4} style={styles.descriptionText}>{description ? description : "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet"}</Text>
    </View>
  );
}

const { width } = Dimensions.get("window");
const cardWidth = Math.min(width * 0.85, 170);

const styles = StyleSheet.create({
  container: {
    height: 200,
    width: cardWidth,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 7.5,
    borderWidth: 1,
  },
  imageContainer: {
    width: "100%",
    height: "50%",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  descriptionText: {
    padding: 10
  }
});
