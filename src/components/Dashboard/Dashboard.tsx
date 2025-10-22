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
 */
import React, { useState, useEffect } from 'react';
import type { Location } from '../../types/types';
import buildDiscordAuthUrl from '../../utils/OAuth';
import LocationCard from "./LocationCard/LocationCard";
import "./Dashboard.css";
const API_ENDPOINT = import.meta.env.REACT_APP_API_ENDPOINT;


export const CLIENT_ID = import.meta.env.REACT_APP_DISCORD_CLIENT_ID!;
// brings users BACK to my application
export const REDIRECT_URI = import.meta.env.REACT_APP_DISCORD_REDIRECT_URI!;
console.log(CLIENT_ID);
console.log(REDIRECT_URI);

const SavedLocationsDashboard: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const handleEdit = () => {
    // change fields to inputs
    // set changes on enter?
    // optimistically update the UI, send req to db


  };
  const handleDelete = () => {      
      // update the UI to get rid of the clicked location card
      // send a delete request to the backend
  };


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
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const testFn = () => {
    buildDiscordAuthUrl();
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <h1 className="dashboard-title">Saved Locations</h1>
          <button 
            className="oauth_button" 
            onClick={testFn}
            title="Connect to your locations saved in Discord."> 
            Connect to Discord
          </button>
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
                name={location.name}
                type={location.type}
                x={location.x}
                y={location.y}
                z={location.z}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            ))}
          </main>
        )}
      </div>
    </div>
  );
};
export default SavedLocationsDashboard;