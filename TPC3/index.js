import {MiniExpress, MiniExpressStatic} from './miniexpress.js';
import movies from "./routes/movies.js";
import genres from "./routes/genres.js";
import cast from "./routes/cast.js";

const app = new MiniExpress();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString().substring(0, 16)}] ${req.method} ${req.originalUrl}`);
    next();
});

app.get('/', (_, res) => {
    res.redirect('/movies');
});

app.use('/movies', movies);
app.use('/genres', genres);
app.use('/cast', cast);

app.use(MiniExpressStatic('static'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
