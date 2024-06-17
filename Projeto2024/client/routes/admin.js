const express = require('express');
const router = express.Router();
const axios = require('axios');
const { dataAPI } = require('../utils');
const auth = require('../auth/auth');

router.use(auth.checkToken);
router.use(auth.requireLevel(auth.ADMIN));

router.get('/promote', function (req, res, next) {
    axios.get(dataAPI + `/user`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        res.render('ucUserPromote', { title: process.env.SITE_NAME + ': Promover utilizadores', users: response.data.dados });
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
});

router.get('/promote/:id', function (req, res, next) {
    axios.post(dataAPI + `/admin/promote/${req.params.id}`, {}, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(_ => {
        res.redirect('/admin/promote');
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
});

module.exports = router;