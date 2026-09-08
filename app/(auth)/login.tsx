import { z } from "zod";
import { useAuthStore } from "../../store/authStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login as loginRequest } from "../../services/api";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { Link, Stack } from "expo-router";
import FormInput from "../../components/form-input";

export const logingSchema = z.object({
  email: z.email({ message: "Ingresa un correo válido" }),
  password: z.string().min(6, "La contraña es obligatoria"),
});

export type LoginFormData = z.infer<typeof logingSchema>;

export default function Login() {
  const setSesion = useAuthStore((state) => state.login);

  const { control, handleSubmit, reset } = useForm<LoginFormData>({
    resolver: zodResolver(logingSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LoginFormData) =>
      loginRequest(data.email, data.password),
    onSuccess: async (data) => {
      await setSesion(data.accessToken, data.refreshToken, data.usuario);
      reset();
    },
    onError: () => {
      Alert.alert("Error", "No se pudo hacer login. Intenta de nuevo.");
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <View style={styles.loginContainer}>
        <View style={styles.inputView}>
          <Text>Email: </Text>
          <FormInput
            name="email"
            control={control}
            placeholder="Ingresar email"
          />
        </View>

        <View style={styles.inputView}>
          <Text>Password: </Text>
          <FormInput
            name="password"
            control={control}
            placeholder="Ingresar password"
            secureTextEntry={true}
          />
        </View>

        <View style={styles.inputView}>
          <Text>No tienes una cuenta?</Text>
          <Link href="/register" style={styles.text}>
            Registrate
          </Link>
        </View>

        <View style={styles.viewButton}>
          <Button
            title={mutation.isPending ? "Guardando..." : "Entrar"}
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  inputView: { gap: 5 },
  viewButton: {
    alignSelf: "flex-start",
    marginLeft: 40,
    marginTop: 15,
  },
  text: {
    color: "#1b1bc2",
    textDecorationLine: "underline",
  },
});
