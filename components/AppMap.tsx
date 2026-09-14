import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native";

export type Coordenadas = {
  latitude: number;
  longitude: number;
};

type AppMapProps = {
  centro: Coordenadas;
  zoom: number;
  marcadores: Array<{
    id: string;
    posicion: Coordenadas;
    titulo?: string;
  }>;
  alTocarMapa?: (coordenadas: Coordenadas) => void;
};

function zoomARegion(centro: Coordenadas, zoom: number) {
  const delta = 360 / Math.pow(2, zoom);
  return {
    ...centro,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

export default function AppMap({
  centro,
  zoom,
  marcadores,
  alTocarMapa,
}: AppMapProps) {
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      region={zoomARegion(centro, zoom)}
      onPress={(e) => alTocarMapa?.(e.nativeEvent.coordinate)}
    >
      {marcadores?.map((marcador) => (
        <Marker
          key={marcador.id}
          coordinate={marcador.posicion}
          title={marcador.titulo}
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
