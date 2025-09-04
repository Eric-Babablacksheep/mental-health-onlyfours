import { CanContext } from "@/components/CanProvider";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useContext } from "react";
import { Button, StyleSheet } from "react-native";

export default function Pet() {
  const [can, setCan] = useContext(CanContext);

  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{can}</ThemedText>
        <Button
          title="Increase can."
          onPress={() => {
            setCan((prev) => prev + 1);
          }}
        ></Button>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
