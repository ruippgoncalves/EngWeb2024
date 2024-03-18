import express from 'express';
import morgan from 'morgan';

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());

app.use('/periodos', periodosRouter);
app.use('/compositores', compositoresRouter);

app.listen(port, () => {
    console.log(`Servidor a correr na porta ${port}`);
});
