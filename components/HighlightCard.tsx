import { View, Text, ViewProps } from "./Themed";
import { Image, StyleSheet, useColorScheme, useWindowDimensions } from "react-native"; 
import Colors from "@/constants/Colors";

type HighlightCardProps = ViewProps & { 
  description?: string;
  image?: string;
};

const randomImage = "https://picsum.photos/170/200";

export default function HighlightCard({
  description,
  image,
  style, 
  ...otherProps
}: HighlightCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { width } = useWindowDimensions();

  // Calcular largura do card
  const cardWidth = Math.min(width * 0.40, 340);

  return (
    <View
      style={[
        styles.container,
        { 
          width: cardWidth,
          borderColor: themeColors.borderColor
        },
        style,
      ]}
      {...otherProps}
    >
      <Image
        style={styles.imageContainer}
        source={{ uri: image ?? randomImage }}
        resizeMode="cover"
      />
      <Text ellipsizeMode={"tail"} numberOfLines={4} style={styles.descriptionText}>
        {description ? description : "Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 14,
    alignItems: "center",
    marginHorizontal: 7.5,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imageContainer: {
    width: "100%",
    height: "50%",
  },
  descriptionText: {
    padding: 10,
  }
});
