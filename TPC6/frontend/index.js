import express from "express";
import compositores from "./routes/compositores.js";
import periodos from "./routes/periodos.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 5000;

app.set('views', './views');
app.set('view engine', 'pug');

app.use(morgan('dev'));

app.use(express.urlencoded({extended: true}));

app.get('/', (_, res) => {
    res.redirect('/compositores');
});

app.use('/compositores', compositores);
app.use('/periodos', periodos);

app.use(express.static('static'));

app.listen(port, () => {
    console.log(`Servidor a correr na porta ${port}`);
});
