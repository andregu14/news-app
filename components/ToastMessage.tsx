import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";

export const toastConfig: ToastConfig = {
  error: ({ text1, text2, onPress }) => (
    <Pressable onPress={onPress}>
      <View style={[styles.container, styles.errorContainer]}>
        <MaterialIcons name="error-outline" size={24} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{text1}</Text>
          {text2 && <Text style={styles.message}>{text2}</Text>}
        </View>
        <MaterialIcons
          name="close"
          size={20}
          color="white"
          style={styles.closeIcon}
        />
      </View>
    </Pressable>
  ),
  success: ({ text1, text2, onPress }) => (
    <Pressable onPress={onPress}>
      <View style={[styles.container, styles.successContainer]}>
        <MaterialIcons name="check-circle-outline" size={24} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{text1}</Text>
          {text2 && <Text style={styles.message}>{text2}</Text>}
        </View>
        <MaterialIcons
          name="close"
          size={20}
          color="white"
          style={styles.closeIcon}
        />
      </View>
    </Pressable>
  ),
  // Toast para quando um item é ADICIONADO aos favoritos
  favorite_added: ({ text1, text2, onPress }) => (
    <Pressable onPress={onPress}>
      <View style={[styles.container, styles.favoriteAddedContainer]}>
        <Ionicons name="heart" size={24} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{text1}</Text>
          {text2 && <Text style={styles.message}>{text2}</Text>}
        </View>
        <MaterialIcons
          name="close"
          size={20}
          color="white"
          style={styles.closeIcon}
        />
      </View>
    </Pressable>
  ),

  // Toast para quando um item é REMOVIDO dos favoritos
  favorite_removed: ({ text1, text2, onPress }) => (
    <Pressable onPress={onPress}>
      <View style={[styles.container, styles.favoriteRemovedContainer]}>
        <Ionicons name="heart-dislike-outline" size={24} color="white" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{text1}</Text>
          {text2 && <Text style={styles.message}>{text2}</Text>}
        </View>
        <MaterialIcons
          name="close"
          size={20}
          color="white"
          style={styles.closeIcon}
        />
      </View>
    </Pressable>
  ),
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
  },
  errorContainer: {
    backgroundColor: "#FF3B30", // Vermelho
  },
  successContainer: {
    backgroundColor: "#34C759", // Verde
  },
  favoriteAddedContainer: {
    backgroundColor: "#007AFF", // Azul
  },
  favoriteRemovedContainer: {
    backgroundColor: "#8E8E93", // Cinza
  },
  textContainer: {
    marginLeft: 10,
  },
  title: {
    color: "white",
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  message: {
    color: "white",
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 2,
  },
  closeIcon: {
    marginLeft: 10,
  },
});

export default Toast;
