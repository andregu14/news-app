import { View, Text, ViewProps } from "./Themed";
import { Image, StyleSheet, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

type NewsCardProps = ViewProps & {
  title?: string;
  bodyText?: string;
  image?: string;
  footerText?: string;
};

const randomImage = "https://picsum.photos/400/180";

export default function NewsCard({
  title = "Title", 
  bodyText,
  image,
  footerText = "Há 4 minutos - Em tecnologia",
  style,
  ...otherProps
}: NewsCardProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];

  return (
    <View style={[styles.container, style]} {...otherProps}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.bodyText} ellipsizeMode={"tail"} numberOfLines={5}>
        {bodyText ? bodyText : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
      </Text>
      <Image
        style={styles.image}
        source={{ uri: image ?? randomImage }}
        resizeMode="cover"
      />
      <Text style={[styles.footerText, { color: themeColors.secondaryText }]}>
        {footerText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20, 
    paddingBottom: 20,
  },
  title: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
  bodyText: {
    marginVertical: 10,
    paddingHorizontal: 15,
    fontSize: 14,
    lineHeight: 20,
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
