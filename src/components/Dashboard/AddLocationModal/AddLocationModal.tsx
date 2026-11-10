import React, { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import '../../AuthModal/AuthModal.css';
import { LOCATION_TYPES } from '../../../types/types';
import type { AddLocationModalProps } from '../../../types/types';

// coordinates are kept as raw strings while typing so "-" isn't coerced to 0
type FormState = {
  location_name: string;
  type: string;
  xCoord: string;
  yCoord: string;
  zCoord: string;
};

const EMPTY_FORM: FormState = { location_name: '', type: 'Overworld', xCoord: '0', yCoord: '64', zCoord: '0' };

const isInteger = (value: string) => /^-?\d+$/.test(value.trim());

const AddLocationModal: React.FC<AddLocationModalProps> = ({ shouldShow, toggle, onSubmit }) => {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  useEffect(() => {
    if (error) {
      const errTimeout = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(errTimeout);
    }
  }, [error]);

  const updateFields = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const name = form.location_name.trim();
    if (name.length < 3 || name.length > 30) return 'Name must be 3 to 30 characters.';
    if (!isInteger(form.xCoord) || !isInteger(form.yCoord) || !isInteger(form.zCoord)) return 'Coordinates must be whole numbers.';
    return '';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }
    setSubmitting(true);
    // leads to POST req call in Dashboard.tsx; resolves to the API's error message on failure
    const apiError = await onSubmit({
      location_name: form.location_name.trim(),
      type: form.type,
      xCoord: Number(form.xCoord),
      yCoord: Number(form.yCoord),
      zCoord: Number(form.zCoord),
    });
    setSubmitting(false);
    if (apiError) {
      setError(apiError);
      return;
    }
    toggle();
    setForm(EMPTY_FORM);
  };

  return (
    shouldShow && (
      <main className="overlay" onClick={toggle}>
        <form className="modal_form" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
          <h2 className="modal_title">Add New Location</h2>

          <input
            placeholder="Name"
            value={form.location_name}
            onChange={(e) => updateFields('location_name', e.target.value)}
            minLength={3}
            maxLength={30}
            required
          />

          <select
            value={form.type}
            onChange={(e) => updateFields('type', e.target.value)}
            aria-label="Dimension"
          >
            {LOCATION_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <input
            placeholder="X"
            inputMode="numeric"
            value={form.xCoord}
            onChange={(e) => updateFields('xCoord', e.target.value)}
            required
          />

          <input
            placeholder="Y"
            inputMode="numeric"
            value={form.yCoord}
            onChange={(e) => updateFields('yCoord', e.target.value)}
            required
          />

          <input
            placeholder="Z"
            inputMode="numeric"
            value={form.zCoord}
            onChange={(e) => updateFields('zCoord', e.target.value)}
            required
          />

          {error && <p className="error_message">{error}</p>}

          <button type="submit" className="submit_button" disabled={submitting}>
            {submitting ? 'Adding...' : 'Add Location'}
          </button>
        </form>
      </main>
    )
  );
};

export default AddLocationModal;
