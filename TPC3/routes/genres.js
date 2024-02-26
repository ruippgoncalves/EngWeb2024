import {MiniRouter} from "../miniexpress.js";
import axios from "axios";

const router = new MiniRouter();

router.get('/', async (req, res) => {
    try {
        const genres = await axios('http://localhost:3000/genres');
        const data = Array.from(new Set(genres.data.map(g => g.genre)));

        res.sendMJinja2('templates/genres.html', {
            genres: data,
        });
    } catch (e) {
        res.status(404);
        res.end();
    }
});

router.get('/:id', async (req, res) => {
    try {
        const genre = await axios(`http://localhost:3000/genres?genre=${req.params.id}`);

        res.sendMJinja2('templates/genre.html', {
            genre: genre.data,
        });
    } catch (e) {
        console.log(e)
        res.status(404);
        res.end();
    }
});

export default router;
