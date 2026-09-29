import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { pedirPermisoNotificaciones } from "../utils/notificaciones";

const queryClient = new QueryClient();
export default function RootLayout() {
  const restaurarSesion = useAuthStore((state) => state.restaurarSesion);
  const isLoading = useAuthStore((state) => state.isLoading);
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    restaurarSesion();
    pedirPermisoNotificaciones();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!accessToken}>
          <Stack.Screen name="(protected)" />
        </Stack.Protected>
        <Stack.Protected guard={!accessToken}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
