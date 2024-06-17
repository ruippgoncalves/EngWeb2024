const express = require('express');
const router = express.Router();
const User = require('../controllers/user');
const { ADMIN } = require('../auth/auth');

router.post('/', function (req, res) {
    User.count()
        .then(async num => {
            if (num !== 0) {
                res.status(401).jsonp({ error: 'Already configured' });
                return;
            }

            req.body.nivel = ADMIN;
            req.body.filiacao = 'Administrador do Sistema';
            await User.addUser(req.body);
            res.sendStatus(204);
        })
        .catch(e => res.status(500).jsonp({ error: e }));
});

module.exports = router;
