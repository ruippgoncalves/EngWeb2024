import express from 'express';
import morgan from 'morgan';
import mongoose from "mongoose";

import periodosRouter from './routes/periodos.js';
import compositoresRouter from './routes/compositores.js';

const MONGO_DB_CON_STRING = 'mongodb://127.0.0.1/compositores';
mongoose.connect(MONGO_DB_CON_STRING);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão ao MongoDB'));
db.once('open', () => {
    console.log("Conexão ao MongoDB realizada com sucesso");
});

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());

app.use('/periodos', periodosRouter);
app.use('/compositores', compositoresRouter);

app.listen(port, () => {
    console.log(`Servidor a correr na porta ${port}`);
});
