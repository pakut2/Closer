import { Coords } from "@types";

const EARTH_RADIUS = 6371e3;

export const crowDistance = (startCoords: Coords, targetCoords: Coords): number => {
  const phi1 = (startCoords.lat * Math.PI) / 180;
  const phi2 = (targetCoords.lat * Math.PI) / 180;
  const deltaPhi = ((targetCoords.lat - startCoords.lat) * Math.PI) / 360;
  const deltaLambda = ((targetCoords.lon - startCoords.lon) * Math.PI) / 360;

  const a =
    Math.sin(deltaPhi) * Math.sin(deltaPhi) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda) * Math.sin(deltaLambda);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c;
};
