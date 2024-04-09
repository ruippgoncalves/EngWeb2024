import {Router} from "express";
import pessoas from "../controllers/pessoas.js";

const router = Router();

router.get("/", (req, res) => {
    pessoas.listarPessoas()
        .then((result) => res.json(result))
        .catch((error) => res.status(500).json({error: error.message}));
});

router.get("/:id", (req, res) => {
    pessoas.listarPessoaPorId(req.params.id)
        .then((result) => res.json(result))
        .catch((error) => res.status(500).json({error: error.message}));
});

router.post("/", (req, res) => {
    pessoas.inserirPessoa(req.body)
        .then((result) => res.status(201).json(result))
        .catch((error) => res.status(500).json({error: error.message}));
});

router.put("/:id", (req, res) => {
    pessoas.atualizarPessoa(req.params.id, req.body)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(500).json({error: error.message}));
});

router.delete("/:id", (req, res) => {
    pessoas.removerPessoa(req.params.id)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(500).json({error: error.message}));
});

export default router;
