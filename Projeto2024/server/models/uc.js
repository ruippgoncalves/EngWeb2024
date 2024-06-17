const mongoose = require('mongoose');
const search = require('../controllers/search');

const horarioSchema = new mongoose.Schema({
    teoricas: [String],
    praticas: [String],
});

const docenteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    foto: { type: String, required: true },
    categoria: { type: String, required: true },
    filiacao: { type: String, required: true },
    email: { type: String, required: true },
    webpage: { type: String, required: true },
});

const dataSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
});

const aulaSchema = new mongoose.Schema({
    tipo: { type: String, required: true },
    data: { type: String, required: true },
    sumario: [String],
});

const anuncioSchema = new mongoose.Schema({
    data: { type: Date, require: true, default: Date.now },
    titulo: { type: String, require: true },
    descricao: [String],
});

const resourceSchema = new mongoose.Schema({
    _id: String,
    originalFilename: { type: String, required: true },
    titulo: { type: String, required: true },
    descricao: [String],
});

// TODO required
const ucSchema = new mongoose.Schema({
    _id: String,
    titulo: { type: String, required: true },
    docentes: [docenteSchema],
    horario: horarioSchema,
    avaliacao: [String],
    datas: [dataSchema],
    aulas: [aulaSchema],
    anuncios: [anuncioSchema],
    resources: [resourceSchema],
    producer: { type: mongoose.Schema.Types.ObjectId, required: true },
    users: [mongoose.Schema.Types.ObjectId],
}, { versionKey: false });

function store(uc) {
    search.insert_ucs({
        id: uc._id,
        titulo: uc.titulo,
        docentes: uc.docentes.map(d => ({ ...d })),
        horario: {
            teoricas: uc.horario.teoricas,
            praticas: uc.horario.praticas,
        },
        avaliacao: uc.avaliacao,
        datas: uc.datas.map(d => ({ ...d })),
        aulas: uc.aulas.map(a => ({ ...a })),
        anuncios: uc.anuncios.map(a => ({ ...a })),
        resources: uc.resources.map(r => ({ ...r })),
    })
        .catch((err) => {
            console.error(err);
        });
}

ucSchema.post('save', function () {
    store(this);
});

ucSchema.post('findOneAndUpdate', function () {
    const dt = this.getUpdate();
    store({_id: dt._id, ...dt['$set']});
});

ucSchema.post('remove', function (next) {
    search.remove_ucs(this._id);
    next();
});

module.exports = mongoose.model('uc', ucSchema, 'ucs');
