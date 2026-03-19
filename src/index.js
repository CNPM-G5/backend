const express = require('express');
const cors = require('cors');
require('dotenv').config();

const allowedOrigins = [
    'http://localhost:5173',            // Vite local dev
    'http://localhost:5174',            // Vite local dev (alternate port)
    'https://plearn-g5.vercel.app'  // Vercel production
];

const app = express();

// IMPORT ROUTES
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require("./routes/course.routes");
const lessonRoutes = require("./routes/lesson.routes");
const aiRoutes = require("./routes/ai.routes");
const progressRoutes = require("./routes/progress.routes");

// CORS CONFIG
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (mobile apps, curl, postman...)
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

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
        error: typeof err === "object" ? err.toString() : err
    });
});


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
