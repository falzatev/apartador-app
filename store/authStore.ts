import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

type Usuario = {
  id: string;
  email: string;
  nombre: string;
};

type AuthStore = {
  usuario: Usuario | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  login: (
    accessToken: string,
    refreshToken: string,
    usuario: Usuario,
  ) => Promise<void>;
  logout: () => Promise<void>;
  restaurarSesion: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  usuario: null,
  accessToken: null,
  refreshToken: null,
  isLoading: true,

  login: async (accessToken, refreshToken, usuario) => {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", refreshToken);
    set({ accessToken, refreshToken, usuario });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    set({ accessToken: null, refreshToken: null, usuario: null });
  },

  restaurarSesion: async () => {
    const accessToken = await SecureStore.getItemAsync("accessToken");
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    set({ accessToken, refreshToken, isLoading: false });
  },
}));
