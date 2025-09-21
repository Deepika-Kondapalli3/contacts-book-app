import React, { useState } from 'react';

const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\d{10}$/;

export default function ContactForm({ onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  function validate() {
    const e = {};
    if (!name || name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!email || !emailRegex.test(email)) e.email = 'Invalid email';
    if (!phone || !phoneRegex.test(phone)) e.phone = 'Phone must be 10 digits';
    return e;
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setMessage('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setSubmitting(true);
    const payload = { name: name.trim(), email: email.trim(), phone: phone.trim() };
    const result = await onAdd(payload);
    setSubmitting(false);
    if (result.success) {
      setName(''); setEmail(''); setPhone('');
      setMessage('Contact added successfully');
      setTimeout(() => setMessage(''), 2500);
    } else {
      setMessage(result.error || 'Failed to add');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="row">
        <label>
          Name
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
          {errors.name && <small className="field-error">{errors.name}</small>}
        </label>

        <label>
          Email
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </label>

        <label>
          Phone
          <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10 digits" />
          {errors.phone && <small className="field-error">{errors.phone}</small>}
        </label>
      </div>

      <div className="actions">
        <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Contact'}</button>
        {message && <div className="message">{message}</div>}
      </div>
    </form>
  );
}

