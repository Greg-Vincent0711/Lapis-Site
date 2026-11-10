import type { Location } from '../types/types';

// shape of a location as returned by GET /locations
type LocationFromDB = {
  Location_Name: string;
  Coordinates: string; // "x,y,z"
  Type: string;
  Image_URL?: string;
};

export function normalizeOne(location: LocationFromDB): Location {
  const [xCoord, yCoord, zCoord] = location.Coordinates
    .split(",")
    .map(coord => Number(coord.trim()));

  return {
    // the API has no location id; the name is the key
    id: location.Location_Name,
    location_name: location.Location_Name,
    type: location.Type,
    imageUrl: location.Image_URL,
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
