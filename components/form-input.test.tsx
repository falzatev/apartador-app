import { Text } from "react-native";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react-native";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import FormInput from "./form-input";

const schema = z.object({ campo: z.string().min(1, "Obligatorio") });
type Datos = z.infer<typeof schema>;

function FormWrapper({ secureTextEntry }: { secureTextEntry?: boolean }) {
  const { control } = useForm<Datos>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: { campo: "" },
  });
  const valor = useWatch({ control, name: "campo" });

  return (
    <>
      <FormInput
        name="campo"
        control={control}
        placeholder="Escribe aquí"
        secureTextEntry={secureTextEntry}
      />
      <Text testID="valor">{valor}</Text>
    </>
  );
}

describe("FormInput", () => {
  it("muestra el error solo después de salir del campo con un valor inválido", async () => {
    await render(<FormWrapper />);
    const input = screen.getByPlaceholderText("Escribe aquí");

    expect(screen.queryByText("Obligatorio")).toBeNull();

    await fireEvent(input, "blur");

    expect(await screen.findByText("Obligatorio")).toBeOnTheScreen();
  });

  it("propaga el texto escrito al formulario", async () => {
    await render(<FormWrapper />);
    const input = screen.getByPlaceholderText("Escribe aquí");

    await fireEvent.changeText(input, "hola");

    expect(screen.getByTestId("valor")).toHaveTextContent("hola");
    expect(input).toHaveDisplayValue("hola");
  });

  it("quita el error al salir del campo con un valor válido", async () => {
    await render(<FormWrapper />);
    const input = screen.getByPlaceholderText("Escribe aquí");

    await fireEvent(input, "blur");
    expect(await screen.findByText("Obligatorio")).toBeOnTheScreen();

    await fireEvent.changeText(input, "hola");
    await fireEvent(input, "blur");

    await waitFor(() => {
      expect(screen.queryByText("Obligatorio")).toBeNull();
    });
  });

  it("no oculta el texto por defecto y lo oculta con secureTextEntry", async () => {
    const { rerender } = await render(<FormWrapper />);
    expect(
      screen.getByPlaceholderText("Escribe aquí").props.secureTextEntry,
    ).toBe(false);

    await rerender(<FormWrapper secureTextEntry />);
    expect(
      screen.getByPlaceholderText("Escribe aquí").props.secureTextEntry,
    ).toBe(true);
  });
});
