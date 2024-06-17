const axios = require('axios');
const express = require('express');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const marked = require('marked');
const router = express.Router();
const { Feed } = require('feed');
const multer = require('multer');
const FormData = require('form-data');

const utils = require('../utils');

const auth = require('../auth/auth');
const { checkUCEddition, requireUCEddition, getUCEddition } = require('../auth/uc');

const inMermoryStorage = multer.memoryStorage();
const upload = multer({ storage: inMermoryStorage });

const dataAPI = utils.dataAPI;
const clientURL = utils.clientURL;

function processUCBody(body) {
    let ans = {
        sigla: body.sigla, //TODO era susposto ser id???
        titulo: body.titulo,
        docentes: [],
        horario: {
            teoricas: [],
            praticas: [],
        },
        avaliacao: [],
        datas: {},
        aulas: [],
        anuncios: [],
        resources: []
    }

    for (let k of Object.keys(body)) {
        if (/^horarioTeorico\d+$/.test(k)) {
            ans.horario.teoricas.push(body[k]);
        } else if (/^horarioPratico\d+$/.test(k)) {
            ans.horario.praticas.push(body[k]);
        } else if (/^avaliacao\d+$/.test(k)) {
            ans.avaliacao.push(body[k]);
        } else if (/^dataNome\d+$/.test(k)) {
            let num = /(\d+)/.exec(k)[1]

            ans.datas[body[k]] = body['dataDia' + num];
        } else if (/^dataDia\d+$/.test(k) || k === "sigla" || k === "titulo") {

        } else console.log("Chave não identificada! " + k);
    }

    return ans;
}

/* GET UCS listing. */
router.get('/', auth.checkToken, auth.requireLevel(auth.CONSUMER), checkUCEddition, function (req, res, next) {
    axios.get(dataAPI + `/uc`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(async (response) => {
        const ucs = []
        
        for (let uc of response.data) {
            uc.isProducer = await getUCEddition(req, uc._id);
            
            ucs.push(uc)
        }

        res.render('ucList', { ucs: ucs, title: process.env.SITE_NAME, producer: req.user.nivel === auth.PRODUCER, admin: req.user.nivel === auth.ADMIN, warning: null });
    }).catch(err => res.status(400).render('error', { title: 'Error', message: `There has been an error loading the page's content.`, error: err }));
});

router.get("/add", auth.checkToken, auth.requireLevel(auth.PRODUCER), function (req, res, next) {
    res.status(200).render('ucPageAdd', { title: process.env.SITE_NAME})
})

router.post("/add", auth.checkToken, auth.requireLevel(auth.PRODUCER), function (req, res, next) {
    let body = processUCBody(req.body)

    axios.post(dataAPI + `/uc`, body, {
        headers: {
            'Authorization': req.user.token
        },
    }).then(_ => {
        res.redirect(`/ucs`)
    }).catch(error => {
        res.status(200).render('ucPageAdd', { title: process.env.SITE_NAME ,warning: 'Nao foi possivel criar a UC'})
    })
})

router.get("/update/:id", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    axios.get(dataAPI + `/uc/${req.params.id}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        res.status(200).render('ucPageUpdate', { title: process.env.SITE_NAME, uc: response.data })
    }).catch(error => {
        res.status(503).render('error', { error: error })
    })
})

router.post("/update/:id", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    let body = processUCBody(req.body)

    delete body.aulas;
    delete body.docentes;
    delete body.resources;
    delete body.anuncios;

    axios.put(dataAPI + `/uc/${req.params.id}`, body, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(_ => {
        res.redirect(`/ucs`)
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
})

router.get("/delete/:id", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    axios.delete(dataAPI + `/uc/${req.params.id}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(_ => {
        res.redirect(`/ucs`)
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
})

router.get("/enroll", auth.checkToken, auth.requireLevel(auth.CONSUMER), function (req, res, next) {
    res.status(200).render('ucPageEnroll', { title: process.env.SITE_NAME })
})

router.post("/enroll", auth.checkToken, auth.requireLevel(auth.CONSUMER), function (req, res, next) {
    axios.post(dataAPI + `/uc/${req.body.ucCode}/users`, {}, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(_ => {
        res.redirect(`/ucs`)
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
})

router.get("/:id", auth.checkToken, auth.requireLevel(auth.CONSUMER), checkUCEddition, function (req, res, next) {
    axios.get(dataAPI + `/uc/${req.params.id}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        response.data.anuncios.sort((a, b) => new Date(b.data) - new Date(a.data))
        res.status(200).render('ucPage', { title: process.env.SITE_NAME, header: response.data.titulo, uc: response.data, producer: req.user.ucEditting, admin: req.user.nivel === 3 })
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
})

// TODO
//------------------------------------------------------------------------------
// Docentes
//------------------------------------------------------------------------------

router.get("/:id/docentes", auth.checkToken, auth.requireLevel(auth.CONSUMER), checkUCEddition, function (req, res, next) {
    axios.get(dataAPI + `/uc/${req.params.id}/docentes/`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        res.status(200).render('ucPageDocentes', { id: req.params.id, title: process.env.SITE_NAME, docentes: response.data, producer: req.user.ucEditting, admin: req.user.nivel === 3 })
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
})

router.get("/:id/docentes/add", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res) {
    res.status(200).render('ucPageDocentesAdd.pug', { id: req.params.id, title: process.env.SITE_NAME })
})

router.post("/:id/docentes/add", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, upload.any(), (req, res) => {
    const form = new FormData();

    for (let i = 0; i < req.files.length; i++) {
        form.append(`foto${i}`, req.files[i].buffer, { filename: req.files[i].originalname, contentType: req.files[i].mimetype });
    }

    form.append('docentes', req.body.docentes);

    axios.post(dataAPI + `/uc/${req.params.id}/docentes`, form, {
        ...form.getHeaders(),
        headers: {
            'Authorization': req.user.token,
        }
    })
        .then(_ => res.redirect(`/ucs/${req.params.id}/docentes`))
        .catch(error => res.status(503).render('error', { error: error }))
});

router.get("/:id/docentes/delete/:docenteId", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    axios.delete(dataAPI + `/uc/${req.params.id}/docentes/${req.params.docenteId}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        res.redirect(`/ucs/${req.params.id}/docentes`)
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
})

router.get("/:id/docentes/update/:docenteId", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    axios.get(dataAPI + `/uc/${req.params.id}/docentes/${req.params.docenteId}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        res.status(200).render('ucPageDocentesUpdate', { id: req.params.id, title: process.env.SITE_NAME, docente: response.data, docenteId: req.params.docenteId })
    }).catch(error => {
        res.status(503).render('error', { error: error })
    })
})

router.post("/:id/docentes/update/:docenteId", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, upload.single('foto'), (req, res) => {
    const form = new FormData();

    form.append('nome', req.body.nome);
    form.append('categoria', req.body.categoria);
    form.append('filiacao', req.body.filiacao);
    form.append('email', req.body.email);
    form.append('webpage', req.body.webpage);
    form.append('foto', req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });

    axios.put(dataAPI + `/uc/${req.params.id}/docentes/${req.params.docenteId}`, form, {
        ...form.getHeaders(),
        headers: {
            'Authorization': req.user.token
        }
    }).then(_ => {
        res.redirect(`/ucs/${req.params.id}/docentes`)
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
});


// TODO
//------------------------------------------------------------------------------
// Aulas
//------------------------------------------------------------------------------

router.get("/:id/aulas", auth.checkToken, auth.requireLevel(auth.CONSUMER), checkUCEddition, function (req, res, next) {
    axios.get(dataAPI + `/uc/${req.params.id}/aulas/`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        let aulas = [];

        for (let a of response.data) {
            const window = new JSDOM('').window;
            const DOMPurify = createDOMPurify(window);
            const sumario = DOMPurify.sanitize(marked.parse(a.sumario.join('\n\n')));

            aulas.push({
                _id: a._id,
                tipo: a.tipo,
                data: a.data,
                sumario: sumario
            })
        }

        res.status(200).render('ucPageAulas', { id: req.params.id, title: process.env.SITE_NAME, aulas: aulas, producer: req.user.ucEditting, admin: req.user.nivel === 3 })
    }).catch(error => {
        res.status(503).render('error', { error: error })
    })
})

router.get("/:id/aulas/add", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    res.status(200).render('ucPageAulasAdd.pug', { id: req.params.id, title: process.env.SITE_NAME })
})

router.post("/:id/aulas/add", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, (req, res, next) => {
    let body = [];

    if (typeof req.body.tipo === 'string') {
        body.push({
            tipo: req.body.tipo,
            data: req.body.data,
            sumario: req.body.sumario.split('\n\n'),
        })
    } else {
        for (let i = 0; i < req.body.tipo.length; i++) {
            body.push({
                tipo: req.body.tipo[i],
                data: req.body.data[i],
                sumario: req.body.sumario[i].split('\n\n'),
            })
        }
    }


    axios.post(dataAPI + `/uc/${req.params.id}/aulas/`, body, {
        headers: {
            'Authorization': req.user.token
        },
    }).then(_ => res.redirect(`/ucs/${req.params.id}/aulas`))
        .catch(error => res.status(503).render('error', { error: error }))
});

router.get("/:id/aulas/delete/:aulaId", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    axios.delete(dataAPI + `/uc/${req.params.id}/aulas/${req.params.aulaId}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        res.redirect(`/ucs/${req.params.id}/aulas`)
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
})

router.get("/:id/aulas/update/:aulaId", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    axios.get(dataAPI + `/uc/${req.params.id}/aulas/${req.params.aulaId}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        res.status(200).render('ucPageAulasUpdate', { id: req.params.id, title: process.env.SITE_NAME, aula: response.data, producer: req.user.ucEditting, admin: req.user.nivel === 3 })
    }).catch(error => {
        res.status(503).render('error', { error: error })
    })
})

router.post("/:id/aulas/update/:aulaId", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    let body = {
        tipo: req.body.tipo,
        data: req.body.data,
        sumario: req.body.sumario.split('\n\n'),
    }

    axios.put(dataAPI + `/uc/${req.params.id}/aulas/${req.params.aulaId}`, body, {
        headers: {
            'Authorization': req.user.token
        },
    }).then(_ => {
        res.redirect(`/ucs/${req.params.id}/aulas`)
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
})

// TODO
//------------------------------------------------------------------------------
// Recursos
//------------------------------------------------------------------------------

router.get("/:id/resources", auth.checkToken, auth.requireLevel(auth.CONSUMER), function (req, res, next) {
    axios.get(dataAPI + `/uc/${req.params.id}/recursos`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(resp => {
        let resources = resp.data;

        for (let r of resources) {
            const window = new JSDOM('').window;
            const DOMPurify = createDOMPurify(window);
            const descricao = DOMPurify.sanitize(marked.parse(r.descricao.join('\n\n')));
            r.descricao = descricao;
            r.isScratch = r._id.endsWith('.sb3');
            r.isPdf = r._id.endsWith('.pdf');
            r.isFlash = r._id.endsWith('.swf');
        }

        res.status(200).render('ucPageRecursos', { id: req.params.id, title: process.env.SITE_NAME, resources, producer: req.user.ucEditting, admin: req.user.nivel === 3, renderScratch: process.env.SCRATCH_RENDERING == 'true', renderPDF: process.env.PDFJS_RENDERING == 'true', renderFlash: process.env.FLASH_RENDERING == 'true'})
    }).catch(err => res.status(400).render('error', { error: err }))
})


router.get("/:id/resources/add", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    res.status(200).render('ucPageRecursosAdd.pug', { id: req.params.id, title: process.env.SITE_NAME })
})


router.post("/:id/resources/add", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, upload.single('ficheiro'), function (req, res, next) {
    const form = new FormData();

    req.body.descricao = req.body.descricao.split('\n\n');
    form.append('titulo', req.body.titulo);
    form.append('descricao', JSON.stringify(req.body.descricao));
    form.append('ficheiro', req.file.buffer, { filename: req.file.originalname, contentType: req.file.mimetype });

    axios.post(dataAPI + `/uc/${req.params.id}/recursos/`, form, {
        headers: {
            'Authorization': req.user.token
        }
    })
        .then(_ => res.redirect(`/ucs/${req.params.id}/resources`))
        .catch(err => res.status(400).render('error', { error: err }))
})

router.get("/:id/recursos/delete/:recursoId", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    axios.delete(dataAPI + `/uc/${req.params.id}/recursos/${req.params.recursoId}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(_ => res.redirect(`/ucs/${req.params.id}/resources`)).catch(err => res.status(400).render('error', { error: err }))
})

router.get("/:id/resources/:recursoId", auth.checkToken, auth.requireLevel(auth.CONSUMER), function (req, res, next) {
    axios.get(dataAPI + `/uc/${req.params.id}/recursos/${req.params.recursoId}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(resp => {
        let r = resp.data;

        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        const descricao = DOMPurify.sanitize(marked.parse(r.descricao.join('\n\n')));
        
        r.descricao = descricao;
        r.isScratch = r._id.endsWith('.sb3');
        r.isPdf = r._id.endsWith('.pdf');
        r.isFlash = r._id.endsWith('.swf');

        res.status(200).render('ucPageRecurso', { id: req.params.id, title: process.env.SITE_NAME, resource: r, producer: req.user.ucEditting, admin: req.user.nivel === 3, renderScratch: process.env.SCRATCH_RENDERING == 'true', renderPDF: process.env.PDFJS_RENDERING == 'true', renderFlash: process.env.FLASH_RENDERING == 'true' })
    }).catch(err => res.status(400).render('error', { error: err }))
})

// TODO
//------------------------------------------------------------------------------
// Inscritos
//------------------------------------------------------------------------------

router.get("/:id/users", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    axios.get(dataAPI + `/uc/${req.params.id}/users`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(async (resp) => {
        res.render('ucPageUsers', {
            id: req.params.id,
            title: process.env.SITE_NAME,
            users: resp.data,
            renderScratch: process.env.SCRATCH_RENDERING == 'true'
        })
    }).catch(err => res.status(400).render('error', { error: err }))
})

router.get("/:id/users/:userId", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    axios.delete(dataAPI + `/uc/${req.params.id}/users/${req.params.userId}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(_ => {
        res.redirect(`/ucs/${req.params.id}/users`);
    }).catch(err => res.status(400).render('error', { error: err }))
})

// TODO
//------------------------------------------------------------------------------
// Anuncios
//------------------------------------------------------------------------------

router.get("/:id/anuncios/add", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    res.status(200).render('ucPageAnunciosAdd.pug', { id: req.params.id, title: process.env.SITE_NAME + ': Adicionar anuncio' })
})

router.get("/:id/anuncios/:idAnuncio", auth.checkToken, auth.requireLevel(auth.CONSUMER), function (req, res, next) {
    axios.get(dataAPI + `/uc/${req.params.id}/anuncios/${req.params.idAnuncio}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        res.status(200).render('ucPageAnuncio', { id: req.params.id, title: process.env.SITE_NAME, anuncio: response.data, producer: req.user.ucEditting, admin: req.user.nivel === 3 })
    }).catch(error => {
        res.status(503).render('error', { error: error })
    })
})

router.post("/:id/anuncios/add", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, (req, res, next) => {
    req.body.descricao = req.body.descricao.split('\n\n');

    axios.post(dataAPI + `/uc/${req.params.id}/anuncios/`, req.body, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(_ => res.redirect(`/ucs/${req.params.id}`))
        .catch(error => res.status(503).render('error', { error: error }))
});

router.get("/:id/anuncios/delete/:anuncioId", auth.checkToken, auth.requireLevel(auth.PRODUCER), checkUCEddition, requireUCEddition, function (req, res, next) {
    axios.delete(dataAPI + `/uc/${req.params.id}/anuncios/${req.params.anuncioId}`, {
        headers: {
            'Authorization': req.user.token
        }
    }).then(response => {
        res.redirect(`/ucs/${req.params.id}/`)
    }).catch(error => {
        res.status(400).render('error', { error: error })
    })
})

//------------------------------------------------------------------------------
// Feed
//------------------------------------------------------------------------------

async function getFeed(id) {
    const uc = (await axios.get(dataAPI + `/uc/${id}/anuncios`)).data;
    const posts = uc.anuncios;

    const feed = new Feed({
        title: process.env.SITE_NAME + uc.titulo,
        description: `Anuncios da Unidade Curricular de ${uc.titulo}`,
        id: `${clientURL}/${id}`,
        link: `${clientURL}/${id}`,
        language: 'pt',
        image: `${clientURL}/images/logo.jpg`,
        favicon: `${clientURL}/images/logo.jpg`,
        updated: new Date(),
        generator: 'Sites Generator',
        feedLinks: {
            atom: `${clientURL}/ucs/${id}/feed/atom`,
            rss: `${clientURL}/ucs/${id}/feed/rss`,
        },
        author: {
            name: 'UMinho Corp',
            email: 'We dont have an email',
        },
    });

    posts.forEach(post => {
        const window = new JSDOM('').window;
        const DOMPurify = createDOMPurify(window);
        const content = DOMPurify.sanitize(marked.parse(post.descricao.join('\n\n')));

        feed.addItem({
            title: process.env.SITE_NAME + post.titulo,
            id: `${clientURL}/ucs/${id}/anuncios/${post._id}`,
            link: `${clientURL}/ucs/${id}/anuncios/${post._id}`,
            description: uc.title,
            content,
            date: new Date(post.data),
        });
    });

    return {
        rss: feed.rss2(),
        atom: feed.atom1(),
    };
}

router.get("/:id/feed/atom", async function (req, res, next) {
    const feed = await getFeed(req.params.id);
    res.header('Content-Type', 'application/atom+xml');
    res.status(200).send(feed.atom);
});

router.get("/:id/feed/rss", async function (req, res, next) {
    const feed = await getFeed(req.params.id);
    res.header('Content-Type', 'application/rss+xml');
    res.status(200).send(feed.rss);
});

module.exports = router;
