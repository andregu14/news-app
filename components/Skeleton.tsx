// components/Skeleton.tsx
import React from "react";
import { Skeleton as MotiSkeleton } from "moti/skeleton";
import { useColorScheme } from "react-native";

type SkeletonProps = React.ComponentProps<typeof MotiSkeleton>;

export function Skeleton(props: SkeletonProps) {
  const colorScheme = useColorScheme() ?? "light";

  const skeletonBaseColor = colorScheme === "dark" ? "#23232b" : "#e3e3e7";
  const skeletonHighlightColor = colorScheme === "dark" ? "#393946" : "#f4f4f7";

  return (
    <MotiSkeleton
      {...props}
      colorMode={colorScheme}
      backgroundColor={skeletonBaseColor}
      colors={[skeletonBaseColor, skeletonHighlightColor, skeletonBaseColor]}
    />
  );
}
