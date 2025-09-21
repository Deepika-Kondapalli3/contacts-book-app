import React from 'react';

export default function ContactList({ contacts, loading, onDelete }) {
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    await onDelete(id);
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (!contacts || contacts.length === 0) return <div className="empty">No contacts yet.</div>;

  return (
    <div className="list">
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <button className="delete" onClick={() => handleDelete(c.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
 
