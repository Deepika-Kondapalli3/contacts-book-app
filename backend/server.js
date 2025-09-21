require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const contactsRouter = require('./routes/contacts');
const db = require('./db');

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/contacts', contactsRouter);


app.get('/', (req, res) => {
  res.json({ message: 'Contact Book API running' });
});


app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
 
