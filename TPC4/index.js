import {MiniExpress, MiniExpressStatic, MiniUrlencoded} from './miniexpress.js';
import compositores from "./routes/compositores.js";
import periodos from "./routes/periodos.js";

const app = new MiniExpress();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString().substring(0, 16)}] ${req.method} ${req.url}`);
    next();
});

app.use(MiniUrlencoded);

app.get('/', (_, res) => {
    res.redirect('/compositores');
});

app.use('/compositores', compositores);
app.use('/periodos', periodos);

app.use(MiniExpressStatic('static'));

app.listen(port, () => {
    console.log(`Servidor a correr na porta ${port}`);
});
