const express = require('express');
const cors = require('cors');
const allowedOrigins = [
    'http://localhost:5173',                // Vite local dev
    'http://localhost:5174',                // Vite local dev (alternate port)
    'https://frontend-ghod.vercel.app',     // Vercel production
    'https://frontend-ghod.vercel.app/',    // Vercel production with trailing slash
<<<<<<< HEAD
    undefined                               // Allow requests without origin header
=======
    undefined                               // Allow requests without origin header            // Vercel production (điền đúng URL sau)
>>>>>>> 976c2bd5ffccdf75625c8a915ef48e01b7358247
];
require('dotenv').config();

const app = express();

// IMPORT ROUTES
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require("./routes/course.routes");
const lessonRoutes = require("./routes/lesson.routes");
const aiRoutes = require("./routes/ai.routes");
const progressRoutes = require("./routes/progress.routes");

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'PLearn API is running 🚀' });
});

// USE ROUTES
app.use('/api/auth', authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/progress", progressRoutes);


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});