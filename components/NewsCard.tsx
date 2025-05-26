import { View, Text, ViewProps } from "./Themed";
import { StyleSheet, useColorScheme, Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type NewsCardProps = ViewProps & {
  title: string;
  bodyText: string;
  image: string;
  department: string;
  time: string;
  onPress: () => void;
  testID?: string;
  imageTestID?: string;
};

export default function NewsCard({
  title,
  bodyText,
  image,
  department,
  time,
  style,
  onPress,
  testID,
  imageTestID,
  ...otherProps
}: NewsCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  const timeText = `${
    time[0].toUpperCase() + time.slice(1)
  } • Em ${department}`;
  const accessibilityLabel = `Notícia: ${title}. ${bodyText}. Publicado ${timeText}`;

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={[styles.container, style, {borderColor: themeColors.borderColor}]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Toque para ver mais detalhes"
      hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
      {...otherProps}
    >
      <Text style={styles.title} accessible={false} accessibilityRole="header">
        {title}
      </Text>
      <Image
        style={styles.image}
        source={image}
        contentFit="cover"
        testID={imageTestID || "news-card-image"}
        accessible={false}
        accessibilityElementsHidden={true}
      />
      <Text
        style={[styles.bodyText, { color: themeColors.bodyText }]}
        ellipsizeMode={"tail"}
        numberOfLines={4}
        accessible={false}
      >
        {bodyText}
      </Text>

      <View style={styles.footerContainer}>
  <MaterialCommunityIcons name="clock-outline" size={14} color={themeColors.secondaryText} />
  <Text style={[styles.footerText, { color: themeColors.secondaryText, marginLeft: 5 }]}>
    {time[0].toUpperCase() + time.slice(1)}
  </Text>
  <Text style={[styles.footerText, { color: themeColors.secondaryText }]}> • </Text>
  <MaterialCommunityIcons name="tag-outline" size={14} color={themeColors.secondaryText} />
  <Text style={[styles.footerText, { color: themeColors.secondaryText, marginLeft: 5 }]}>
    Em {department}
  </Text>
</View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingVertical: 20,
    minHeight: 44,
  },
  title: {
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
    lineHeight: 24,
  },
  bodyText: {
    marginVertical: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    lineHeight: 22,
  },
  image: {
    width: "100%",
    height: 180,
    marginTop: 10,
  },
  footerContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
  marginLeft: 15,
},
footerText: {
  fontSize: 12,
  lineHeight: 16,
},
});
