import mongoose from "mongoose";

const compositorSchema = new mongoose.Schema({
    _id: {type: String, unique: true, required: true},
    nome: {type: String, required: true},
    bio: {type: String, required: true},
    dataNasc: {type: Date, required: true},
    dataObito: {type: Date, required: true},
    periodoId: {type: String, required: true},
}, {versionKey: false})

export default mongoose.model('Compositor', compositorSchema)
