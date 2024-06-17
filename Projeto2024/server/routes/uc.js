const express = require('express');
const router = express.Router();
const uc = require('../controllers/uc');
const auth = require('../auth/auth');
const { checkToken } = auth;

//------------------------------------------------------------------------------
// Anuncios
//------------------------------------------------------------------------------

router.get('/:id/anuncios/', (req, res) => {
    uc.findById(req.params.id)
        .then(data => res.status(201).json({title: data.title, anuncios: data.anuncios}))
        .catch(error => res.status(400).json(error));
});

router.get('/:id/anuncios/:anuncio', (req, res) => {
    uc.findById(req.params.id)
        .then(data => {
            let retorno = data.anuncios.filter(p => p._id.toString() === req.params.anuncio);

            if (retorno.length === 0) {
                res.status(404).json({ error: 'Anuncio not found' });
                return;
            }

            res.status(200).json(retorno[0]);
        })
        .catch(error => res.status(400).json(error));
});

//----
router.use(checkToken);

router.put('/:id/anuncios/:anuncio', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findById(req.params.id).then(async u => {
        if (req.user.nivel < auth.ADMIN && u.producer !== req.user._id) {
            res.status(401).json({ error: 'You have not permission for this operation.' });
            return;
        }

        u.anuncios = u.anuncios.map(p => p._id.toString() === req.params.anuncio ? req.body : p);

        const dt = await uc.update(req.params.id, u);

        res.status(200).json(dt);
    }).catch(error => res.status(400).json(error));
});

router.post('/:id/anuncios', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findById(req.params.id).then(async u => {
        if (req.user.nivel < auth.ADMIN && u.producer !== req.user._id) {
            res.status(401).json({ error: 'You have not permission for this operation.' });
            return;
        }

        u.anuncios.push(req.body);

        const dt = await uc.update(req.params.id, u);

        res.status(200).json(dt);
    }).catch(error => res.status(400).json(error));
});

router.delete('/:id/anuncios/:anuncio', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findById(req.params.id).then(async u => {
        if (req.user.nivel < auth.ADMIN && u.producer !== req.user._id) {
            res.status(401).json({ error: 'You have not permission for this operation.' });
            return;
        }

        u.anuncios = u.anuncios.filter(p => p._id.toString() !== req.params.anuncio);

        const dt = await uc.update(req.params.id, u);

        res.status(200).json(dt);
    }).catch(error => res.status(400).json(error));
});

router.get('/', function (req, res) {
    uc.list()
        .then(data => {
            if (req.user.nivel !== auth.ADMIN) {
                data = data.filter(d => d.producer.toString() === req.user._id || d.users.filter(u => u._id.toString() === req.user._id).length > 0);
            }

            res.status(201).jsonp(data);
        })
        .catch(erro => {
            res.status(400).jsonp(erro)
        });
});

router.get('/:id', function (req, res) {
    uc.findById(req.params.id)
        .then(data => {
            if (data.producer === req.user._id) {
                res.jsonp(data);
                return;
            }

            if (req.user.nivel !== auth.ADMIN && req.user._id !== data.producer.toString() && data.users.filter(d => d._id.toString() === req.user._id).length === 0) {
                res.status(401).json({ error: 'You are not a member of this class.' });
                return;
            }

            res.jsonp(data);
        })
        .catch(erro => res.jsonp(erro));
});

router.get('/:id/producer', (req, res) => {
    uc.findById(req.params.id)
        .then(data => res.jsonp(data.producer))
        .catch(erro => res.jsonp(erro));
});

router.post('/', auth.requireLevel(auth.PRODUCER), function (req, res) {
    const newUc = {
        sigla: req.body.sigla,
        titulo: req.body.titulo,
        docentes: req.body.docentes,
        horario: req.body.horario,
        avaliacao: req.body.avaliacao,
        producer: req.user._id,
        datas: []/*Object.entries(req.body.datas)*/,
        aulas: req.body.aulas/*Object.entries(req.body.aulas)*/,
        anuncios: [],
    };

    for (let d of Object.keys(req.body.datas)) {
        newUc.datas.push({
            nome: d,
            descricao: req.body.datas[d],
        });
    }

    try {
        fs.mkdirSync(path.join(resources, newUc.sigla));
    } catch (e) {
        res.status(400).json({ error: 'UC already exists' });
        return;
    }

    uc.insert(newUc)
        .then(data => {
            res.status(201).jsonp(data);
        })
        .catch(erro => res.status(400).jsonp(erro));
});

router.put('/:id', auth.requireLevel(auth.PRODUCER), async function (req, res) {
    let prevUC = await uc.findById(req.params.id);

    if (req.user.nivel < auth.ADMIN && prevUC.producer !== req.user._id) {
        res.status(401).json({ error: 'You have not permission for this operation.' });
        return;
    }

    prevUC.datas = [];

    prevUC.sigla = req.body.sigla;
    prevUC.titulo = req.body.titulo;
    prevUC.horario = req.body.horario;
    prevUC.avaliacao = req.body.avaliacao;

    for (let d of Object.keys(req.body.datas)) {
        prevUC.datas.push({
            nome: d,
            descricao: req.body.datas[d],
        });
    }

    uc.update(req.params.id, prevUC)
        .then(data => res.jsonp(data))
        .catch(erro => res.jsonp(erro));
});

router.delete('/:id', auth.requireLevel(auth.PRODUCER), function (req, res) {
    if (req.user.nivel == auth.ADMIN) {
        uc.remove(req.params.id, req.body)
            .then(data => {
                fs.rmSync(path.join(resources, req.params.id), { recursive: true, force: true });
                res.jsonp(data);
            })
            .catch(erro => res.jsonp(erro));
    } else {
        uc.removeProducer(req.params.id, req.user._id, req.body)
            .then(data => {
                fs.rmSync(path.join(resources, req.params.id), { recursive: true, force: true });
                res.jsonp(data);
            })
            .catch(_ => res.status(401).json({ error: 'You have not permission for this operation.' }));
    }
});


//------------------------------------------------------------------------------
// Aulas
//------------------------------------------------------------------------------

router.get('/:id/aulas', (req, res) => {
    uc.findById(req.params.id)
        .then(data => {
            if (req.user.nivel !== auth.ADMIN && req.user._id !== data.producer.toString() && data.users.filter(d => d._id.toString() === req.user._id).length === 0) {
                res.status(401).json({ error: 'You are not a member of this class.' });
                return;
            }

            res.status(200).json(data.aulas)
        })
        .catch(error => res.status(400).json(error));
});

router.get('/:id/aulas/:aulaId', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findById(req.params.id).then(async data => {
        const aula = data.aulas.filter(a => a._id.toString() === req.params.aulaId)[0];

        if (aula === undefined) {
            res.status(404).json({ error: 'Aula not found' });
            return;
        }

        res.status(201).json(aula);
    }).catch(error => res.status(400).json(error));

});

router.post('/:id/aulas', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findById(req.params.id).then(async u => {
        if (req.user.nivel < auth.ADMIN && u.producer !== req.user._id) {
            res.status(401).json({ error: 'You have not permission for this operation.' });
            return;
        }

        req.body.forEach(aula => u.aulas.push(aula));

        let newUC = await uc.update(req.params.id, u);

        res.status(200).json(newUC);
    }).catch(error => res.status(400).json(error));

});

router.put('/:id/aulas/:aulaId', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findById(req.params.id).then(async u => {
        if (req.user.nivel < auth.ADMIN && u.producer !== req.user._id) {
            res.status(401).json({ error: 'You have not permission for this operation.' });
            return;
        }

        u.aulas = u.aulas.map(p => p._id.toString() === req.params.aulaId ? req.body : p);

        const dt = await uc.update(req.params.id, u);

        res.status(200).json(dt);
    }).catch(error => res.status(400).json(error));
});

router.delete('/:id/aulas/:aulaId', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findById(req.params.id).then(async u => {
        if (req.user.nivel < auth.ADMIN && prevUC.producer !== req.user._id) {
            res.status(401).json({ error: 'You have not permission for this operation.' });
            return;
        }

        u.aulas = u.aulas.filter(p => p._id.toString() !== req.params.aulaId);

        const dt = await uc.update(req.params.id, u);

        res.status(200).json(dt);
    }).catch(error => res.status(404).json(error));
});


//------------------------------------------------------------------------------
// Docentes
//------------------------------------------------------------------------------

const resources = require('../utils').resources;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const fs = require('node:fs');
const path = require('node:path');

router.get('/:id/docentes/', (req, res) => {
    uc.findById(req.params.id)
        .then(data => {
            if (req.user.nivel !== auth.ADMIN && req.user._id !== data.producer.toString() && data.users.filter(d => d._id.toString() === req.user._id).length === 0) {
                res.status(401).json({ error: 'You are not a member of this class.' });
                return;
            }

            res.status(201).json(data.docentes);
        })
        .catch(error => res.status(400).json(error));
});

router.post('/:id/docentes/', auth.requireLevel(auth.PRODUCER), upload.any(), (req, res) => {
    uc.findById(req.params.id)
        .then(async (u) => {
            if (req.user.nivel < auth.ADMIN && prevUC.producer !== req.user._id) {
                res.status(401).json({ error: 'You have not permission for this operation.' });
                return;
            }

            if (typeof req.body.docentes === 'string') {
                req.body.docentes = JSON.parse(req.body.docentes);
            }

            for (let i = 0; i < req.files.length; i++) {
                const name = crypto.randomUUID() + path.extname(req.files[i].originalname);
                let newPath = path.join(resources, req.params.id, name);

                fs.writeFileSync(newPath, req.files[i].buffer);

                req.body.docentes[i].foto = name;
            }

            req.body.docentes.forEach(d => u.docentes.push(d));

            const dt = await uc.update(req.params.id, u);

            res.status(200).json(dt);
        }).catch(error => res.status(400).json(error));
});

router.get('/:id/docentes/:docenteId', (req, res) => {
    uc.findById(req.params.id)
        .then(data => {
            const realUc = data.docentes.filter(p => p._id.toString() === req.params.docenteId)[0];

            if (realUc === undefined) {
                res.status(404).json({ error: 'Docente not found' });
                return;
            }

            res.status(201).json(realUc);
        })
        .catch(error => res.status(400).json(error));
});

router.put('/:id/docentes/:docenteId', auth.requireLevel(auth.PRODUCER), upload.single('foto'), (req, res) => {
    uc.findById(req.params.id).then(async u => {
        if (req.user.nivel < auth.ADMIN && prevUC.producer !== req.user._id) {
            res.status(401).json({ error: 'You have not permission for this operation.' });
            return;
        }

        const realUc = u.docentes.filter(p => p._id.toString() === req.params.docenteId)[0];

        if (realUc === undefined) {
            res.status(404).json({ error: 'Docente not found' });
            return;
        }

        const name = crypto.randomUUID() + path.extname(req.file.originalname);
        let newPath = path.join(resources, req.params.id, name);

        fs.writeFileSync(newPath, req.file.buffer);
        fs.rmSync(path.join(resources, req.params.id, realUc.foto));

        realUc.foto = name;
        realUc.nome = req.body.nome;
        realUc.email = req.body.email;
        realUc.filiacao = req.body.filiacao;
        realUc.categoria = req.body.categoria;
        realUc.webpage = req.body.webpage;

        const dt = await uc.update(req.params.id, u);

        res.status(200).json(dt);
    }).catch(error => res.status(400).json(error));
});

router.delete('/:id/docentes/:docenteId', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findById(req.params.id).then(async u => {
        if (req.user.nivel < auth.ADMIN && prevUC.producer !== req.user._id) {
            res.status(401).json({ error: 'You have not permission for this operation.' });
            return;
        }

        const t = u.docentes.filter(p => p._id.toString() === req.params.docenteId);
        u.docentes = u.docentes.filter(p => p._id.toString() !== req.params.docenteId);

        fs.rmSync(path.join(resources, req.params.id, t[0].foto));

        const dt = await uc.update(req.params.id, u);

        res.status(200).json(dt);
    }).catch(error => res.status(404).json(error));
});


//------------------------------------------------------------------------------
// Recursos
//------------------------------------------------------------------------------

router.get('/:id/recursos/', (req, res) => {
    uc.findById(req.params.id)
        .then(data => {
            if (req.user.nivel !== auth.ADMIN && req.user._id !== data.producer.toString() && data.users.filter(d => d._id.toString() === req.user._id).length === 0) {
                res.status(401).json({ error: 'You are not a member of this class.' });
                return;
            }

            res.status(201).json(data.resources);
        })
        .catch(error => res.status(400).json(error));
});

router.get('/:id/recursos/:recurso', (req, res) => {
    uc.findById(req.params.id)
        .then(data => res.status(201).json(data.resources.filter(p => p._id.toString() === req.params.recurso)[0]))
        .catch(error => res.status(400).json(error));
});

router.post('/:id/recursos/', auth.requireLevel(auth.PRODUCER), upload.single('ficheiro'), (req, res) => {
    uc.findById(req.params.id)
        .then(async (u) => {
            if (req.user.nivel < auth.ADMIN && prevUC.producer !== req.user._id) {
                res.status(401).json({ error: 'You have not permission for this operation.' });
                return;
            }

            const name = crypto.randomUUID() + path.extname(req.file.originalname);
            let newPath = path.join(resources, req.params.id, name);

            u.resources.push({
                _id: name,
                originalFilename: req.file.originalname,
                titulo: req.body.titulo,
                descricao: JSON.parse(req.body.descricao),
            });

            fs.writeFileSync(newPath, req.file.buffer);

            await uc.update(req.params.id, u);

            res.status(200).json({ name });
        }).catch(error => res.status(400).json(error));
});

router.delete('/:id/recursos/:recurso', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findById(req.params.id).then(async u => {
        if (req.user.nivel < auth.ADMIN && prevUC.producer !== req.user._id) {
            res.status(401).json({ error: 'You have not permission for this operation.' });
            return;
        }

        const qtd = u.resources.length;
        u.resources = u.resources.filter(p => p._id.toString() !== req.params.recurso);

        if (qtd === u.resources.length) {
            res.status(404).json({ error: 'Resource not found' });
            return;
        }

        const newPath = path.join(resources, req.params.id, req.params.recurso);

        fs.rmSync(newPath);

        const dt = await uc.update(req.params.id, u);

        res.status(200).json(dt);
    }).catch(error => res.status(400).json(error));
});

//------------------------------------------------------------------------------
// Users
//------------------------------------------------------------------------------
router.post('/:id/users', (req, res) => {
    uc.findById(req.params.id)
        .then(async u => {
            u.users.push(req.user._id);

            const dt = await uc.update(req.params.id, u);

            res.status(200).json(dt);
        }).catch(error => res.status(400).json(error));
});

router.get('/:id/users', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findByIdWithUsers(req.params.id)
        .then(async u => {
            if (req.user.nivel < auth.ADMIN && u.producer !== req.user._id) {
                res.status(401).json({ error: 'You have not permission for this operation.' });
                return;
            }

            res.status(200).json(u[0].users);
        }).catch(error => res.status(400).json(error));
});

router.delete('/:id/users/:idUtilizador', auth.requireLevel(auth.PRODUCER), (req, res) => {
    uc.findById(req.params.id)
        .then(async u => {
            if (req.user.nivel < auth.ADMIN && u.producer !== req.user._id) {
                res.status(401).json({ error: 'You have not permission for this operation.' });
                return;
            }

            u.users = u.users.filter(d => d._id.toString() !== req.params.idUtilizador);
            const dt = await uc.update(req.params.id, u);
            res.status(200).json(dt);
        }).catch(error => res.status(400).json(error));
});

/*router.use('/:id/aulas', aulasRouter);
router.use('/:id/docentes', docentesRouter);*/

module.exports = router;
