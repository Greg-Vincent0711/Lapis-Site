/**
 * Connect to api gw with author id(grab from discord?)
 *  - we need some type of check OAuth function
 *  - creating a button to check oAuth
 * useEffect call grabs 10 different locations max
 * disable + button if more than 10 locations are used
 * map them to a state array, populate a list of cards 
 * figure out the shape of the data from the API request
 * add a button to go back to the regular page
 * edit the way the "No Locations Yet" portion looks
 * When you refresh but are authenticated, it shouldn't take
 * you back to the homescreen
 * Add a + button at the bottom to trigger a modal to add a location
 * Add some type user acknowledgement at the top that mentions their name
 * Image support through s3
 * Dashboard needs to query by email or author_ID once theyre linked
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Location } from '../../types/types';
import buildDiscordAuthUrl from '../../utils/OAuth';
import LocationCard from "./LocationCard/LocationCard";
import "./Dashboard.css";
import AddLocationModal from './AddLocationModal/AddLocationModal';
import type { NewLocationPayload } from './AddLocationModal/AddLocationModal';
// const API_ENDPOINT = import.meta.env.REACT_APP_API_ENDPOINT;


export const CLIENT_ID = import.meta.env.REACT_APP_DISCORD_CLIENT_ID!;
// brings users BACK to my application
export const REDIRECT_URI = import.meta.env.REACT_APP_DISCORD_REDIRECT_URI!;
console.log(CLIENT_ID);
console.log(REDIRECT_URI);

const SavedLocationsDashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [showAddLocation, setShowAddLocation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

  }, [])

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // await fetch(API_ENDPOINT).then((res) => {
        //   console.log(res)
        // })
        
        const mockData: Location[] = [
          { id: '1', name: 'Spawn Point', type: 'Overworld', x: 100, y: 64, z: -200 },
          { id: '2', name: 'Village', type: 'Overworld', x: 450, y: 72, z: 320 },
          { id: '3', name: 'Nether Portal', type: 'Nether', x: 56, y: 70, z: -25 },
          { id: '4', name: 'End Portal', type: 'Stronghold', x: -890, y: 42, z: 1200 },
          { id: '5', name: 'Base', type: 'Overworld', x: 1200, y: 65, z: -450 },
          { id: '6', name: 'Mine', type: 'Underground', x: 100, y: -32, z: -200 },
        ];
        
        setLocations(mockData);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const testFn = () => {
    buildDiscordAuthUrl();
  }

  const toggleAddLocation = () => setShowAddLocation((prev) => !prev);

  const handleAddLocation = (payload: NewLocationPayload) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      ...payload
    };
    setLocations((prev) => [...prev, newLocation]);
  };

  const handleImageUpload = (id: string, file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setLocations((prev) => prev.map((loc) => (loc.id === id ? { ...loc, imageUrl: objectUrl } : loc)));
  };

  const handleDelete = (id: string) => {
    setLocations((prev) => prev.filter((loc) => loc.id !== id));
  };

  const handleEdit = (id: string, updates: Pick<Location, 'name' | 'type' | 'x' | 'y' | 'z'>) => {
    setLocations((prev) => prev.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc)));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <h1 className="dashboard-title">Saved Locations</h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="back_button" 
              onClick={() => navigate('/')}
              title="Back to home">
              ← Back
            </button>
          <button 
            className="oauth_button" 
            onClick={testFn}
            title="Connect to your locations saved in Discord."> 
            Connect to Discord
          </button>
          </div>
        </nav>
        
        {locations.length === 0 ? (
          <div className="dashboard-empty-state">
            <p className="dashboard-empty-text">No saved locations yet. Start exploring!</p>
          </div>
        ) : (
          <main className="dashboard">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                id={location.id}
                name={location.name}
                type={location.type}
                x={location.x}
                y={location.y}
                z={location.z}
                onDelete={handleDelete}
                onEdit={handleEdit}
                imageUrl={location.imageUrl}
                onImageUpload={handleImageUpload}
              />
            ))}
          </main>
        )}

        <button
          className="add_location_button"
          onClick={toggleAddLocation}
          title="Add a new location"
          disabled={locations.length >= 10}
        >
          + Add Location
        </button>

        <AddLocationModal
          show={showAddLocation}
          toggle={toggleAddLocation}
          onSubmit={handleAddLocation}
        />
      </div>
    </div>
  );
};
export default SavedLocationsDashboard;