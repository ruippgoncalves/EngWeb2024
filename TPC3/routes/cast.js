import {MiniRouter} from "../miniexpress.js";
import axios from "axios";

const router = new MiniRouter();

router.get('/', async (req, res) => {
    try {
        const casts = await axios('http://localhost:3000/cast');
        const data = Array.from(new Set(casts.data.map(g => g.cast)));

        res.sendMJinja2('templates/casts.html', {
            casts: data,
        });
    } catch (e) {
        res.status(404);
        res.end();
    }
});

router.get('/:id', async (req, res) => {
    try {
        const cast = await axios(`http://localhost:3000/cast?cast=${req.params.id}`);

        res.sendMJinja2('templates/cast.html', {
            cast: cast.data,
        });
    } catch (e) {
        res.status(404);
        res.end();
    }
});

export default router;
