import { View, ViewProps, Text } from "./Themed";
import { Image } from "expo-image";
import { StyleSheet, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";

type AuthorDetailsProps = ViewProps & {
  name: string;
  photo?: string;
  date: string;
  department: string;
  imageTestId?: string
};

export default function AuthorDetails({
  name,
  photo,
  date,
  department,
  imageTestId,
  ...otherProps
}: AuthorDetailsProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  return (
    <View style={[styles.container, otherProps.style]}>
      <View
        style={[
          styles.photoContainer,
          {
            borderColor:
              colorScheme === "dark" ? "rgba(255, 255, 255, 0.15)" : "#eee",
          },
        ]}
      >
        <Image
          source={{ uri: photo }}
          placeholder={require("@/assets/images/photo-placeholder.png")}
          style={styles.photo}
          contentFit="cover"
          testID={imageTestId}
        />
      </View>
      <View>
        <Text style={[styles.text, { fontWeight: "bold" }]}>{name}</Text>
        <Text
          style={[styles.subText, { color: themeColors.secondaryText }]}
        >{`${date[0].toUpperCase() + date.slice(1)} • Em ${department}`}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  photoContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
    backgroundColor: "#bcbdc1",
  },
  text: {
    fontSize: 15,
  },
  subText: {
    fontSize: 13,
  },
});
