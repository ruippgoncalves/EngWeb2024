import express from 'express';
import periodo from "../controllers/periodo.js";
import compositor from "../controllers/compositor.js";

const router = express.Router();

router.get('/', (req, res) => {
    periodo.list()
        .then(data => res.jsonp(data))
        .catch(error => res.jsonp(error));
});

router.get('/:id', (req, res) => {
    periodo.findById(req.params.id)
        .then(data => res.jsonp(data))
        .catch(error => res.jsonp(error));
});

router.put('/:id', (req, res) => {
    periodo.update(req.params.id, req.body)
        .then(() => res.sendStatus(201))
        .catch(error => res.jsonp(error));
});

router.delete('/:id', async (req, res) => {
    try {
        await compositor.removeByPeriodo(req.params.id.toString());
        await periodo.remove(req.params.id.toString());
        res.sendStatus(201);
    } catch (error) {
        res.jsonp(error);
    }
});

export default router;
