const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// IMPORT ROUTES
const authRoutes = require('./routes/auth.routes');

// USE ROUTES
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'PLearn API is running 🚀' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const pool = require("./config/db");

