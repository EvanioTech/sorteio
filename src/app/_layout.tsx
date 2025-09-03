import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="sign-in/index" />
            <Stack.Screen name="sign-up/index" />
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}