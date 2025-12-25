/**
 * we need some type of check OAuth function
 * 
 * when Saved Locations is called
 * make a request to the DB. See if the author_ID can be queried for with the JWT
 * If it can, don't render Connect to Discord button
 * 
 * 
 * useEffect call grabs 10 different locations max
 * disable + button if more than 10 locations are used
 * map them to a state array, populate a list of cards 
 * figure out the shape of the data from the API request
 * When you refresh but are authenticated, it shouldn't take
 * you back to the homescreen
 * Add some type user acknowledgement at the top that mentions their name
 * Image support through s3
 * Frontend should be able to add - coordinates
 */
import React, { useState, useEffect } from 'react';
import type { Location } from '../../types/types';
import useAuth from '../../context/useAuth';
import buildDiscordAuthUrl from '../../utils/OAuth';
import LocationCard from "./LocationCard/LocationCard";
import AddLocationModal from './AddLocationModal/AddLocationModal';
import checkTokensAndFetch from '../../utils/checkToken';
import type { NewLocationPayload } from '../../types/types';
import "./Dashboard.css";

const API_ENDPOINT = import.meta.env.VITE_APP_API_ENDPOINT;
export const CLIENT_ID = import.meta.env.REACT_APP_DISCORD_CLIENT_ID!;
export const REDIRECT_URI = import.meta.env.REACT_APP_DISCORD_REDIRECT_URI!;

const SavedLocationsDashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [shouldShowAddLocation, setShouldShowAddLocation] = useState(false);
  // jwt from cognito
  const {jwtToken} = useAuth();
  useEffect(() => {
    /**
     * 
     */
    const getUserLocationsOnLoad = async () => {
      try {
        await fetch(`${API_ENDPOINT}/locations`, {
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `${jwtToken}`},
          credentials: 'include',
      }).then((res) => {
        res.json();
      }).then((userData => {
        // setLocations(userData) once you have the shape
          console.log("User's data", userData)
      })) 
        // setLocations(mockData);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
      }
    }
    getUserLocationsOnLoad();
  }, []);

  const toggleAddLocation = () => setShouldShowAddLocation((prev) => !prev);

  const handleAddLocation = async (payload: NewLocationPayload) => {
    const newLocation: Location = {
      id: Date.now().toString(),
      ...payload
    };
    /**
     * newLocation data example: 
     * {"id":"1765129213053","name":"test","type":"test","xCoord":0,"yCoord":64,"zCoord":0}
     */

    try {
      console.log("Current JWT", jwtToken)
      if(jwtToken){
        const payload = JSON.parse(atob(jwtToken.split('.')[1]))
        console.log(payload.exp * 1000 < Date.now());
      }
    //   const data = await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
    //     method: "POST",
    //     body: JSON.stringify(newLocation),
    // });

      const res = await checkTokensAndFetch(`${API_ENDPOINT}/locations`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(newLocation),
      });
      
      console.log(res)
      // handle HTTP errors explicitly
      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.error || `Request failed: ${res.status}`);
      }
    
      const data = await res.json();
      // add to table for user
      console.log(data);
    
    } catch (error) {
      console.error('Create location failed:', error);
    }
    
  };

  const handleImageUpload = (id: string, file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setLocations((prev) => prev.map((loc) => (loc.id === id ? { ...loc, imageUrl: objectUrl } : loc)));
  };

  const handleDelete = async (locationName: string) => {
    // try{
    //   await fetch(`${API_ENDPOINT}/locations/${locationName}`, {
    //     method: 'DELETE',
    //     headers: { 
    //         'Content-Type': 'application/json',
    //         'Authorization': authToken
    //     },
    //     credentials: 'include',
    //   }) 
    // } catch(error){
    //   console.error(error)
    // }
  };

  const handleEdit = async (id: string, updates: Pick<Location, 'name' | 'type' | 'xCoord' | 'yCoord' | 'zCoord'>) => {
    // try{
    //   await fetch(`${API_ENDPOINT}/locations`, {
    //     method: 'PUT',
    //     headers: { 
    //         'Content-Type': 'application/json',
    //         'Authorization': authToken
    //     },
    //     credentials: 'include',
    //     body: JSON.stringify(newLocation)
    //   }).then((res) => res.json()).then((test) => {
            // add to table for user
            // setLocations((prev) => [...prev, newLocation]);
    //   })
    // } catch(error){
    //   console.error(error)
    // }
    setLocations((prev) => prev.map((loc) => (loc.id === id ? { ...loc, ...updates } : loc)));
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <h1 className="dashboard-title">Saved Locations</h1>
          {
            <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              className="oauth_button" 
              onClick={buildDiscordAuthUrl}
              title="Connect to your locations saved in Discord."> 
              Connect to Discord
            </button>
          </div>
          }
        </nav>
        
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
                name={location.name}
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