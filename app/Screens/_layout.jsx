import { Stack } from "expo-router";

export default function ScreenLayout() {
  return <Stack>
    <Stack.Screen name="CurrentLocationMapScreen" options={{headerShown:true, headerTitle: "Select Delivery Location"}}/>
    <Stack.Screen name="ManualLocationMapScreen" options={{headerShown:true, headerTitle: "Add Address"}}/>
    <Stack.Screen name="AddAddressManually" options={{headerShown:true, headerTitle: "Add Address"}}/>

  </Stack>;
}
