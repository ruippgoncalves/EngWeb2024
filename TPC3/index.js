import {MiniExpress, MiniExpressStatic} from './miniexpress.js';
import movies from "./routes/movies.js";
import genres from "./routes/genres.js";
import cast from "./routes/cast.js";

const app = new MiniExpress();

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString().substring(0, 16)}] ${req.method} ${req.url.pathname}`);
    next();
});

app.get('/', (_, res) => {
    res.redirect('/movies');
});

app.use('/movies', movies);
app.use('/genres', genres);
app.use('/cast', cast);

app.use(MiniExpressStatic('static'));

app.listen(5000);
