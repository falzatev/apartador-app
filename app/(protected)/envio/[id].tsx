import { Stack, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import {
  marcarEntregado,
  obtenerUbicacionRepartidor,
} from "../../../services/api";
import AppMap from "../../../components/AppMap";
import { notificarEnvioEntregado } from "../../../utils/notificaciones";

export default function SeguimientoEnvio() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: tracking,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["tracking", id],
    queryFn: () => obtenerUbicacionRepartidor(id),
    enabled: !!id,
    refetchInterval: (query) => {
      return query.state.data?.completado ? false : 3000;
    },
  });

  const mutation = useMutation({
    mutationFn: marcarEntregado,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tracking", id] });
      queryClient.invalidateQueries({ queryKey: ["envios"] });
      await notificarEnvioEntregado();
    },
    onError: () => {
      Alert.alert("Error", "No se pudo marcar el envío como entregado.");
    },
  });

  return (
    <>
      <Stack.Screen options={{ title: "Seguimiento del envío" }} />
      <View style={styles.container}>
        {isPending ? (
          <ActivityIndicator size="large" style={styles.centrado} />
        ) : isError ? (
          <Text style={styles.centrado}>
            No se pudo obtener la ubicación del repartidor.
          </Text>
        ) : (
          <>
            <View style={styles.mapa}>
              <AppMap
                centro={tracking.posicion}
                zoom={15}
                marcadores={[
                  {
                    id: "repartidor",
                    posicion: tracking.posicion,
                    titulo: "Repartidor",
                  },
                ]}
              />
            </View>
            <View style={styles.info}>
              <Text>Progreso: {(tracking.progreso * 100).toFixed(0)}%</Text>
              {tracking.completado && tracking.estado !== "entregado" && (
                <Pressable
                  style={styles.botonPressable}
                  onPress={() => mutation.mutate(id)}
                  disabled={mutation.isPending}
                >
                  <Text>Marcar como entregado</Text>
                </Pressable>
              )}
            </View>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centrado: { flex: 1, alignSelf: "center", textAlignVertical: "center" },
  mapa: { flex: 1 },
  info: { padding: 16, gap: 4 },
  botonPressable: { marginBottom: 26 },
});
