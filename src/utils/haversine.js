// ─────────────────────────────────────────────────────────────────────────
// Fórmula de Haversine: calcula a distância em metros entre dois pontos
// geográficos (latitude/longitude).
// É a forma mais simples e precisa o suficiente para raios curtos (< 50km).
// ─────────────────────────────────────────────────────────────────────────
export function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Raio da Terra em metros
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distância em metros
}
