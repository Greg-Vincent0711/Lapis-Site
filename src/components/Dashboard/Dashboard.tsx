/**
 * useEffect call grabs 10 different locations
 * map them to a state array, populate a list of cards 
 * Connect to api gw with author id(grab from discord?)
 * figure out the shape of the data from the API request
 */
import React, { useState, useEffect } from 'react';
import type { Location } from '../../types/types';
import LocationCard from "./LocationCard/LocationCard"
import "./Dashboard.css"

const SavedLocationsDashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Replace with your actual API endpoint
        // const response = await fetch('/api/locations');
        // const data = await response.json();
        // setLocations(data);
        
        // Mock data for demonstration
        const mockData: Location[] = [
          { id: '1', name: 'Spawn Point', type: 'Overworld', x: 100, y: 64, z: -200 },
          { id: '2', name: 'Village', type: 'Overworld', x: 450, y: 72, z: 320 },
          { id: '3', name: 'Nether Portal', type: 'Nether', x: 56, y: 70, z: -25 },
          { id: '4', name: 'End Portal', type: 'Stronghold', x: -890, y: 42, z: 1200 },
          { id: '5', name: 'Base', type: 'Overworld', x: 1200, y: 65, z: -450 },
          { id: '6', name: 'Mine', type: 'Underground', x: 100, y: -32, z: -200 },
        ];
        
        setLocations(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">Saved Locations</h1>
        
        {locations.length === 0 ? (
          <div className="dashboard-empty-state">
            <p className="dashboard-empty-text">No saved locations yet. Start exploring!</p>
          </div>
        ) : (
          <div className="dashboard">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                name={location.name}
                type={location.type}
                x={location.x}
                y={location.y}
                z={location.z}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default SavedLocationsDashboard;