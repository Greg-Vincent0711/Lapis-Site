import type { Location } from '../types/types';

type LocationWithCoords = Location & {
  coords: string;
};

function normalizeOne(location: LocationWithCoords): Location {
  const [xCoord, yCoord, zCoord] = location.coords
    .split(",")
    .map(coord => Number(coord.trim()));

  return {
    ...location,
    xCoord,
    yCoord,
    zCoord,
  };
}

export default function normalizeCoords(input: LocationWithCoords | LocationWithCoords[]): Location | Location[] {
  if (Array.isArray(input)) {
    return input.map(normalizeOne);
  }
  
  return normalizeOne(input);
}

