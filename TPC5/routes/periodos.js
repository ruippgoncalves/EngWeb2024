import axios from "axios";
import express from "express";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const periodos = await axios('http://localhost:3000/periodos?_sort=periodo');

        if (periodos.status === 404) return res.status(404).end();

        res.render('periodos.pug', {
            periodos: periodos.data,
        });
    } catch (e) {
        res.status(500).end();
    }
});

router.post('/', async (req, res) => {
    try {
        await axios.post('http://localhost:3000/periodos', req.body);

        res.redirect('/periodos');
    } catch (e) {
        res.status(500).end();
    }
});

router.get('/novo', async (req, res) => {
    res.render('novoPeriodo.pug');
});

router.get('/:id', async (req, res) => {
    console.log(req.url)
    console.log(req.originalUrl)
    try {
        const periodo = await axios(`http://localhost:3000/periodos/${req.params.id}`);
        const compositores = await axios(`http://localhost:3000/compositores?periodoId=${req.params.id}&_sort=nome`);

        if (periodo.status === 404 || compositores.status === 404) return res.status(404).end();

        res.render('periodo.pug', {
            periodo: periodo.data,
            compositores: compositores.data,
        });
    } catch (e) {
        res.status(500).end();
    }
});

router.post('/:id', async (req, res) => {
    try {
        const periodo = await axios.put(`http://localhost:3000/periodos/${req.params.id}`, req.body);

        if (periodo.status === 404) return res.status(404).end();

        res.redirect(`/periodos/${req.params.id}`);
    } catch (e) {
        res.status(500).end();
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        const compositores = await axios(`http://localhost:3000/compositores?periodoId=${req.params.id}`);

        for (const compositor of compositores.data) {
            await axios.delete(`http://localhost:3000/compositores/${compositor.id}`);
        }

        await axios.delete(`http://localhost:3000/periodos/${req.params.id}`);

        res.redirect('/periodos');
    } catch (e) {
        res.status(500).end();
    }
});

router.get('/editar/:id', async (req, res) => {
    try {
        const periodo = await axios(`http://localhost:3000/periodos/${req.params.id}`);

        if (periodo.status === 404) return res.status(404).end();

        res.render('editarPeriodo.pug', {
            periodo: periodo.data,
        });
    } catch (e) {
        res.status(500).end();
    }
});

export default router;
