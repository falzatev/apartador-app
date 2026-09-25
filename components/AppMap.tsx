import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet } from "react-native";

export type Coordenadas = {
  latitude: number;
  longitude: number;
};

type AppMapProps = {
  centro: Coordenadas;
  zoom: number;
  marcadores?: Array<{
    id: string;
    posicion: Coordenadas;
    titulo?: string;
  }>;
  coordenadasPolyline?: Coordenadas[];
  alTocarMapa?: (coordenadas: Coordenadas) => void;
  soloVisualizacion?: boolean;
};

function zoomARegion(centro: Coordenadas, zoom: number) {
  const delta = 360 / Math.pow(2, zoom);
  return {
    ...centro,
    latitudeDelta: delta,
    longitudeDelta: delta,
  };
}

const PADDING_BOUNDING_BOX = 1.4;
const DELTA_MINIMA = 360 / Math.pow(2, 18);

function regionDesdeCoordenadas(coordenadas: Coordenadas[]) {
  const latitudes = coordenadas.map((c) => c.latitude);
  const longitudes = coordenadas.map((c) => c.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);

  const latitudeDelta = Math.max(
    (maxLat - minLat) * PADDING_BOUNDING_BOX,
    DELTA_MINIMA,
  );
  const longitudeDelta = Math.max(
    (maxLng - minLng) * PADDING_BOUNDING_BOX,
    DELTA_MINIMA,
  );

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta,
    longitudeDelta,
  };
}

export default function AppMap({
  centro,
  zoom,
  marcadores,
  coordenadasPolyline,
  alTocarMapa,
  soloVisualizacion = false,
}: AppMapProps) {
  const region =
    coordenadasPolyline && coordenadasPolyline.length > 0
      ? regionDesdeCoordenadas(coordenadasPolyline)
      : zoomARegion(centro, zoom);
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      {...(soloVisualizacion ? { initialRegion: region } : { region })}
      onPress={(e) => alTocarMapa?.(e.nativeEvent.coordinate)}
      liteMode={soloVisualizacion}
    >
      {marcadores?.map((marcador) => (
        <Marker
          key={marcador.id}
          coordinate={marcador.posicion}
          title={marcador.titulo}
        />
      ))}
      {coordenadasPolyline && (
        <Polyline
          coordinates={coordenadasPolyline}
          strokeWidth={4}
          strokeColor="#2563eb"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
