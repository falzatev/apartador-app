import { useAuthStore } from "./authStore";
import * as SecureStore from "expo-secure-store";

jest.mock("expo-secure-store", () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      usuario: null,
      accessToken: null,
      refreshToken: null,
      isLoading: true,
    });
    jest.resetAllMocks();
  });

  it("Login guarda el usuario y los tokens en el estado", async () => {
    const usuario = { id: "1", email: "test@test.com", nombre: "Test" };

    await useAuthStore.getState().login("access-123", "refresh-456", usuario);

    const estado = useAuthStore.getState();
    expect(estado.accessToken).toBe("access-123");
    expect(estado.usuario).toEqual(usuario);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "accessToken",
      "access-123",
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-456",
    );
  });

  it("logout limpia el usuario y los tokens", async () => {
    const usuario = { id: "1", email: "test@test.com", nombre: "Test" };

    await useAuthStore.getState().login("access-123", "refresh-456", usuario);

    await useAuthStore.getState().logout();
    const estado = useAuthStore.getState();

    expect(estado.accessToken).toBe(null);
    expect(estado.refreshToken).toBe(null);
    expect(estado.usuario).toBe(null);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("accessToken");
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("refreshToken");
  });

  it("restaurarSesion carga los tokens guardados y termina la carga", async () => {
    const almacenados: Record<string, string> = {
      accessToken: "access-guardado",
      refreshToken: "refresh-guardado",
    };

    jest
      .mocked(SecureStore.getItemAsync)
      .mockImplementation(async (key) => almacenados[key] ?? null);

    await useAuthStore.getState().restaurarSesion();
    const estado = useAuthStore.getState();
    expect(estado.isLoading).toBe(false);
    expect(estado.accessToken).toBe(almacenados.accessToken);
    expect(estado.refreshToken).toBe(almacenados.refreshToken);
  });
});
