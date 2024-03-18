import express from 'express';
import periodo from "../controllers/periodo.js";

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

router.delete('/:id', (req, res) => {
    periodo().remove(req.params.id)
        .then(() => res.sendStatus(201))
        .catch(error => res.jsonp(error));
});
