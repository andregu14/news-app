import { View, Text, ViewProps } from "./Themed";
import { StyleSheet, useColorScheme, Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";

type NewsCardProps = ViewProps & {
  title?: string;
  bodyText?: string;
  image?: string;
  department: string;
  time: string;
  onPress?: () => void;
};

export default function NewsCard({
  title,
  bodyText,
  image,
  department,
  time,
  style,
  onPress,
  ...otherProps
}: NewsCardProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  return (
    <Pressable onPress={onPress}>
      <View style={[styles.container, style]} {...otherProps}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.bodyText} ellipsizeMode={"tail"} numberOfLines={5}>
          {bodyText}
        </Text>
        <Image
          style={styles.image}
          source={{ uri: image }}
          contentFit="cover"
        />
        <Text style={[styles.footerText, { color: themeColors.secondaryText }]}>
          {`Há ${time} - Em ${department}`}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingBottom: 20,
  },
  title: {
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "bold",
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
  footerText: {
    marginTop: 10,
    marginLeft: 15,
    fontSize: 12,
  },
});
