import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useEnvios } from "../context/enviosContext";

export default function Index() {
  const { enviosCreados } = useEnvios();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
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
