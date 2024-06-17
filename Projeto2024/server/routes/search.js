const express = require('express');
const { search_ucs: search, search_ucs, search_users } = require('../controllers/search');
const router = express.Router();
const { checkToken, requireLevel, ADMIN } = require('../auth/auth');

router.use(checkToken);

router.get('/uc', function (req, res, next) {
    search_ucs(req.query.q)
        .then(response => res.send(response.data.hits.map(hit => hit.id)))
        .catch(error => res.status(503).send(error));
});

router.get('/user', requireLevel(ADMIN), function (req, res, next) {
    search_users(req.query.q)
        .then(response => res.send(response.data.hits.map(hit => hit.id)))
        .catch(error => res.status(503).send(error));
});

module.exports = router;
