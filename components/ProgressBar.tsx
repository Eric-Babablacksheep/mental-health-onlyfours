import React from "react";
import { StyleSheet, View } from "react-native";

export interface ProgressBarProps {
  fillPercentage: number;
  color?: string;
}

export default function ProgressBar({
  fillPercentage,
  color = "#4CAF50",
}: ProgressBarProps) {
  return (
    <View style={style.bar}>
      <View
        style={[
          style.fill,
          { width: `${fillPercentage}%`, backgroundColor: color },
        ]}
      ></View>
    </View>
  );
}

const style = StyleSheet.create({
  bar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginTop: 12,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 4,
  },
});
