import express from 'express';
import compositor from "../controllers/compositor.js";

const router = express.Router();

router.get('/', (req, res) => {
    if ('_embed' in req.query) {
        compositor.listWithPeriodo()
            .then(data => res.jsonp(data))
            .catch(error => res.jsonp(error));
    } else {
        compositor.list(req.query)
            .then(data => res.jsonp(data))
            .catch(error => res.jsonp(error));
    }
});

router.get('/:id', (req, res) => {
    compositor.findById(req.params.id)
        .then(data => res.jsonp(data[0] || {}))
        .catch(error => res.jsonp(error));
});

router.put('/:id', (req, res) => {
    compositor.update(req.params.id, req.body)
        .then(() => res.sendStatus(201))
        .catch(error => res.jsonp(error));
});

router.delete('/:id', (req, res) => {
    compositor.remove(req.params.id)
        .then(() => res.sendStatus(201))
        .catch(error => res.jsonp(error));
});

export default router;
