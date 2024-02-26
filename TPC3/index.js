import {MiniExpress, MiniExpressStatic} from './miniexpress.js';
import movies from "./routes/movies.js";
import genres from "./routes/genres.js";
import cast from "./routes/cast.js";

const app = new MiniExpress();

app.get('/', (_, res) => {
    res.redirect('/movies');
});

app.route('/movies', movies);
app.route('/genres', genres);
app.route('/cast', cast);

app.use(MiniExpressStatic('static'));

app.listen(5000);
