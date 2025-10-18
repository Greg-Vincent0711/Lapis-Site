/**
 * TODO
 * - implement copy, edit, delete
 */
import React, {useState} from 'react';
import type { LocationCardProps } from '../../../types/types';
import './LocationCard.css';

const LocationCard: React.FC<LocationCardProps> = ({
  name,
  type,
  x,
  y,
  z,
}) => {
  const [nether, setNether] = useState(false);

  const onCopy = () => {
    // const coordText = `${location.name}: X: ${location.x}, Y: ${location.y}, Z: ${location.z}`;
    // navigator.clipboard.writeText(coordText);
  };

  const handleEdit = () => {
    console.log('Edit location:', location);
    // Implement edit functionality
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this location?')) {
      
      // Also send delete request to backend
      // await fetch(`/api/locations/${locationId}`, { method: 'DELETE' });
    }
  };

  const toggleNether = () => setNether(!nether);


  return (
    <main className="location-card">
      <div className="location-card-header">
        <h3 className="location-card-name">{name}</h3>
        <span className="location-card-type-badge">{type}</span>
      </div>
      
      <div className="location-card-coordinates">
        <p className="location-card-coord-text">
          X: {nether ? Math.trunc(x / 8) : x} Y: {nether ? Math.trunc(y / 8) : y} Z: {nether ? Math.trunc(z / 8) : z}
        </p>
      </div>
      
      <div className="location-card-button-container">
        <button onClick={onCopy} className="location-card-button location-card-button-copy">
          <span>Copy</span>
        </button>
        
        <button onClick={handleEdit} className="location-card-button location-card-button-edit">
          <span>Edit</span>
        </button>
        
        <button onClick={handleDelete} className="location-card-button location-card-button-delete">
          <span>Delete</span>
        </button>
        
        <button onClick={toggleNether} className="location-card-button location-card-button-nether">
          <span>To Nether</span>
        </button>
      </div>
    </main>
  );
};

export default LocationCard;