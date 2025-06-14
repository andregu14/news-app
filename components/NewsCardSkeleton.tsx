import React from "react";
import { View, ViewProps } from "./Themed";
import { StyleSheet } from "react-native";
import { Skeleton } from "./Skeleton";
export default function NewsCardSkeleton({ style, ...otherProps }: ViewProps) {
  return (
    <View
      style={[styles.container, style, { backgroundColor: "transparent" }]}
      {...otherProps}
    >
      <View style={{ paddingHorizontal: 15 }}>
        {/* Titulo */}
        <View style={{marginVertical: 20}}>
          <Skeleton height={18} width="70%" />
        </View>

         {/* Imagem */}
      <Skeleton height={180} width="100%" />

        {/* Corpo do Texto */}
        <View style={{ marginVertical: 15, rowGap: 8 }}>
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="80%" />
          <Skeleton height={14} width="95%" />
          <Skeleton height={14} width="70%" />
        </View>
      </View>

      {/* Footer */}
      <View style={{ paddingHorizontal: 15, marginTop: 15 }}>
        <Skeleton height={12} width="50%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingBottom: 20,
    overflow: "hidden",
  },
});
