import Pessoa from "../models/pessoas.js";

function listarPessoas() {
    return Pessoa.find();
}

function listarPessoaPorId(id) {
    return Pessoa.findById(id);
}

function inserirPessoa(userData) {
    const pessoa = new Pessoa(userData);

    return pessoa.save();
}

function atualizarPessoa(id, userData) {
    if ('_id' in userData) delete userData._id;

    return Pessoa.findByIdAndUpdate(id, userData);
}

function removerPessoa(id) {
    return Pessoa.findByIdAndDelete(id);
}

export default {
    listarPessoas,
    listarPessoaPorId,
    inserirPessoa,
    atualizarPessoa,
    removerPessoa,
};
