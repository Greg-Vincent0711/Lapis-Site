import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import '../../AuthModal/AuthModal.css';
import type { AddLocationModalProps, NewLocationPayload } from '../../../types/types';

const AddLocationModal: React.FC<AddLocationModalProps> = ({ shouldShow, toggle, onSubmit }) => {
  const [error, setError] = useState('');
  const [form, setForm] = useState<NewLocationPayload>({ name: '', type: '', xCoord: 0, yCoord: 64, zCoord: 0 });

  useEffect(() => {
    if (error) {
      const errTimeout = setTimeout(() => setError(''), 2500);
      return () => clearTimeout(errTimeout);
    }
  }, [error]);

  const updateFields = (field: keyof NewLocationPayload, value: string) => {
    if (field === 'xCoord' || field === 'yCoord' || field === 'zCoord') {
      const num = Number(value);
      // error check the different coordinate values
      setForm((prev) => ({ ...prev, [field]: Number.isNaN(num) ? 0 : num }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.type.trim()) return 'Type is required.';
    if (!Number.isFinite(form.xCoord) || !Number.isFinite(form.yCoord) || !Number.isFinite(form.zCoord)) return 'Coordinates must be numbers.';
    return '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    // leads to POST req call in Dashboard.tsx
    onSubmit(form);
    toggle();
    // reset
    setForm({ name: '', type: '', xCoord: 0, yCoord: 64, zCoord: 0 });
  };

  return (
    shouldShow && (
      <main className="overlay" onClick={toggle}>
        <form className="modal_form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
          <h2 className="modal_title">Add New Location</h2>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => updateFields('name', e.target.value)}
            required
          />

          <input
            placeholder="Type (e.g., Overworld, Nether)"
            value={form.type}
            onChange={(e) => updateFields('type', e.target.value)}
            required
          />

          <input
            placeholder="X"
            inputMode="numeric"
            value={String(form.xCoord)}
            onChange={(e) => updateFields('xCoord', e.target.value)}
            required
          />

          <input
            placeholder="Y"
            inputMode="numeric"
            value={String(form.yCoord)}
            onChange={(e) => updateFields('yCoord', e.target.value)}
            required
          />

          <input
            placeholder="Z"
            inputMode="numeric"
            value={String(form.zCoord)}
            onChange={(e) => updateFields('zCoord', e.target.value)}
            required
          />

          {error && <p className="error_message">{error}</p>}

          <button type="submit" className="submit_button">Add Location</button>
        </form>
      </main>
    )
  );
};

export default AddLocationModal;
