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
  onImageUpload,
  onImageRemove
}) => {
  const [isNether, setIsNether] = useState(false);
  const [didCopy, setDidCopy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  // raw strings while editing so a lone "-" isn't coerced to 0; converted on save
  const [editValues, setEditValues] = useState({ xCoord: String(xCoord), yCoord: String(yCoord), zCoord: String(zCoord) });
  const [editError, setEditError] = useState('');
  const netherHoverText = `Convert coordinates\nbetween Nether and Overworld`

  const onCopy = () => {
    setDidCopy(true)
    navigator.clipboard.writeText(`${location_name} - ${xCoord} ${yCoord} ${zCoord}`);
  };

  const toggleNether = () => setIsNether(!isNether);

  useEffect(() => {
    // keep prop values in sync
    setEditValues({ xCoord: String(xCoord), yCoord: String(yCoord), zCoord: String(zCoord) });
  }, [xCoord, yCoord, zCoord]);

  const isInteger = (value: string) => /^-?\d+$/.test(value.trim());

  const saveEdit = () => {
    const { xCoord: x, yCoord: y, zCoord: z } = editValues;
    if (!isInteger(x) || !isInteger(y) || !isInteger(z)) {
      setEditError('Coordinates must be whole numbers.');
      return;
    }
    setEditError('');
    onEdit(id, { xCoord: Number(x), yCoord: Number(y), zCoord: Number(z) });
    setIsEditing(false);
  };

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
          {/* name and type can't be changed through the API; only coordinates are editable */}
          {location_name}
        </h3>
        <span className="location-card-type-badge">{type}</span>
      </div>
      
      <div className="location-card-coordinates">
        {isEditing ? (
          <div className="location-card-coord-edit">
            <input
              className="location-card-input"
              value={editValues.xCoord}
              inputMode="numeric"
              aria-label="X"
              onChange={(e) => setEditValues((prev) => ({ ...prev, xCoord: e.target.value }))}
            />
            <input
              className="location-card-input"
              value={editValues.yCoord}
              inputMode="numeric"
              aria-label="Y"
              onChange={(e) => setEditValues((prev) => ({ ...prev, yCoord: e.target.value }))}
            />
            <input
              className="location-card-input"
              value={editValues.zCoord}
              inputMode="numeric"
              aria-label="Z"
              onChange={(e) => setEditValues((prev) => ({ ...prev, zCoord: e.target.value }))}
            />
            {editError && <p className="error_message">{editError}</p>}
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
            onClick={saveEdit}
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
          accept="image/png,image/jpeg"
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
          <span>{imageUrl ? "Replace image" : "Upload image"}</span>
        </button>

        {imageUrl && (
          <button
            onClick={() => onImageRemove(id)}
            className="location-card-button location-card-button-upload"
            title="Remove the image for this location"
          >
            <span>Remove image</span>
          </button>
        )}
      </div>
    </main>
  );
};

export default LocationCard;