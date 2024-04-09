import {Router} from "express";
import Modalidades from "../controllers/modalidades.js";

const router = Router();

router.get("/", (req, res) => {
    Modalidades.listarModalidades()
        .then(result => res.send(result))
        .catch((error) => res.status(500).json({error: error.message}));
});

router.get("/:id", (req, res) => {
    Modalidades.listarPessoasPorModalidade(req.params.id)
        .then(result => res.send(result))
        .catch((error) => res.status(500).json({error: error.message}));
});

export default router;
