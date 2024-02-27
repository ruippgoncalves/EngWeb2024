import {MiniRouter} from "../miniexpress.js";
import axios from "axios";

const router = new MiniRouter();

router.get('/', async (req, res) => {
    try {
        const genres = await axios('http://localhost:3000/genres?_sort=genre');

        if (genres.status === 404) return res.status(404).end();

        const data = Array.from(new Set(genres.data.map(g => g.genre)));

        res.sendMJinja2('templates/genres.html', {
            genres: data,
        });
    } catch (e) {
        res.status(500).end();
    }
});

router.get('/:id', async (req, res) => {
    try {
        const genre = await axios(`http://localhost:3000/genres?genre=${req.params.id}&_sort=movie.title`);

        if (genre.status === 404) return res.status(404).end();

        const genreName = genre.data[0].genre;

        res.sendMJinja2('templates/genre.html', {
            genre: genre.data,
            genreName,
        });
    } catch (e) {
        res.status(500).end();
    }
});

export default router;
