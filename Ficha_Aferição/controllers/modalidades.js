import Pessoa from "../models/pessoas.js";

function listarModalidades() {
    return Pessoa.distinct("desportos");
}

function listarPessoasPorModalidade(modalidade) {
    return Pessoa.find({ desportos: modalidade }).sort({ nome: 1 });
}

export default {
    listarModalidades,
    listarPessoasPorModalidade,
};
