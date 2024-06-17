const jwt = require('jsonwebtoken');

const secret = 'FOR GOD SAKE KEEP THIS DAAM PASSWORD SAFE';

module.exports.ADMIN = 3
module.exports.PRODUCER = 2
module.exports.CONSUMER = 1

module.exports.checkToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (token !== null) {
        jwt.verify(token, secret, (e, payload) => {
            if (e !== null) {
                res.status(401).jsonp({ error: e });
            } else {
                req.user = payload;
                next();
            }
        });
    } else {
        res.status(401).jsonp({ error: 'Missing Token' });
    }
};

module.exports.createToken = (user, callback) => {
    jwt.sign({
        _id: user._id,
        nome: user.nome,
        nivel: user.nivel,
        sub: 'Sites',
    },
        secret,
        { expiresIn: 3600 },
        callback);
};

module.exports.requireLevel = (level) => {
    return (req, res, next) => {
        if (req.user.nivel < level) {
            res.status(401).jsonp({ error: 'You have not permission for this operation.' });
        } else {
            next();
        }
    }
}
