import { View, Text, ViewProps } from "./Themed";
import { StyleSheet, useColorScheme, Pressable } from "react-native";
import Colors from "@/constants/Colors";
import { Image } from "expo-image";

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

  return (
    <Pressable onPress={onPress} testID={testID} style={[styles.container]}>
      <View  {...otherProps}>
        <Text style={styles.title}>{title}</Text>
        <Text
          style={[styles.bodyText, { color: themeColors.bodyText }]}
          ellipsizeMode={"tail"}
          numberOfLines={4}
        >
          {bodyText}
        </Text>
        <Image
          style={styles.image}
          source={{ uri: image }}
          contentFit="cover"
          testID={imageTestID}
        />
        <Text style={[styles.footerText, { color: themeColors.secondaryText }]}>
          {`${time[0].toUpperCase() + time.slice(1)} • Em ${department}`}
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
