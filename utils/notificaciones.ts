import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function pedirPermisoNotificaciones() {
  const { status: statusActual } = await Notifications.getPermissionsAsync();

  let statusFinal = statusActual;
  if (statusActual !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    statusFinal = status;
  }

  return statusFinal === "granted";
}

export async function notificarEnvioEntregado() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "¡Envío entregado!",
      body: "Tu paquete llegó a su destino.",
    },
    trigger: null, // null = disparar inmediatamente
  });
}
