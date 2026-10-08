import { calcularDistanciaKm } from "./distancia";

const BOGOTA = { latitude: 4.711, longitude: -74.0721 };
const MEDELLIN = { latitude: 6.2442, longitude: -75.5812 };

describe("calcularDistanciaKm", () => {
  it("devuelve 0 cuando los dos puntos son iguales", () => {
    expect(calcularDistanciaKm(BOGOTA, BOGOTA)).toBe(0);
  });

  it("calcula la distancia entre Bogotá y Medellín", () => {
    expect(calcularDistanciaKm(BOGOTA, MEDELLIN)).toBeCloseTo(239, -1);
  });

  it("es simétrica", () => {
    expect(calcularDistanciaKm(BOGOTA, MEDELLIN)).toBeCloseTo(
      calcularDistanciaKm(MEDELLIN, BOGOTA),
      10,
    );
  });

  it("un grado de latitud equivale a ~111.19 km", () => {
    const a = { latitude: 0, longitude: 0 };
    const b = { latitude: 1, longitude: 0 };

    expect(calcularDistanciaKm(a, b)).toBeCloseTo(111.19, 1);
  });

  it("un grado de longitud se acorta al alejarse del ecuador", () => {
    const enEcuador = calcularDistanciaKm(
      { latitude: 0, longitude: 0 },
      { latitude: 0, longitude: 1 },
    );
    const a60Grados = calcularDistanciaKm(
      { latitude: 60, longitude: 0 },
      { latitude: 60, longitude: 1 },
    );

    expect(a60Grados).toBeCloseTo(enEcuador / 2, 1);
  });

  it("cruza el antimeridiano por el camino corto", () => {
    const a = { latitude: 0, longitude: 179.5 };
    const b = { latitude: 0, longitude: -179.5 };

    expect(calcularDistanciaKm(a, b)).toBeCloseTo(111.19, 1);
  });
});
