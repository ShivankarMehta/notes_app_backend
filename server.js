const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const noteRoutes = require('./routes/noteRoute');
const userRoutes = require('./routes/userRoute');

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_ROUTE || "http://localhost:3002/" ,  // Replace with your frontend's URL
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.use('/api', noteRoutes);
app.use('/user', userRoutes);

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
