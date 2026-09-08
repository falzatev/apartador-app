const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function crearEnvio(data: {
  origen: string;
  destino: string;
  descripcion?: string;
}) {
  const response = await fetch(`${API_URL}/envios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error al crear el envío");
  }

  return response.json();
}

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  usuario: { id: string; email: string; nombre: string };
};

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const data = { email, password };
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Error intentar hacer login");
  }

  return response.json();
}
