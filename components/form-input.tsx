import { Control, Controller } from "react-hook-form";
import { CrearEnvioFormData } from "../app/crear-envio";
import { StyleSheet, Text, TextInput, View } from "react-native";

type FormInputProps = {
  name: keyof CrearEnvioFormData;
  control: Control<CrearEnvioFormData>;
  placeholder: string;
};

export default function FormInput({
  name,
  control,
  placeholder,
}: FormInputProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value }, fieldState }) => (
        <View>
          <TextInput
            style={[styles.input, fieldState.error && styles.inputError]}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            placeholder={placeholder}
          />
          {fieldState.error && (
            <Text style={styles.errorText}>{fieldState.error.message}</Text>
          )}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 5,
    width: 300,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
});
