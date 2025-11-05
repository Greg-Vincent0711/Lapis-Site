import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import '../../AuthModal/AuthModal.css';

export type NewLocationPayload = {
  name: string;
  type: string;
  x: number;
  y: number;
  z: number;
};

type AddLocationModalProps = {
  show: boolean;
  toggle: () => void;
  onSubmit: (payload: NewLocationPayload) => void;
};

const AddLocationModal: React.FC<AddLocationModalProps> = ({ show, toggle, onSubmit }) => {
  const [error, setError] = useState('');
  const [form, setForm] = useState<NewLocationPayload>({ name: '', type: '', x: 0, y: 64, z: 0 });

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 2500);
      return () => clearTimeout(t);
    }
  }, [error]);

  const update = (field: keyof NewLocationPayload, value: string) => {
    if (field === 'x' || field === 'y' || field === 'z') {
      const num = Number(value);
      setForm((prev) => ({ ...prev, [field]: Number.isNaN(num) ? 0 : num }));
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required.';
    if (!form.type.trim()) return 'Type is required.';
    if (!Number.isFinite(form.x) || !Number.isFinite(form.y) || !Number.isFinite(form.z)) return 'Coordinates must be numbers.';
    return '';
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    onSubmit(form);
    toggle();
    // reset for next open
    setForm({ name: '', type: '', x: 0, y: 64, z: 0 });
  };

  return (
    show && (
      <main className="overlay" onClick={toggle}>
        <form className="modal_form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
          <h2 className="modal_title">Add New Location</h2>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            required
          />

          <input
            placeholder="Type (e.g., Overworld, Nether)"
            value={form.type}
            onChange={(e) => update('type', e.target.value)}
            required
          />

          <input
            placeholder="X"
            inputMode="numeric"
            value={String(form.x)}
            onChange={(e) => update('x', e.target.value)}
            required
          />

          <input
            placeholder="Y"
            inputMode="numeric"
            value={String(form.y)}
            onChange={(e) => update('y', e.target.value)}
            required
          />

          <input
            placeholder="Z"
            inputMode="numeric"
            value={String(form.z)}
            onChange={(e) => update('z', e.target.value)}
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
