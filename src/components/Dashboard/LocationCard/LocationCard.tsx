/**
 * TODO
 * - visual cue when copy button are pressed
 * - implement necessary forms/inputs for editing, probably a modal component
 * - add API endpoint to gw, set that up so that editing/deleting fields work, etc
 */
import React, {useState, useEffect, useRef} from 'react';
import type { LocationCardProps } from '../../../types/types';
import './LocationCard.css';

const LocationCard: React.FC<LocationCardProps> = ({
  id,
  location_name,
  type,
  xCoord,
  yCoord,
  zCoord,
  onDelete,
  onEdit,
  imageUrl,
  onImageUpload
}) => {
  const [isNether, setIsNether] = useState(false);
  const [didCopy, setDidCopy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ location_name, type, xCoord, yCoord, zCoord});
  const netherHoverText = `Convert coordinates\nbetween Nether and Overworld`

  const onCopy = () => {
    setDidCopy(true)
    navigator.clipboard.writeText(`${location_name} - ${xCoord} ${yCoord} ${zCoord}`);
  };

  const toggleNether = () => setIsNether(!isNether);

  useEffect(() => {
    // keep prop values in sync
    setEditValues({ location_name, type, xCoord, yCoord, zCoord});
  }, [location_name, type, xCoord, yCoord, zCoord]);

  useEffect(() => {
    setTimeout(() => {
      setDidCopy(false)
    }, 2000)
  }, [didCopy])

  return (
    <main className="location-card">
      <div className="location-card-header">
        <h3
          className={`location-card-name ${imageUrl ? 'location-card-name--image' : ''}`}
          onClick={() => {
            if (imageUrl) {
              window.open(imageUrl, '_blank');
            }
          }}
          title={imageUrl ? 'Open image in new tab' : undefined}
        >
          {isEditing ? (
            <input
              className="location-card-input"
              value={editValues.location_name}
              onChange={(e) => setEditValues((prev) => ({ ...prev, location_name: e.target.value }))}
            />
          ) : (
            location_name
          )}
        </h3>
        {isEditing ? (
          <input
            className="location-card-input location-card-input-type"
            value={editValues.type}
            onChange={(e) => setEditValues((prev) => ({ ...prev, type: e.target.value }))}
          />
        ) : (
          <span className="location-card-type-badge">{type}</span>
        )}
      </div>
      
      <div className="location-card-coordinates">
        {isEditing ? (
          <div className="location-card-coord-edit">
            <input
              className="location-card-input"
              value={String(editValues.xCoord)}
              inputMode="numeric"
              onChange={(e) => setEditValues((prev) => ({ ...prev, xCoord: Number(e.target.value) || 0 }))}
            />
            <input
              className="location-card-input"
              value={String(editValues.yCoord)}
              inputMode="numeric"
              onChange={(e) => setEditValues((prev) => ({ ...prev, yCoord: Number(e.target.value) || 0 }))}
            />
            <input
              className="location-card-input"
              value={String(editValues.zCoord)}
              inputMode="numeric"
              onChange={(e) => setEditValues((prev) => ({ ...prev, zCoord: Number(e.target.value) || 0 }))}
            />
          </div>
        ) : (
          <p className="location-card-coord-text">
            X: {isNether ? Math.trunc(xCoord / 8) : xCoord} Y: {isNether ? Math.trunc(yCoord / 8) : yCoord} Z: {isNether ? Math.trunc(zCoord / 8) : zCoord}
          </p>
        )}
      </div>
      
      <div className="location-card-button-container">
        <button onClick={onCopy} className="location-card-button location-card-button-copy">
          <span>{ didCopy ?  "✔" : "Copy"}</span>
        </button>
        
        {isEditing ? (
          <button
            onClick={() => {
              onEdit(id, {
                location_name: editValues.location_name,
                type: editValues.type,
                xCoord: editValues.xCoord,
                yCoord: editValues.yCoord,
                zCoord: editValues.zCoord,
              });
              setIsEditing(false);
            }}
            className="location-card-button location-card-button-edit"
          >
            <span>Confirm</span>
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="location-card-button location-card-button-edit">
            <span>Edit</span>
          </button>
        )}
        
        <button onClick={() => onDelete(id)} className="location-card-button location-card-button-delete">
          <span>Delete</span>
        </button>
        
        <button onClick={toggleNether} title={netherHoverText} className="location-card-button location-card-button-nether">
          <span>{isNether ? "To Overworld": "To Nether"}</span>
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files && e.target.files[0];
            if (file) {
              onImageUpload(id, file);
              // clear value to allow re-uploading the same file
              e.currentTarget.value = '';
            }
          }}
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="location-card-button location-card-button-upload"
          title="Upload an image for this location"
        >
          <span>Upload image</span>
        </button>
      </div>
    </main>
  );
};

export default LocationCard;