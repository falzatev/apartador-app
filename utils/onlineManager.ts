import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";

export function configurarOnlineManager() {
  onlineManager.setEventListener((setOnline) => {
    let inicializado = false;

    const suscripcion = Network.addNetworkStateListener((state) => {
      inicializado = true;
      setOnline(!!state.isConnected);
    });

    Network.getNetworkStateAsync().then((state) => {
      if (!inicializado) {
        setOnline(!!state.isConnected);
      }
    });

    return suscripcion.remove;
  });
}
