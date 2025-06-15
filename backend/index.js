const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const nodemailer = require("nodemailer");
const path = require('path');
const fs = require('fs');

// middlewares
const { errorHandler } = require('./middlewares/error');

// routes
const UserAuthRoutes = require('./routes/user');
const UserProfileRoutes = require('./routes/userProfile');
const learningPath = require('./routes/LearningPath');
const AIchatRoutes = require('./routes/chat');




dotenv.config();
const app = express();
connectDB();

// Create data directory if it doesn't exist
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// app.use(cors({
//   origin: "*",
// }));
// Example root route
app.get("/", (req, res) => {
  res.send("Hello from Elimika!");
});

// Routes
app.use('/api', UserAuthRoutes);
app.use('/api', UserProfileRoutes);
app.use('/api', learningPath);
app.use('/api', AIchatRoutes);


// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

// Custom error middleware
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
