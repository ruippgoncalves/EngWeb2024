const {User} = require('../models/user')

module.exports.list = () => {
    return User.find().sort('name').exec();
}

module.exports.count = () => {
    return User.countDocuments().exec();
}

module.exports.getUser = id => {
    return User.findOne({ _id: id }).exec();
}

module.exports.getUserByEmail = email => {
    return User.findOne({ email: email }).exec();
}

module.exports.addUser = u => {
    return new User(u).save();
}

module.exports.updateUser = (id, info) => {
    return User.updateOne({ _id: id }, info).exec();
}

module.exports.updateUserStatus = (id, status) => {
    return User.updateOne({ _id: id }, { active: status }).exec();
}

module.exports.updateUserPassword = (id, pwd) => {
    return User.updateOne({ _id: id }, pwd).exec();
}

module.exports.deleteUser = id => {
    return User.deleteOne({ _id: id }).exec();
}

module.exports.deleteAll = () => {
    return User.deleteMany().exec();
}

module.exports.promote = (id, nivel) => {
    return User.updateOne({ _id: id }, { nivel: nivel }).exec();
}
