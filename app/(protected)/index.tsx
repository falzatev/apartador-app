import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useEnviosStore } from "../../store/enviosStore";
import { useAuthStore } from "../../store/authStore";

type userType = {
  id: number;
  name: string;
};

export default function Index() {
  const { data, isPending, isError, error } = useQuery<userType[]>({
    queryKey: ["users"],
    queryFn: () => {
      return fetch("https://jsonplaceholder.typicode.com/users").then((res) =>
        res.json(),
      );
      staleTime: 1000 * 60 * 5;
    },
  });
  const enviosCreados = useEnviosStore((state) => state.enviosCreados);
  const logout = useAuthStore((state) => state.logout);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <Pressable onPress={logout}>
          <Text>Cerrar sesión</Text>
        </Pressable>
        <View style={styles.userContainer}>
          {isPending ? (
            <Text>Cargando...</Text>
          ) : isError ? (
            <Text>Ocurrio un error</Text>
          ) : (
            data.map((user) => {
              return (
                <View key={user.id}>
                  <Text>{user.name}</Text>
                </View>
              );
            })
          )}
        </View>
        <Text>
          Envíos creados: <Text>{enviosCreados}</Text>
        </Text>
        <View style={styles.card}>
          <Text style={styles.title}>Envíalo</Text>
          <Text style={styles.subtitle}>Encomiendas rápidas y seguras</Text>
        </View>
        <Link href="/crear-envio" style={styles.crearEnvio}>
          Crear envío{" "}
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  userContainer: {
    backgroundColor: "#cec8c8",
    borderRadius: 12,
    overflow: "hidden",
    padding: 16,
  },
  card: {
    backgroundColor: "#cec8c8",
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    color: "#666666",
  },
  crearEnvio: {
    marginTop: 15,
  },
});
