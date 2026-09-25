import { Coordenadas } from "../components/AppMap";

const RADIO_TIERRA_KM = 6371;

function aRadianes(grados: number): number {
  return (grados * Math.PI) / 180;
}

export function calcularDistanciaKm(a: Coordenadas, b: Coordenadas): number {
  const dLat = aRadianes(b.latitude - a.latitude);
  const dLon = aRadianes(b.longitude - a.longitude);

  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);

  const h =
    sinLat * sinLat +
    Math.cos(aRadianes(a.latitude)) *
      Math.cos(aRadianes(b.latitude)) *
      sinLon *
      sinLon;

  const c = 2 * Math.asin(Math.sqrt(h));

  return RADIO_TIERRA_KM * c;
}
