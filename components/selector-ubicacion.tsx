import {
  Control,
  FieldValues,
  FieldPath,
  useController,
} from "react-hook-form";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import AppMap, { Coordenadas } from "./AppMap";
import { useState } from "react";

type SelectorUbicacionProps<T extends FieldValues> = {
  name: FieldPath<T>;
  control: Control<T>;
  etiqueta: string;
};

function formatearDireccion(
  resultado: Location.LocationGeocodedAddress | undefined,
  coordenadas: Coordenadas,
) {
  const partes = [
    [resultado?.street, resultado?.streetNumber].filter(Boolean).join(" "),
    resultado?.city,
  ].filter(Boolean);

  // El backend exige mínimo 3 caracteres: si no hay dirección, usamos las coordenadas
  return partes.length > 0
    ? partes.join(", ")
    : `${coordenadas.latitude.toFixed(5)}, ${coordenadas.longitude.toFixed(5)}`;
}

export default function SelectorUbicacion<T extends FieldValues>({
  name,
  control,
  etiqueta,
}: SelectorUbicacionProps<T>) {
  const {
    field: { onChange, value },
    fieldState,
  } = useController({ name, control });
  const [cargando, setCargando] = useState(false);

  async function actualizarValor(coordenadas: Coordenadas) {
    setCargando(true);
    try {
      let resultado: Location.LocationGeocodedAddress | undefined;
      try {
        [resultado] = await Location.reverseGeocodeAsync(coordenadas);
      } catch {
        // Sin geocodificación seguimos con las coordenadas
      }
      onChange({
        direccion: formatearDireccion(resultado, coordenadas),
        coordenadas,
      });
    } finally {
      setCargando(false);
    }
  }

  async function usarUbicacionActual() {
    setCargando(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso necesario", "Necesitamos acceso a tu ubicación.");
        return;
      }
      const posicion = await Location.getCurrentPositionAsync({});
      await actualizarValor({
        latitude: posicion.coords.latitude,
        longitude: posicion.coords.longitude,
      });
    } catch {
      Alert.alert("Error", "No se pudo obtener tu ubicación.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text>{etiqueta}</Text>
      <Pressable onPress={usarUbicacionActual} disabled={cargando}>
        <Text>Usar mi ubicación actual</Text>
      </Pressable>

      {(cargando || value?.coordenadas) && (
        <View style={styles.mapa}>
          {cargando ? (
            <ActivityIndicator size="large" />
          ) : (
            <AppMap
              centro={value.coordenadas}
              zoom={16}
              marcadores={[{ id: name, posicion: value.coordenadas }]}
              alTocarMapa={actualizarValor}
            />
          )}
        </View>
      )}

      {value?.direccion && <Text>{value.direccion}</Text>}
      {fieldState.error && (
        <Text style={styles.error}>Selecciona una ubicación válida</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 8, marginBottom: 16, width: 250 },
  mapa: { height: 200, width: 250 },
  error: { color: "red", fontSize: 12 },
});
