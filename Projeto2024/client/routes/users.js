const express = require('express');
const router = express.Router();
const axios = require('axios');
const { dataAPI } = require('../utils');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('login', { title: process.env.SITE_NAME + ': Login', warning: null });
});

router.post('/', function (req, res, next) {
    axios.post(dataAPI + "/user/login", {
        email: req.body.email,
        password: req.body.password,
    }).then(response => {
        res.cookie('token', response.data.token, { maxAge: 60 * 60 * 1000, httpOnly: true });
        res.redirect(`/ucs`)
    }).catch(_ => {
        res.render('login', { title: process.env.SITE_NAME + ': Login', warning: "O email ou a palavra-passe encontra-se erradas!" });
    })
})

router.get("/logout", function (req, res, next) {
    res.clearCookie('token');
    res.redirect("/")
});

router.use((req, res, next) => {
    if (process.env.DISABLE_REGISTER === 'true') {
        res.redirect('/');
        return;
    }

    next();
});

router.get("/register", function (req, res, next) {
    res.render('register', { title: process.env.SITE_NAME + ': Registo', warning: null });
})

router.post('/register', function (req, res, next) {
    if (req.body.password != req.body.password2) {
        res.status(400).render('register', { title: process.env.SITE_NAME + ': Registo', warning: 'As palavras-passe introduzidas não coincidem!' });
    } else {
        axios.post(dataAPI + "/user", {
            nome: req.body.nome,
            email: req.body.email,
            password: req.body.password,
            filiacao: req.body.filiacao,
        }).then(_ => {
            res.status(201).redirect("/")
        }).catch(error => {
            res.status(400).render('register', { title: process.env.SITE_NAME + ': Registo', warning: 'Ja existe um utilizador com esse Email' });
        })
    }
})

router.get("/changepassword", function (req, res, next) {
    res.render('recoverPassword', { title: process.env.SITE_NAME + ': Recuperar Conta', warning: null });
})

router.post('/changepassword', function (req, res, next) {
    if (req.body.password != req.body.password2) {
        res.status(400).render('register', { title: process.env.SITE_NAME + ': Registo', warning: 'As palavras-passe introduzidas não coincidem!' });
    } else {
        axios.post(dataAPI + "/user", {
            nome: req.body.nome,
            email: req.body.email,
            password: req.body.password,
            filiacao: req.body.filiacao,
        }).then(_ => {
            res.status(201).redirect("/")
        }).catch(error => {
            res.status(400).render('register', { title: process.env.SITE_NAME + ': Registo', warning: 'Ja existe um utilizador com esse Email' });
        })
    }
})

module.exports = router;
