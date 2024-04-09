import express from 'express';
import pessoas from './routes/pessoas.js';
import modalidades from './routes/modalidades.js';
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;

const app = express();

mongoose.connect('mongodb://localhost:27017/pessoas')
    .then(() => {
        console.log('Connected to MongoDB');
    });

app.use(express.json());

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/pessoas', pessoas);
app.use('/modalidades', modalidades);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
