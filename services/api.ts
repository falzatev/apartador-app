import axios from "axios";
import { useAuthStore } from "../store/authStore";
import { Coordenadas } from "../components/AppMap";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Variable compartida a nivel de módulo — esta es la pieza clave
let refreshPromise: Promise<string> | null = null;

async function refrescarToken(): Promise<string> {
  const refreshToken = useAuthStore.getState().refreshToken;
  const { data } = await axios.post(`${API_URL}/auth/refresh`, {
    refreshToken,
  });

  const usuarioActual = useAuthStore.getState().usuario;
  await useAuthStore
    .getState()
    .login(data.accessToken, data.refreshToken, usuarioActual!);

  return data.accessToken;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Si ya hay un refresh en curso, reutiliza esa misma promise.
        // Si no, inicia uno nuevo y guárdalo.
        if (!refreshPromise) {
          refreshPromise = refrescarToken();
        }
        const newAccessToken = await refreshPromise;
        refreshPromise = null;

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

type UbicacionEnvio = {
  direccion: string;
  coordenadas: { latitude: number; longitude: number };
};

export async function crearEnvio(data: {
  origen: UbicacionEnvio;
  destino: UbicacionEnvio;
  descripcion?: string;
}) {
  // const response = await fetch(`${API_URL}/envios`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) {
  //   throw new Error("Error al crear el envío");
  // }
  const { data: response } = await api.post<{ id: string }>("/envios", data);

  return response;
}

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  usuario: { id: string; email: string; nombre: string };
};

type UbicacionRepartidorResponse = {
  posicion: {
    latitude: number;
    longitude: number;
  };
  progreso: number;
  completado: boolean;
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  // const data = { email, password };
  // const response = await fetch(`${API_URL}/auth/login`, {
  //   method: "POST",
  //   headers: { "Content-type": "application/json" },
  //   body: JSON.stringify(data),
  // });
  // if (!response.ok) {
  //   throw new Error("Error intentar hacer login");
  // }

  const { data } = await api.post("/auth/login", { email, password });

  return data;
}

export async function calcularRuta(origen: Coordenadas, destino: Coordenadas) {
  const data = {
    origen,
    destino,
  };

  const { data: response } = await api.post("/rutas/calcular", data);

  return response;
}

export async function obtenerUbicacionRepartidor(
  id: string,
): Promise<UbicacionRepartidorResponse> {
  const { data: response } = await api.get<UbicacionRepartidorResponse>(
    `/envios/${id}/ubicacion-repartidor`,
  );
  return response;
}
