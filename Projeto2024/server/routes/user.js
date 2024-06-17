const express = require('express');
const router = express.Router();

const User = require('../controllers/user');
const { createToken, checkToken, CONSUMER, ADMIN, requireLevel } = require('../auth/auth');

router.post('/login', function (req, res) {
    User.getUserByEmail(req.body.email)
        .then(dados => {
            dados.comparePassword(req.body.password, function (err, isMatch) {
                if (err || !isMatch) res.status(401).jsonp({ error: 'Password inválida' });
                else {
                    createToken(dados,
                        function (e, token) {
                            if (e) res.status(500).jsonp({ error: 'Erro na geração do token: ' + e });
                            else res.status(201).jsonp({ token: token });
                        });
                }
            });
        })
        .catch(e => res.status(500).jsonp({ error: e }));
});

router.post('/', function (req, res) {
    req.body.nivel = CONSUMER;
    User.addUser(req.body)
        .then(dados => res.status(201).jsonp({ dados: dados }))
        .catch(e => { console.error(e); res.status(500).jsonp({ error: e }) });
});

router.use(checkToken);

router.get('/', requireLevel(ADMIN), function (req, res) {
    User.list()
        .then(dados => res.status(200).jsonp({
            dados: dados.map(d => {
                delete d.password;
                return d;
            })
        }))
        .catch(e => res.status(500).jsonp({ error: e }));
});

router.get('/:id', requireLevel(ADMIN), function (req, res) {
    User.getUser(req.params.id)
        .then(dados => {
            delete dados.password;
            res.status(200).jsonp({ dados: dados })})
        .catch(e => res.status(500).jsonp({ error: e }));
});

router.put('/:id/password', function (req, res) {
    User.updateUserPassword(req.params.id, req.body)
        .then(dados => {
            res.jsonp(dados);
        })
        .catch(erro => {
            res.render('error', { error: erro, message: 'Erro na alteração do utilizador' });
        });
});

router.delete('/:id', function (req, res) {
    User.deleteUser(req.params.id)
        .then(dados => {
            res.jsonp(dados);
        })
        .catch(erro => {
            res.render('error', { error: erro, message: 'Erro na remoção do utilizador' });
        });
});

module.exports = router;
