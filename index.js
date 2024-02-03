const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./database/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(express.json());
app.use(cors({ credentials: true, origin: 'https://ergasia-client.surge.sh' }));
app.use(cookieParser());


require('dotenv').config();


connectDB();

app.use('/auth', authRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
