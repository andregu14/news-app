import { Text, TitleText, View } from "@/components/Themed";
import { useLocalSearchParams, Stack } from "expo-router";
import { StyleSheet, Image, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import Colors, { departmentColors } from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import AuthorDetails from "@/components/AuthorDetails";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NewsDetailsScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];
  const params = useLocalSearchParams();
  const newsTitle = params.newsTitle as string
  const newsDescription = params.newsDescription as string;
  const newsContent = params.newsContent as string
  const newsUrl = params.newsUrl as string;
  const newsImage = params.newsImage as string;
  const newsPublishedAt = params.newsPublishedAt as string;
  const newsSourceName = params.newsSourceName as string;
  const newsSourceUrl = params.newsSourceUrl as string;

  const insets = useSafeAreaInsets();
  const colorsConfig = departmentColors["Tecnologia"];

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: newsSourceName,
          headerTitleStyle: {
            fontSize: 18,
            color: colorsConfig.backgroundColor ?? themeColors.text,
          },
          headerStyle: {
            backgroundColor: colorsConfig?.textColor ?? themeColors.background,
          },
          headerTintColor: colorsConfig?.backgroundColor ?? themeColors.text,
        }}
      />
      <ScrollView>
        <Image
          source={{ uri: newsImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <TitleText style={styles.title}>{newsTitle}</TitleText>
        <Text style={[styles.description, {color: themeColors.secondaryText}]}>{newsDescription}</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <AuthorDetails
          style={styles.authorDetails}
          date={newsPublishedAt}
          department={newsSourceName}
          name={newsSourceName}
        />
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Text style={styles.content}>{`${newsContent}\n\n${newsContent} `}</Text>

        <View
          style={[styles.separator, { marginBottom: insets.bottom }]}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </ScrollView>
      <View
        style={[
          styles.bottomView,
          {
            height: insets.bottom,
            backgroundColor: themeColors.background,
          },
        ]}
      />
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    marginTop: 30,
    paddingHorizontal: 20,
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    marginBottom: 20,
  },
  description: {
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  authorDetails: {
    marginHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    fontSize: 16,
    lineHeight: 24,
  },
  separator: {
    marginVertical: 15,
    height: 1,
    width: "90%",
    alignSelf: "center",
  },
  bottomView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
});
