import mongoose, {Mongoose} from "mongoose";

const atributosSchema = new mongoose.Schema({
    acorda_cedo: {
        type: Boolean,
        required: true
    },
    comida_favorita: {
        type: String,
        required: true
    },
    fumador: {
        type: Boolean,
        required: true
    },
    gosta_animais_estimacao: {
        type: Boolean,
        required: true
    },
    gosta_cinema: {
        type: Boolean,
        required: true
    },
    gosta_comer: {
        type: Boolean,
        required: true,
    },
    gosta_dancar: {
        type: Boolean,
        required: true,
    },
    gosta_ler: {
        type: Boolean,
        required: true,
    },
    gosta_musica: {
        type: Boolean,
        required: true,
    },
    gosta_viajar: {
        type: Boolean,
        required: true,
    },
}, {versionKey: false, _id: false, id: false});

const moradaSchema = new mongoose.Schema({
    cidade: {
        type: String,
        required: true
    },
    destrito: String,
}, {versionKey: false, _id: false, id: false});

const partidoPoliticoSchema = new mongoose.Schema({
    party_abbr: {
        type: String,
        required: true
    },
    party_name: {
        type: String,
        required: true
    },
}, {versionKey: false, _id: false, id: false});

const pessoaSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    animais: [{type: String, required: true}],
    atributos: {
        type: atributosSchema,
        required: true
    },
    descrição: {
        type: String,
    },
    desportos: [{type: String, required: true}],
    destinos_favoritos: [{type: String, required: true}],
    figura_publica_pt: [{type: String, required: true}],
    idade: {
        type: Number,
        required: true
    },
    marca_carro: {
        type: String,
        required: true
    },
    morada: {
        type: moradaSchema,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    partido_politico: {
        type: partidoPoliticoSchema,
        required: true
    },
    profissao: {
        type: String,
        required: true
    },
    religiao: {
        type: String,
    },
    sexo: {
        type: String,
        required: true
    },
}, {versionKey: false});

const Pessoa = mongoose.model('pessoas', pessoaSchema);

export default Pessoa;
