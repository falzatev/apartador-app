import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, useRouter } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { z } from "zod";
import FormInput from "../../components/form-input";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useEnviosStore } from "../../store/enviosStore";
import { calcularRuta, crearEnvio } from "../../services/api";
import SelectorUbicacion from "../../components/selector-ubicacion";
import { calcularDistanciaKm } from "../../utils/distancia";
import AppMap from "../../components/AppMap";

const coordenadasSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

const ubicacionSchema = z.object({
  direccion: z.string().min(3, "La dirección es obligatoria"),
  coordenadas: coordenadasSchema,
});

const crearEnvioSchema = z.object({
  origen: ubicacionSchema,
  destino: ubicacionSchema,
  descripcion: z.string().min(1).max(200).optional().or(z.literal("")),
});

export type CrearEnvioFormData = z.infer<typeof crearEnvioSchema>;

export default function CrearEnvio() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const incrementarEnvios = useEnviosStore((state) => state.incrementarEnvios);
  const { control, handleSubmit, reset } = useForm<CrearEnvioFormData>({
    resolver: zodResolver(crearEnvioSchema),
    mode: "onBlur",
    defaultValues: {
      origen: { direccion: "", coordenadas: undefined },
      destino: { direccion: "", coordenadas: undefined },
      descripcion: "",
    },
  });

  const mutation = useMutation({
    mutationFn: crearEnvio,
    onSuccess: (envio) => {
      incrementarEnvios();
      queryClient.invalidateQueries({ queryKey: ["envios"] });
      reset(); // resetea el formulario, RHF te da esta función desde useForm()
      router.replace(`/envio/${envio.id}`);
    },
    onError: () => {
      Alert.alert("Error", "No se pudo crear el envío. Intenta de nuevo.");
    },
  });

  const origen = useWatch({ control, name: "origen" });
  const destino = useWatch({ control, name: "destino" });

  const {
    data: ruta,
    isPending: calculandoRuta,
    isError: errorRuta,
  } = useQuery({
    queryKey: ["ruta", origen?.coordenadas, destino?.coordenadas],
    queryFn: () => calcularRuta(origen!.coordenadas, destino!.coordenadas),
    enabled: !!origen?.coordenadas && !!destino?.coordenadas,
  });

  const puntoMedio = ruta?.geometria[Math.floor(ruta.geometria.length / 2)];

  const distanciaEstimada =
    origen?.coordenadas && destino?.coordenadas
      ? calcularDistanciaKm(origen.coordenadas, destino.coordenadas)
      : null;

  const onSubmit = (data: CrearEnvioFormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Crear envío" }} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.crearEnvioContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputView}>
          <SelectorUbicacion
            name="origen"
            control={control}
            etiqueta="Origen"
          />
        </View>
        <View style={styles.inputView}>
          <SelectorUbicacion
            name="destino"
            control={control}
            etiqueta="Destino"
          />
        </View>
        <View style={styles.inputView}>
          <Text>Descripción: </Text>
          <FormInput
            name="descripcion"
            control={control}
            placeholder="Ingresar descripción"
          />
        </View>
        {ruta && puntoMedio && (
          <View style={styles.mapaRutaView}>
            <AppMap
              centro={puntoMedio}
              zoom={14}
              marcadores={[
                { id: "origen", posicion: origen.coordenadas },
                { id: "destino", posicion: destino.coordenadas },
              ]}
              coordenadasPolyline={ruta.geometria}
              soloVisualizacion={true}
            />
          </View>
        )}
        <View style={styles.inputView}>
          {distanciaEstimada !== null && (
            <Text>Distancia estimada: {distanciaEstimada.toFixed(1)} km</Text>
          )}
        </View>

        <View style={styles.viewButton}>
          {mutation.isPaused && (
            <Text style={styles.avisoOffline}>
              Sin conexión — tu envío se enviará automáticamente cuando vuelvas
              a tener internet.
            </Text>
          )}
          <Button
            title={
              mutation.isPaused
                ? "Esperando conexión..."
                : mutation.isPending
                  ? "Guardando..."
                  : "guardar"
            }
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  crearEnvioContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  inputView: { gap: 5 },
  mapaRutaView: {
    alignSelf: "stretch",
    height: 250,
    marginBottom: 16,
  },
  viewButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginTop: 15,
  },
  avisoOffline: {
    color: "#b10909",
  },
});
