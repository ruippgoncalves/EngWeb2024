const express = require('express');
const router = express.Router();
const axios = require('axios');
const { dataAPI } = require('../utils');
const auth = require('../auth/auth');
const { checkUCEddition, requireUCEddition, getUCEddition } = require('../auth/uc');

router.use(auth.checkToken);
router.use(checkUCEddition);

router.post('/ucs', function (req, res) {
    axios.get(dataAPI + `/search/uc?q=${req.body.search}`, {
        headers: {
            'Authorization': req.user.token
        }
    })
        .then(resp => res.json(resp.data))
        .catch(error => res.status(503).json({ error: error }));
});

router.post('/users', auth.requireLevel(auth.ADMIN), function (req, res) {
    axios.get(dataAPI + `/search/user?q=${req.body.search}`, {
        headers: {
            'Authorization': req.user.token
        }
    })
        .then(resp => res.json(resp.data))
        .catch(error => res.status(503).json({ error: error }));
});

module.exports = router;