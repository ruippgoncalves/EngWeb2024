const mongoose = require('mongoose');
let uc = require('../models/uc');

module.exports.list = () => {
    return uc
        .find()
        .exec();
};

module.exports.findById = id => {
    return uc
        .findOne({ _id: id })
        .exec();
};

module.exports.findByIdWithUsers = id => {
    return uc
        .aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'users',
                    foreignField: '_id',
                    as: 'users'
                }
            },
        ])
        .exec();
}

module.exports.listProducer = (producer = null) => {
    return uc
        .find(producer ? { producer: producer } : {})
        .exec();
};

module.exports.insert = async cont => {
    try {
        cont._id = cont.sigla;
        delete cont.sigla;
        let ucs = new uc(cont);
        return await ucs.save();
    } catch (e) {
        return Promise.reject(new Error('Unknown'));
    }
};

module.exports.update = (id, cont) => {
    cont._id = cont.sigla;
    delete cont.sigla;
    return uc
        .findByIdAndUpdate(id, cont, { new: true })
        .exec();
};

module.exports.remove = id => {
    return uc
        .findByIdAndDelete({ _id: id })
        .exec();//retorna o objeto retornado
};

module.exports.removeProducer = (id, userId) => {
    return uc
        .deleteMany({ _id: id, producer: userId })
        .exec();//retorna o objeto retornado
};

module.exports.removeAll = () => {
    return uc
        .deleteMany()
        .exec();
};
