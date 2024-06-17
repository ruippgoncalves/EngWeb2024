const path = require('path');
const express = require('express');
const fs = require('fs');
const auth = require('../auth/auth');
const router = express.Router();

const FEATURES_PATH = path.join(__dirname, '../features.env');

const FEATURES = {
    'FINISHED_SETUP': Boolean,
    'SITE_NAME': String,
    'DISABLE_REGISTER': Boolean,
    'SCRATCH_RENDERING': Boolean,
    'PDFJS_RENDERING': Boolean,
    'FLASH_RENDERING': Boolean,
};

const FEATURES_DEFAULT = {
    'FINISHED_SETUP': 'false',
    'SITE_NAME': 'UCS',
    'DISABLE_REGISTER': 'false',
    'SCRATCH_RENDERING': 'true',
    'PDFJS_RENDERING': 'true',
    'FLASH_RENDERING': 'true',
};

const FEATURES_UI = {
    'SITE_NAME': 'Nome do site',
    'DISABLE_REGISTER': 'Desativar registo',
    'SCRATCH_RENDERING': 'Renderização de ficheiros Scratch',
    'PDFJS_RENDERING': 'Renderização de PDFs atraves do PDF.js da Mozilla',
    'FLASH_RENDERING': 'Renderização de ficheiros do Adobe Flash Player (.swf)',
};

function storeFeatureEnv(changes) {
    for (let [key, value] of Object.entries(changes))
        process.env[key] = FEATURES[key](value);

    let data = '';

    for (let key of Object.keys(FEATURES)) {
        data += `${key}=${process.env[key]}\n`;
    }

    fs.writeFileSync(FEATURES_PATH, data);
}

function setupEnv() {
    require('dotenv').config({ path: FEATURES_PATH });

    for (let [key, type] of Object.entries(FEATURES)) {
        if (process.env[key] === undefined) {
            process.env[key] = FEATURES_DEFAULT[key];
        } else {
            if (type === Boolean) {
                process.env[key] = String(process.env[key] === 'true');
            }
        }
    }
}

router.use(auth.checkToken);
router.use(auth.requireLevel(auth.ADMIN));

router.get('/', function (req, res) {
    const features = Object.entries(FEATURES_UI).map(([feature, desc]) => ({
        feature,
        desc,
        value: process.env[feature],
        type: FEATURES[feature].name,
    }));

    res.render('features', { title: process.env.SITE_NAME + ': Features', features });
});

router.post('/', function (req, res) {
    const result = {};

    Object.keys(FEATURES_UI).forEach(key => {
        result[key] = req.body[key];
    });

    storeFeatureEnv(result);

    res.redirect('/features');
});

module.exports = { featuresRouter: router, setupEnv, storeFeatureEnv };
