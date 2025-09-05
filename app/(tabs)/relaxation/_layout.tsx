import { Stack } from "expo-router";

export default function RelaxationLayout() {
  return (
    <Stack 
      // screenOptions={{
      //   headerShown: false,
      //   animation: 'slide_from_right',
      //   animationDuration: 200,
      // }}
    >
      <Stack.Screen 
        name="relaxationmenu" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="breathing" 
        options={{ title: "Breathing Exercise" }} 
      />
      <Stack.Screen 
        name="relaxmusic" 
        options={{ title: "Relaxing Music" }} 
      />
    </Stack>
  );
}