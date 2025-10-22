/**
 * TODO
 * - visual cue when copy button are pressed
 * - implement necessary forms/inputs for editing, probably a modal component
 * - add API endpoint to gw, set that up so that editing/deleting fields work, etc
 */
import React, {useState, useEffect} from 'react';
import type { LocationCardProps } from '../../../types/types';
import './LocationCard.css';

const LocationCard: React.FC<LocationCardProps> = ({
  name,
  type,
  x,
  y,
  z,
  handleDelete,
  handleEdit
}) => {
  const [isNether, setIsNether] = useState(false);
  const [didCopy, setDidCopy] = useState(false);

  const onCopy = () => {
    setDidCopy(true)
    navigator.clipboard.writeText(`${name}: X: ${x}, Y: ${y}, Z: ${z}`);
  };
  const netherHoverText = `Convert coordinates\nbetween Nether and Overworld`

  const toggleNether = () => setIsNether(!isNether);

  useEffect(() => {
    setTimeout(() => {
      setDidCopy(false)
    }, 2000)
  }, [didCopy])

  return (
    <main className="location-card">
      <div className="location-card-header">
        <h3 className="location-card-name">{name}</h3>
        <span className="location-card-type-badge">{type}</span>
      </div>
      
      <div className="location-card-coordinates">
        <p className="location-card-coord-text">
          X: {isNether ? Math.trunc(x / 8) : x} Y: {isNether ? Math.trunc(y / 8) : y} Z: {isNether ? Math.trunc(z / 8) : z}
        </p>
      </div>
      
      <div className="location-card-button-container">
        <button onClick={onCopy} className="location-card-button location-card-button-copy">
          <span>{ didCopy ?  "✔" : "Copy"}</span>
        </button>
        
        <button onClick={handleEdit} className="location-card-button location-card-button-edit">
          <span>Edit</span>
        </button>
        
        <button onClick={handleDelete} className="location-card-button location-card-button-delete">
          <span>Delete</span>
        </button>
        
        <button onClick={toggleNether} title={netherHoverText} className="location-card-button location-card-button-nether">
          <span>{isNether ? "To Overworld": "To Nether"}</span>
        </button>
      </div>
    </main>
  );
};

export default LocationCard;