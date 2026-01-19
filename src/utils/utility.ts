import type { Location } from '../types/types';

type LocationFromDB = Location & {
  Location_Name: string;  
  Coordinates: string;
};

export function normalizeOne(location: LocationFromDB): Location {
  const [xCoord, yCoord, zCoord] = location.Coordinates
    .split(",")
    .map(coord => Number(coord.trim()));

  return {
    ...location,
    location_name: location.Location_Name,
    xCoord,
    yCoord,
    zCoord,
  };
}

export default function normalizeCoords(input: LocationFromDB | LocationFromDB[]): Location[] {
  if (Array.isArray(input)) {
    return input.map(normalizeOne);
  }  
  return []
}

