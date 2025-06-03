import { View, ViewProps, Text } from "./Themed";
import { Image } from "expo-image";
import { StyleSheet, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { useEffect, useState } from "react";

type AuthorDetailsProps = ViewProps & {
  name: string;
  photo?: string;
  date: string;
  department: string;
  imageTestId?: string;
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
  const [image, setImage] = useState<string | undefined>();

  useEffect(() => {
    if (!photo) setImage(`https://ui-avatars.com/api/?name=${name}`);
  }, [name, photo]);

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
          source={{ uri: photo || image }}
          placeholder={require("@/assets/images/photo-placeholder.png")}
          style={styles.photo}
          contentFit="cover"
          testID={imageTestId}
        />
      </View>
      <View>
        <Text style={[styles.text, { fontWeight: "bold" }]}>{name}</Text>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.subText,
              { color: themeColors.secondaryText, marginRight: 3 },
            ]}
          >
            {`${date}`}
          </Text>
          <Text
            style={[
              styles.subText,
              { color: themeColors.secondaryText, fontSize: 9 },
            ]}
          >
            {" • "}
          </Text>
          <Text
            style={[
              styles.subText,
              { color: themeColors.secondaryText, marginLeft: 3 },
            ]}
          >
            Em {name || "Fonte Desconhecida"}
          </Text>
        </View>
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
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
