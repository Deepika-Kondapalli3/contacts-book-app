import React, { useEffect, useState } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Pagination from './components/Pagination';
import api from './api';

export default function App() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(6); // items per page
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContacts = async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/contacts?page=${p}&limit=${limit}`);
      setContacts(res.data.contacts || []);
      setTotal(res.data.total || 0);
    } catch (e) {
      console.error(e);
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(page);
    
  }, [page]);

  const handleAdd = async (contact) => {
    setError(null);
    try {
      
      const res = await api.post('/contacts', contact);
      
      setPage(1);
      fetchContacts(1);
      return { success: true };
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.error || 'Failed to add contact';
      return { success: false, error: msg };
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      await api.delete(`/contacts/${id}`);
      
      fetchContacts(page);
      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Failed to delete' };
    }
  };

  return (
    <div className="container">
      <h1>Contact Book</h1>
      <ContactForm onAdd={handleAdd} />
      {error && <div className="error">{error}</div>}
      <ContactList
        contacts={contacts}
        loading={loading}
        onDelete={handleDelete}
      />
      <Pagination
        page={page}
        setPage={setPage}
        total={total}
        limit={limit}
      />
    </div>
  );
}
 
