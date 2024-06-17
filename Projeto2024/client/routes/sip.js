const express = require('express');
const router = express.Router();
const axios = require('axios');
const { dataAPI } = require('../utils');
const auth = require('../auth/auth');
const { checkUCEddition, requireUCEddition } = require('../auth/uc');
const FormData = require('form-data');

const multer = require('multer');
const inMemoryStorage = multer.memoryStorage();
const upload = multer({ storage: inMemoryStorage });

router.use(auth.checkToken);

//---------------------------------
// Producer
//---------------------------------

router.get('/import', auth.requireLevel(auth.PRODUCER), function (req, res, next) {
    res.render('ucImportSIP', { title: process.env.SITE_NAME });
});

router.post('/import', upload.single('sip'), auth.requireLevel(auth.PRODUCER), function (req, res) {
    const form = new FormData();

    form.append('sip', req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });

    axios.post(dataAPI + '/sip', form, {
        ...form.getHeaders(),
        headers: {
            'Authorization': req.user.token,
        }
    })
        .then(_ => res.redirect('/ucs'))
        .catch(error => {
            res.render('ucImportSIP', { title: process.env.SITE_NAME, warning: 'Nao foi possivel importar a UC' });
        })
});

router.get('/export', auth.requireLevel(auth.PRODUCER), function (req, res, next) {
    axios.get(dataAPI + '/sip', {
        headers: {
            'Authorization': req.user.token,
        },
        responseType: 'arraybuffer',
    })
        .then(resp => {
            res.setHeader('Content-Type', resp.headers['content-type']);
            res.setHeader('Content-Disposition', `attachment; filename=exportUC.zip`);
            res.send(resp.data);
        })
        .catch(error => {
            axios.get(dataAPI + `/uc`, {
                headers: {
                    'Authorization': req.user.token
                }
            }).then(async (response) => {
                const ucs = []

                for (let uc of response.data) {
                    uc.isProducer = await getUCEddition(req, uc._id);

                    ucs.push(uc)
                }

                res.render('ucList', { ucs: ucs, title: process.env.SITE_NAME, producer: req.user.nivel === auth.PRODUCER, admin: req.user.nivel === auth.ADMIN, warning: error.message });
            }).catch(err => res.status(400).render('error', { title: 'Error', message: `There has been an error loading the page's content.`, error: err }));
        })
});

//---------------------------------
// Admin
//---------------------------------

router.get('/import/admin', auth.requireLevel(auth.ADMIN), function (req, res, next) {
    res.render('ucImportSIPAdmin', { title: process.env.SITE_NAME });
});

router.post('/import/admin', upload.single('sip'), auth.requireLevel(auth.ADMIN), function (req, res) {
    const form = new FormData();

    form.append('sip', req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });

    axios.post(dataAPI + '/sip/admin', form, {
        ...form.getHeaders(),
        headers: {
            'Authorization': req.user.token,
        }
    })
        .then(_ => res.redirect('/ucs'))
        .catch(error => { res.render('ucImportSIP', { title: process.env.SITE_NAME, warning: 'Nao foi possivel importar a UC' }); })
});

router.get('/export/admin', auth.requireLevel(auth.ADMIN), function (req, res, next) {
    axios.get(dataAPI + '/sip/admin', {
        headers: {
            'Authorization': req.user.token,
        },
        responseType: 'arraybuffer',
    })
        .then(resp => {
            res.setHeader('Content-Type', resp.headers['content-type']);
            res.setHeader('Content-Disposition', `attachment; filename=exportSystem.zip`);
            res.send(resp.data);
        })
        .catch(error => {
            axios.get(dataAPI + `/uc`, {
                headers: {
                    'Authorization': req.user.token
                }
            }).then(async (response) => {
                const ucs = []

                for (let uc of response.data) {
                    uc.isProducer = await getUCEddition(req, uc._id);

                    ucs.push(uc)
                }

                res.render('ucList', { ucs: ucs, title: process.env.SITE_NAME, producer: req.user.nivel === auth.PRODUCER, admin: req.user.nivel === auth.ADMIN, warning: error.message });
            }).catch(err => res.status(400).render('error', { title: 'Error', message: `There has been an error loading the page's content.`, error: err }))
        })
});

module.exports = router;