/**
 * we need some type of check OAuth function
 * 
 * when Saved Locations is called
 * make a request to the DB. See if the author_ID can be queried for with the JWT
 * If it can, don't render Connect to Discord button
 * 
 * 
 * useEffect call grabs 10 different locations max
 * 
 * disable + button if more than 10 locations are used
 * 
 * map them to a state array, populate a list of cards 
 * figure out the shape of the data from the API request
 * 
 * When you refresh but are authenticated, it shouldn't take
 * you back to the homescreen
 * Add some type user acknowledgement at the top that mentions their name
 * Image support through s3
 * Frontend should be able to add - coordinates
 */
import React, { useState, useEffect } from 'react';
import type { Location } from '../../types/types';
// import useAuth from '../../context/useAuth';
// import buildDiscordAuthUrl from '../../utils/OAuth';
import LocationCard from "./LocationCard/LocationCard";
import AddLocationModal from './AddLocationModal/AddLocationModal';
import checkTokensAndFetch from '../../utils/checkToken';
import normalizeCoords from "../../utils/utility";
import type { NewLocationPayload } from '../../types/types';
import { v4 as uuidv4 } from 'uuid';
import { fetchAuthSession } from '@aws-amplify/auth';
import "./Dashboard.css";

const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;
if (!API_ENDPOINT) {
  throw new Error('VITE_APP_API_ENDPOINT is not defined');
}

export const CLIENT_ID = import.meta.env.VITE_APP_DISCORD_CLIENT_ID!;
export const REDIRECT_URI = import.meta.env.VITE_APP_DISCORD_REDIRECT_URI!;

const SavedLocationsDashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [shouldShowAddLocation, setShouldShowAddLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  // jwt from cognito
  // const {jwtToken} = useAuth();

  useEffect(() => {
    const getUserLocationsOnLoad = async () => {
      try {
        const retrievedAPIData = await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
          method: "GET",
          credentials: "include"
        });      
        //
        console.log("retrieved locations", retrievedAPIData.locations)    
        const userLocations: Location[] = normalizeCoords(retrievedAPIData.locations);
        console.log(userLocations)
        setLocations(userLocations);
        } catch (error) {
        console.error('Failed to fetch locations:', error);
        setError('Failed to load locations. Please try again.');
        setLocations([]);
      }
    };
    getUserLocationsOnLoad();
  }, []); // API_ENDPOINT is a module-level constant, doesn't need to be in deps

  const toggleAddLocation = () => setShouldShowAddLocation((prev) => !prev);
  /**
     * newLocation data example: 
     * {"id":"1765129213053","location_name":"test","type":"test","xCoord":0,"yCoord":64,"zCoord":0}
     */
  const handleAddLocation = async (payload: NewLocationPayload) => {
    const { xCoord, yCoord, zCoord, ...rest } = payload;
    setError(null);
    setSuccessMessage(null);
    
    // we need to change newLocation for the DB
    const newLocFormatted_DB = {
      id: uuidv4(),
      ...rest,
      coords: `${xCoord}, ${yCoord}, ${zCoord}`
    };

    try {
      const res = await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(newLocFormatted_DB),
      });
    
      if (res) {
        const newLocation: Location = {
            id: Date.now().toString(),
            location_name: payload.location_name,
            type: payload.type,
            xCoord: payload.xCoord,
            yCoord: payload.yCoord,
            zCoord: payload.zCoord,
          }
        setLocations((prev) => [...prev, newLocation]);
        setSuccessMessage('Location added successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('handle add location failed:', error);
      setError('Failed to add location. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('locationId', id);
      
      // For FormData, we need to get the token manually and not use checkTokensAndFetch
      // since it sets Content-Type to application/json
      const session = await fetchAuthSession({ forceRefresh: true });
      const idToken = session.tokens?.idToken?.toString();
      
      if (!idToken) {
        throw new Error('No valid authentication token');
      }
      
      const response = await fetch(`${API_ENDPOINT}/locations/${id}/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
        },
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(errorBody.error || `Upload failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result?.imageUrl) {
        setLocations((prev) => prev.map((loc) => 
          (loc.id === id ? { ...loc, imageUrl: result.imageUrl } : loc)
        ));
        setSuccessMessage('Image uploaded successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      setError('Failed to upload image. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDelete = async (locationId: string) => {
    setError(null);
    if (!window.confirm('Are you sure you want to delete this location?')) {
      return;
    }
    
    try {
      await checkTokensAndFetch(`${API_ENDPOINT}/locations/${locationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
      setSuccessMessage('Location deleted successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete location. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleEdit = async (id: string, updates: Pick<Location, 'location_name' | 'type' | 'xCoord' | 'yCoord' | 'zCoord'>) => {
    setError(null);
    setSuccessMessage(null);
    
    try {
      const { xCoord, yCoord, zCoord, ...rest } = updates;
      const locationForDB = {
        id,
        ...rest,
        coords: `${xCoord}, ${yCoord}, ${zCoord}`
      };
      
      await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify(locationForDB),
      });
      
      setLocations((prev) => prev.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc)));
      setSuccessMessage('Location updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Edit failed:', error);
      setError('Failed to update location. Please try again.');
      setTimeout(() => setError(null), 5000);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <h1 className="dashboard-title">Saved Locations</h1>
        </nav>
        
        {error && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#ff4444', 
            color: 'white', 
            borderRadius: '4px',
            margin: '12px 0'
          }}>
            {error}
          </div>
        )}
        
        {successMessage && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#44ff44', 
            color: 'white', 
            borderRadius: '4px',
            margin: '12px 0'
          }}>
            {successMessage}
          </div>
        )}
        
        {locations.length === 0 ? (
          <div className="dashboard-empty-state">
            <p className="dashboard-empty-text">No saved locations yet. Connect to Discord and start exploring!</p>
          </div>
        ) : (
          <main className="dashboard">
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                id={location.id}
                location_name={location.location_name}
                type={location.type}
                xCoord={location.xCoord}
                yCoord={location.yCoord}
                zCoord={location.zCoord}
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
          Add Location
        </button>

        <AddLocationModal
          shouldShow={shouldShowAddLocation}
          toggle={toggleAddLocation}
          onSubmit={handleAddLocation}
        />
      </div>
    </div>
  );
};
export default SavedLocationsDashboard;