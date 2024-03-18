import compositor from "../models/compositor.js";

export default {
    list() {
        return compositor.find().sort({nome: 1}).exec();
    },

    findById(id) {
        return compositor.findOne({_id: id}).exec();
    },

    update(id, data) {
        return compositor.findOneAndUpdate({_id: id}, data).exec();
    },

    remove(id) {
        return compositor.findOneAndDelete({_id: id}).exec();
    }
};
