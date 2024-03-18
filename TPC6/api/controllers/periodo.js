import periodo from "../models/periodo.js";

export default {
    list() {
        return periodo.find().sort({nome: 1}).exec();
    },

    findById(id) {
        return periodo.findOne({_id: id}).exec();
    },

    update(id, data) {
        return periodo.findOneAndUpdate({_id: id}, data).exec();
    },

    remove(id) {
        return periodo.findOneAndDelete({_id: id}).exec();
    }
};
