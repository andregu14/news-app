import { View, Text, ViewProps } from "./Themed";
import { Image, StyleSheet } from "react-native";

type NewsCardProps = {
  title?: string;
  bodyText?: string;
  image?: string;
  footerText?: string;
};

const randomImage = "https://picsum.photos/400/180";

export default function NewsCard(props: NewsCardProps, style: ViewProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>Title</Text>
      <Text style={styles.bodyText} ellipsizeMode={"tail"} numberOfLines={5}>
        {props.bodyText ? props.bodyText : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
      </Text>
      <Image
        style={styles.image}
        source={{ uri: props.image ?? randomImage }}
        resizeMode="cover"
      />
      <Text style={styles.footerText}>Há 4 minutos - Em tecnologia</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 40,
  },
  title: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "bold",
  },
  bodyText: {
    marginVertical: 20,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  image: {
    width: "100%",
    height: 180,
  },
  footerText: {
    marginTop: 10,
    marginLeft: 15,
    fontSize: 12,
    color: "#888",
  },
});
