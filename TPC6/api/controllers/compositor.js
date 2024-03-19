import compositor from "../models/compositor.js";

export default {
    list(query) {
        return compositor.find(query).sort({nome: 1}).exec();
    },

    listWithPeriodo() {
        return compositor.aggregate([
            {
                $lookup: {
                    from: "periodos",
                    localField: "periodoId",
                    foreignField: "_id",
                    as: "periodo"
                }
            },
            {
                $unwind: {
                    path: "$periodo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $sort: {
                    nome: 1
                }
            }
        ]).exec();
    },

    findById(id) {
        return compositor.aggregate([
            {
                $match: {
                    _id: id
                }
            },
            {
                $lookup: {
                    from: "periodos",
                    localField: "periodoId",
                    foreignField: "_id",
                    as: "periodo"
                }
            },
            {
                $unwind: {
                    path: "$periodo",
                    preserveNullAndEmptyArrays: true
                }
            }
        ]).exec();
    },

    insert(data) {
        return compositor.insertMany([data]).exec();
    },

    update(id, data) {
        return compositor.findOneAndUpdate({_id: id}, data).exec();
    },

    remove(id) {
        return compositor.findOneAndDelete({_id: id}).exec();
    },

    removeByPeriodo(periodoId) {
        return compositor.deleteMany({periodoId: periodoId}).exec();
    }
};
