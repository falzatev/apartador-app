import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";
import FormInput from "../../components/form-input";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useEnviosStore } from "../../store/enviosStore";
import { crearEnvio } from "../../services/api";

const crearEnvioSchema = z.object({
  origen: z
    .string()
    .min(3, "El origen es obligatorio y debe tener mínimo 3 caracteres"),
  destino: z
    .string()
    .min(3, "El destino es obligatorio y debe tener mínimo 3 caracteres"),
  descripcion: z.string().min(1).max(200).optional().or(z.literal("")),
});

export type CrearEnvioFormData = z.infer<typeof crearEnvioSchema>;

export default function CrearEnvio() {
  const queryClient = useQueryClient();
  // const { incrementarEnvios } = useEnvios();
  const incrementarEnvios = useEnviosStore((state) => state.incrementarEnvios);
  const { control, handleSubmit, reset } = useForm<CrearEnvioFormData>({
    resolver: zodResolver(crearEnvioSchema),
    mode: "onBlur",
    defaultValues: {
      origen: "",
      destino: "",
      descripcion: "",
    },
  });

  const mutation = useMutation({
    mutationFn: crearEnvio,
    onSuccess: () => {
      incrementarEnvios();
      queryClient.invalidateQueries({ queryKey: ["envios"] });
      Alert.alert("Éxito", "Envío creado correctamente");
      reset(); // resetea el formulario, RHF te da esta función desde useForm()
    },
    onError: () => {
      Alert.alert("Error", "No se pudo crear el envío. Intenta de nuevo.");
    },
  });

  const onSubmit = (data: CrearEnvioFormData) => {
    mutation.mutate(data);
  };
  return (
    <>
      <Stack.Screen options={{ title: "Crear envío" }} />
      <View style={styles.crearEnvioContainer}>
        <View style={styles.inputView}>
          <Text>Origen: </Text>
          <FormInput
            name="origen"
            control={control}
            placeholder="Ingresar origen"
          />
        </View>
        <View style={styles.inputView}>
          <Text>Destino: </Text>
          <FormInput
            name="destino"
            control={control}
            placeholder="Ingresar destino"
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

        <View style={styles.viewButton}>
          <Button
            title={mutation.isPending ? "Guardando..." : "guardar"}
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  crearEnvioContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  inputView: { gap: 5 },
  viewButton: {
    alignSelf: "flex-start",
    marginLeft: 40,
    marginTop: 15,
  },
});
