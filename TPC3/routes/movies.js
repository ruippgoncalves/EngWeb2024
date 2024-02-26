import {MiniRouter} from "../miniexpress.js";
import axios from "axios";

const router = new MiniRouter();

router.get('/', async (req, res) => {
    try {
        const movies = await axios('http://localhost:3000/movies?_sort=title');

        res.sendMJinja2('templates/movies.html', {
            movies: movies.data,
        });
    } catch (e) {
        res.status(404);
        res.end();
    }
});

router.get('/:id', async (req, res) => {
    try {
        const movie = await axios(`http://localhost:3000/movies/${req.params.id}`);
        const genres = await axios(`http://localhost:3000/genres?movie.id=${req.params.id}`);
        const cast = await axios(`http://localhost:3000/cast?movie.id=${req.params.id}`);

        res.sendMJinja2('templates/movie.html', {
            movie: movie.data,
            genres: genres.data,
            cast: cast.data,
        });
    } catch (e) {
        res.status(404);
        res.end();
    }
});

export default router;
