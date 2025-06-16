import React from 'react';
import { View } from './Themed';
import { StyleSheet, useColorScheme, useWindowDimensions } from 'react-native';
import Colors from '@/constants/Colors';
import { Skeleton } from './Skeleton';

export default function HighlightCardSkeleton() {
  const colorScheme = useColorScheme() ?? 'light';
  const themeColors = Colors[colorScheme];
  const { width } = useWindowDimensions();
  const cardWidth = Math.min(width * 0.4, 340);

  return (
    <View
      style={[
        styles.container,
        {
          width: cardWidth,
          borderColor: themeColors.borderColor,
          backgroundColor: colorScheme === 'dark' ? '#181A20' : '#FBFBFB',
        },
      ]}
    >
      <Skeleton height={100} width="100%" radius={"square"}/>
      <View style={styles.skeletonTextGroup}>
        <Skeleton height={14} width="90%" />
        <Skeleton height={14} width="70%" />
        <Skeleton height={14} width="80%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    borderRadius: 14,
    marginHorizontal: 7.5,
    borderWidth: 1,
    overflow: 'hidden',
  },
  skeletonTextGroup: {
    padding: 10,
    width: '100%',
    height: '50%',
    justifyContent: 'space-evenly',
  },
});