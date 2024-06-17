const path = require('path');
const express = require('express');
const fs = require('fs');
const router = express.Router();
const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const upload = multer({ storage: inMemoryStorage });
const { storeFeatureEnv } = require('./features');
const axios = require('axios');
const { dataAPI } = require('../utils');

router.use((req, res, next) => {
    if (process.env.FINISHED_SETUP === 'true') {
        res.redirect('/');
        return;
    }

    next();
});

router.get('/', function (req, res, next) {
    res.render('setup', { title: 'Setup', error: false });
});

router.post('/', upload.single('logo'), function (req, res) {
    if (!req.file || req.file.mimetype !== 'image/jpeg') {
        res.render('setup', { title: 'Setup', error: true });
        return;
    }

    if(req.body.password != req.body.password2){
        res.status(400).render('setup', { title: 'Setup', error: true,  warning: 'As palavras-passe introduzidas não coincidem!'});
       return;
    }

    axios.post(dataAPI + '/setup', { nome: req.body.nome, email: req.body.email, password: req.body.password })
        .then(() => {
            storeFeatureEnv({
                'FINISHED_SETUP': true,
                'SITE_NAME': req.body.siteName,
            });

            fs.writeFileSync(path.join(__dirname, '../public/images/logo.jpg'), req.file.buffer);

            res.redirect('/');
        }).catch(err => res.render('setup', { title: 'Setup', error: true }));
});

function gotoSetup(req, res, next) {
    if (process.env.FINISHED_SETUP === 'false') {
        res.redirect('/setup');
        return;
    }

    next();
}

module.exports = { setupRouter: router, gotoSetup };
