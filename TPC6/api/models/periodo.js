import mongoose from "mongoose";

const periodoSchema = new mongoose.Schema({
    _id: {type: String, unique: true, required: true},
    periodo: {type: String, required: true},
}, {versionKey: false})

export default mongoose.model('Periodo', periodoSchema)
