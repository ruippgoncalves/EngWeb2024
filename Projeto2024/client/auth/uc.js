const { default: axios } = require('axios');
const auth = require('./auth');
const { dataAPI } = require('../utils');

let cleanupTimer = null;
let cache = {};

function cleanupTask() {
    for (const key in cache) {
        if (cache[key].expires < Date.now()) {
            delete cache[key];
        }
    }

    cleanupTimer = setTimeout(cleanupTask, 60 * 60 * 1000);
}

module.exports.getUCEddition = async (req, id) => {
    if (!auth.checkLevel(req, auth.PRODUCER)) {
        return false;
    }

    if (auth.checkLevel(req, auth.ADMIN)) {
        return true;
    }

    if (id in cache && cache[id].expires > Date.now()) {
        return cache[id].producer === req.user._id;
    }

    if (cleanupTimer === null)
        cleanupTimer = setTimeout(cleanupTask, 60 * 60 * 1000);

    return await axios.get(`${dataAPI}/uc/${id}/producer`, {
        headers: {
            'Authorization': req.user.token,
        }
    }).then(response => {
        cache[id] = { expires: Date.now() + 60 * 60 * 1000, producer: response.data };
        return response.data === req.user._id;
    }).catch(_ => {
        return false;
    });
}

module.exports.checkUCEddition = async (req, res, next) => {
    req.user.ucEditting = req.params.id !== undefined && await this.getUCEddition(req, req.params.id);
    next();
}

module.exports.requireUCEddition = (req, res, next) => {
    if (req.user.ucEditting || req.user.nivel === auth.ADMIN) {
        next();
    } else {
        res.redirect('/');
    }
}
