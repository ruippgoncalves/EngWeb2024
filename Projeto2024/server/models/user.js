const mongoose = require('mongoose');
const auth = require('../auth/auth');
const search = require('../controllers/search');
const bcrypt = require("bcrypt")
const SALT_WORK_FACTOR = 10;

let encription = true;

const userSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    filiacao: { type: String, required: true },
    nivel: { type: Number, required: true, default: auth.CONSUMER },
    creationDate: { type: Date, required: true, default: Date.now },
    accessDate: { type: Date, required: true, default: Date.now },
}, { versionKey: false });

function setEncription(value) {
    encription = value;
}

function bcryptEncripter(user, next) {
    if (!encription) {
        next();
        return;
    }

    if (!user.isModified('password'))
        return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
}

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

function store(user) {
    search.insert_users({
        id: user._id,
        nome: user.nome,
        email: user.email,
        filiacao: user.filiacao,
        nivel: user.nivel,
    })
        .catch(() => {});
}

userSchema.pre('save', function (next) {
    bcryptEncripter(this, next);
});

userSchema.post('save', function () {
    store(this);
});

userSchema.pre('findOneAndUpdate', function (next) {
    bcryptEncripter(this, next);
});

userSchema.post('findOneAndUpdate', function () {
    store(this.getUpdate());
});

userSchema.post('remove', function () {
    search.remove_user(this._id);
});

module.exports = { User: mongoose.model('user', userSchema), setEncription };
