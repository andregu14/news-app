import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Text, View } from "@/components/Themed";
import { StyleSheet, useColorScheme } from "react-native";
import Colors from "@/constants/Colors";
import { useCallback } from "react";

type AboutUsProps = {
  ref: any;
  appVersion: string;
};

export default function AboutUsModal({ ref, appVersion }: AboutUsProps) {
  const colorScheme = useColorScheme() ?? "light";
  const themeColors = Colors[colorScheme];

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.4}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={["30%"]}
      enablePanDownToClose
      enableHandlePanningGesture
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: themeColors.background,
        borderRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: themeColors.secondaryText,
      }}
    >
      <BottomSheetView style={styles.bottomSheetContent}>
        <Text style={[styles.aboutTitle, { color: themeColors.text }]}>
          🗞️ News App
        </Text>

        <Text style={[styles.versionText, { color: themeColors.text }]}>
          Versão atual{"  "}
          <Text
            style={[styles.versionNumber, { color: themeColors.secondaryText }]}
          >
            {appVersion}
          </Text>
        </Text>

        <Text style={[styles.aboutText, { color: themeColors.secondaryText }]}>
          Desenvolvido usando React Native e Expo
        </Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  bottomSheetContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  aboutTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
  },
  versionText: {
    fontWeight: "600",
    fontSize: 20,
  },
  versionNumber: {
    fontSize: 16,
  },
  aboutText: {
    fontSize: 14,
    textAlign: "justify",
    marginTop: 40,
  },
});
