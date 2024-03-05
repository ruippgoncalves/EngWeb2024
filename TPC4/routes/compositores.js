import {MiniRouter} from "../miniexpress.js";
import axios from "axios";

const router = new MiniRouter();

router.get('/', async (req, res) => {
    try {
        const compositores = await axios('http://localhost:3000/compositores?_sort=nome&_embed=periodo');

        if (compositores.status === 404) return res.status(404).end();

        res.sendMJinja2('templates/compositores.html', {
            compositores: compositores.data,
        });
    } catch (e) {
        res.status(500).end();
    }
});

router.post('/', async (req, res) => {
    try {
        await axios.post('http://localhost:3000/compositores', req.body);

        res.redirect('/compositores');
    } catch (e) {
        res.status(500).end();
    }
});

router.get('/novo', async (req, res) => {
    try {
        const periodos = await axios('http://localhost:3000/periodos');

        if (periodos.status === 404) return res.status(404).end();

        res.sendMJinja2('templates/novoCompositor.html', {
            periodos: periodos.data,
        });
    } catch (e) {
        res.status(500).end();
    }
});

router.get('/:id', async (req, res) => {
    try {
        const compositor = await axios(`http://localhost:3000/compositores/${req.params.id}?_embed=periodo`);

        if (compositor.status === 404) return res.status(404).end();

        res.sendMJinja2('templates/compositor.html', {
            compositor: compositor.data,
        });
    } catch (e) {
        res.status(500).end();
    }
});

router.post('/:id', async (req, res) => {
    try {
        const compositor = await axios.put(`http://localhost:3000/compositores/${req.params.id}`, req.body);

        if (compositor.status === 404) return res.status(404).end();

        res.redirect(`/compositores/${req.params.id}`);
    } catch (e) {
        res.status(500).end();
    }
});

router.get('/:id/delete', async (req, res) => {
    try {
        const compositor = await axios.delete(`http://localhost:3000/compositores/${req.params.id}`);

        if (compositor.status === 404) return res.status(404).end();

        res.redirect('/compositores');
    } catch (e) {
        res.status(500).end();
    }
});

router.get('/:id/editar', async (req, res) => {
    try {
        const compositor = await axios(`http://localhost:3000/compositores/${req.params.id}`);
        const periodos = await axios('http://localhost:3000/periodos');

        if (compositor.status === 404 || periodos.status === 404) return res.status(404).end();

        res.sendMJinja2('templates/editarCompositor.html', {
            compositor: compositor.data,
            periodos: periodos.data,
        });
    } catch (e) {
        res.status(500).end();
    }
});

export default router;
