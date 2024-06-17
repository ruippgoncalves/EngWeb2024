const jwt = require('jsonwebtoken');

module.exports.ADMIN = 3
module.exports.PRODUCER = 2
module.exports.CONSUMER = 1

module.exports.checkToken = (req, res, next) => {
    const token = req.cookies.token;

    if (token !== undefined) {
        req.user = jwt.decode(token);
        req.user.token = token;
        next();
    } else {
        res.redirect('/');
    }
};

module.exports.checkLevel = (req, level) => {
    return req.user.nivel >= level;
};

module.exports.requireLevel = (level) => {
    return (req, res, next) => {
        if (!this.checkLevel(req, level)) {
            res.redirect('/');
        } else {
            next();
        }
    }
}
