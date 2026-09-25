import { Control, Controller, FieldPath, FieldValues } from "react-hook-form";
import { StyleSheet, Text, TextInput, View } from "react-native";

type FormInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  placeholder: string;
  secureTextEntry?: boolean;
};

export default function FormInput<T extends FieldValues>({
  name,
  control,
  placeholder,
  secureTextEntry = false,
}: FormInputProps<T>) {
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
            secureTextEntry={secureTextEntry}
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
