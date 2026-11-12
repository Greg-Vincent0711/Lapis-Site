/**
 * we need some type of check OAuth function
 * 
 * when Saved Locations is called
 * make a request to the DB. See if the author_ID can be queried for with the JWT
 * If it can, don't render Connect to Discord button
 * 
 * 
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
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Location, CoordUpdates } from '../../types/types';
import SiteNav from '../SiteNav/SiteNav';
import LocationCard from "./LocationCard/LocationCard";
import AddLocationModal from './AddLocationModal/AddLocationModal';
import buildDiscordAuthUrl from '../../utils/OAuth';
import checkTokensAndFetch, { ApiError, errorMessage } from '../../utils/checkToken';
import normalizeCoords from "../../utils/utility";
import type { NewLocationPayload } from '../../types/types';
import "./Dashboard.css";

const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;
if (!API_ENDPOINT) {
  throw new Error('VITE_APP_API_ENDPOINT is not defined');
}

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg'];

// the location name is the key in every API path
const locationUrl = (name: string) => `${API_ENDPOINT}/locations/${encodeURIComponent(name)}`;

const readFileAsDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const SavedLocationsDashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [shouldShowAddLocation, setShouldShowAddLocation] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needDiscordConnect, toggleNeedDiscordConnect] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    const getUserLocationsOnLoad = async () => {
      try {
        const retrievedAPIData = await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
          method: "GET",
          credentials: "include"
        });
        // null means there was no valid token and checkTokensAndFetch is redirecting home
        if (!retrievedAPIData) return;
        // [] is a normal empty state for a linked user
        setLocations(normalizeCoords(retrievedAPIData.locations ?? []));
        toggleNeedDiscordConnect(false);
      } catch (error) {
        setLocations([]);
        if (error instanceof ApiError && error.status === 403) {
          // Discord not linked yet: show the Connect button, no error banner
          toggleNeedDiscordConnect(true);
          return;
        }
        console.error('Failed to fetch locations:', error);
        setError(errorMessage(error, 'Failed to load locations. Please try again.'));
      }
    };
    getUserLocationsOnLoad();
  }, []); // API_ENDPOINT is a module-level constant, doesn't need to be in deps

  const toggleAddLocation = () => setShouldShowAddLocation((prev) => !prev);

  // returns the API's error message, or null on success
  const handleAddLocation = async (payload: NewLocationPayload): Promise<string | null> => {
    const { location_name, type, xCoord, yCoord, zCoord } = payload;
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify({ location_name, type, coords: `${xCoord}, ${yCoord}, ${zCoord}` }),
      });
      if (!res) return 'Your session expired. Please sign in again.';

      const savedName: string = res.location_name ?? location_name;
      setLocations((prev) => [
        ...prev,
        { id: savedName, location_name: savedName, type, xCoord, yCoord, zCoord },
      ]);
      showSuccess('Location added successfully!');
      return null;
    } catch (error) {
      console.error('handle add location failed:', error);
      // covers 409 duplicate names, 400 bad input and the 10-location limit
      return errorMessage(error, 'Failed to add location. Please try again.');
    }
  };

  const handleImageUpload = async (name: string, file: File) => {
    setError(null);
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showError('Images must be PNG or JPEG.');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      showError('Images must be 4 MB or smaller.');
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const res = await checkTokensAndFetch(`${locationUrl(name)}/img`, {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({ image_base64: dataUrl, content_type: file.type }),
      });

      if (res?.imageUrl) {
        setLocations((prev) => prev.map((loc) =>
          (loc.id === name ? { ...loc, imageUrl: res.imageUrl } : loc)
        ));
        showSuccess('Image uploaded successfully!');
      }
    } catch (error) {
      console.error('Image upload failed:', error);
      showError(errorMessage(error, 'Failed to upload image. Please try again.'));
    }
  };

  const handleImageRemove = async (name: string) => {
    setError(null);
    if (!window.confirm('Remove the image for this location?')) {
      return;
    }

    try {
      await checkTokensAndFetch(`${locationUrl(name)}/img`, {
        method: 'DELETE',
        credentials: 'include',
      });
      setLocations((prev) => prev.map((loc) =>
        (loc.id === name ? { ...loc, imageUrl: undefined } : loc)
      ));
      showSuccess('Image removed.');
    } catch (error) {
      console.error('Image removal failed:', error);
      showError(errorMessage(error, 'Failed to remove image. Please try again.'));
    }
  };

  const handleDelete = async (name: string) => {
    setError(null);
    if (!window.confirm('Are you sure you want to delete this location?')) {
      return;
    }

    try {
      await checkTokensAndFetch(locationUrl(name), {
        method: 'DELETE',
        credentials: 'include',
      });
      setLocations((prev) => prev.filter((loc) => loc.id !== name));
      showSuccess('Location deleted successfully!');
    } catch (error) {
      console.error('Delete failed:', error);
      showError(errorMessage(error, 'Failed to delete location. Please try again.'));
    }
  };

  const handleEdit = async (name: string, updates: CoordUpdates) => {
    setError(null);
    setSuccessMessage(null);

    try {
      const { xCoord, yCoord, zCoord } = updates;
      await checkTokensAndFetch(locationUrl(name), {
        method: 'PUT',
        credentials: 'include',
        body: JSON.stringify({ coords: `${xCoord}, ${yCoord}, ${zCoord}` }),
      });

      setLocations((prev) => prev.map((loc) => (loc.id === name ? { ...loc, ...updates } : loc)));
      showSuccess('Location updated successfully!');
    } catch (error) {
      console.error('Edit failed:', error);
      showError(errorMessage(error, 'Failed to update location. Please try again.'));
    }
  };

  return (
    <div className="dashboard-container">
      {/* top app bar on tablet/phone; desktop uses the back button below */}
      <SiteNav page="dashboard" />
      <div className="dashboard-content">
        <Link to="/" className="back_button dashboard-back">
          <span aria-hidden="true">←</span> Back to Home
        </Link>
        <nav className="dashboard-nav">
          <h1 className="dashboard-title">Saved Locations</h1>
          {needDiscordConnect && (
            <button 
              className="oauth_button" 
              onClick={buildDiscordAuthUrl}
              title="Connect to your locations saved in Discord."> 
              Connect to Discord
          </button>
          )}
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
            <p className="dashboard-empty-text">
              {needDiscordConnect
                ? 'Connect to Discord to see your saved locations.'
                : 'No saved locations yet. Add one to start exploring!'}
            </p>
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
                onImageRemove={handleImageRemove}
              />
            ))}
          </main>
        )}

        <button
          className="add_location_button"
          onClick={toggleAddLocation}
          title="Add a new location"
          disabled={needDiscordConnect || locations.length >= 10}
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