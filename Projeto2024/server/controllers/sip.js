const path = require('node:path');
const ucController = require('./uc');
const userController = require('./user');
const JSZip = require('jszip');
const fs = require('node:fs');
const xml2js = require('xml2js');
const { CONSUMER } = require('../auth/auth');
const { setEncription } = require('../models/user');

const resources = require('../utils').resources;

function validateSip(jsZip, result) {
    let fileCount = 0;

    if (!('manifest.xml' in jsZip.files)) {
        throw new Error('Erro ao importar a plataforma');
    }

    for (let uc of result['sites'].ucs[0].uc) {
        fileCount++;

        if (uc.resources[0].file !== undefined) {
            for (let file of uc.resources[0].file) {
                let filepath = `${uc['$'].sigla}/${file['$'].path}`;

                if (!(filepath in jsZip.files)) {
                    throw new Error('Erro ao importar a plataforma');
                }

                fileCount++;
            }
        }

        if (uc.pictures[0].file !== undefined) {
            for (let file of uc.pictures[0].file) {
                let filepath = `${uc['$'].sigla}/${file['$'].path}`;

                if (!(filepath in jsZip.files)) {
                    throw new Error('Erro ao importar a plataforma');
                }

                fileCount++;
            }
        }
    }

    if (fileCount !== Object.keys(jsZip.files).filter(a => !a.endsWith('/')).length - 1) {
        throw new Error('Erro ao importar a plataforma');
    }
}

module.exports.export = async (producer) => {
    const ucs = await ucController.listProducer(producer);

    if (ucs.length === 0) {
        throw new Error('Erro ao exportar a plataforma');
    }

    const zip = new JSZip();

    let manifest = {
        sites: {
            $: {
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:noNamespaceSchemaLocation': '/static/manifest.xsd',
            },
            ucs: [{
                uc: [],
            }],
        },
    };

    // Resources
    for (let uc of ucs) {
        const u = {
            $: {
                sigla: uc._id,
                path: `meta${uc._id}.json`,
            },
            resources: [{
                file: [],
            }],
            pictures: [{
                file: [],
            }],
        };

        for (let res of uc.resources) {
            const r = fs.readFileSync(path.join(resources, uc._id, res._id));
            zip.file(`${uc._id}/${res._id}`, r);

            u.resources[0].file.push({
                $: {
                    path: res._id,
                },
            });
        }

        for (let doc of uc.docentes) {
            const r = fs.readFileSync(path.join(resources, uc._id, doc.foto));
            zip.file(`${uc._id}/${doc.foto}`, r);

            u.pictures[0].file.push({
                $: {
                    path: doc.foto,
                },
            });
        }

        zip.file(`meta${uc._id}.json`, JSON.stringify({
            sigla: uc._id,
            titulo: uc.titulo,
            docentes: uc.docentes.map(d => ({
                nome: d.nome,
                foto: d.foto,
                categoria: d.categoria,
                filiacao: d.filiacao,
                email: d.email,
                webpage: d.webpage,
            })),
            horario: {
                teoricas: uc.horario.teoricas.map(d => d),
                praticas: uc.horario.praticas.map(d => d),
            },
            avaliacao: uc.avaliacao,
            datas: uc.datas.reduce((acc, cur) => {
                acc[cur.name] = cur.descricao;
                return acc;
            }),
            aulas: uc.aulas.map(d => ({
                tipo: d.tipo,
                data: d.data,
                sumario: d.sumario.map(d2 => d2),
            })),
            anuncios: uc.anuncios.map(d => ({
                data: d.data,
                titulo: d.titulo,
                descricao: d.descricao.map(d2 => d2)
            })),
            resources: uc.resources.map(d => ({ ...d })),
            users: uc.users,
        }));
        manifest.sites.ucs[0].uc.push(u);
    }

    const builder = new xml2js.Builder();
    const manifestXml = builder.buildObject(manifest);
    zip.file('manifest.xml', manifestXml);

    return await zip.generateAsync({ type: 'blob' });
};

module.exports.import = async (isAdmin, id, zip) => {
    const jsZip = await new JSZip().loadAsync(zip);

    if (!('manifest.xml' in jsZip.files)) {
        throw new Error('Erro ao importar a plataforma');
    }

    let manifest = await jsZip.files['manifest.xml'].async('string');

    const result = await new xml2js.Parser().parseStringPromise(manifest);

    validateSip(jsZip, result);

    for (let uc of result['sites'].ucs[0].uc) {
        let ucDirPath = path.join(resources, uc['$'].sigla);

        let t = await ucController.findById(uc['$'].sigla);

        if (t !== null) {
            if (!isAdmin && t.producer !== id)
                continue;

            await ucController.remove(uc['$'].sigla);
            fs.rmSync(ucDirPath, { recursive: true });
        }

        fs.mkdirSync(ucDirPath);

        let data = JSON.parse(await jsZip.files[uc['$'].path].async('string'));

        if (uc.resources[0].file !== undefined) {
            for (let file of uc.resources[0].file) {
                let filepath = `${uc['$'].sigla}/${file['$'].path}`;
                const f = await jsZip.files[filepath].async('nodebuffer');

                filepath = path.join(resources, filepath);
                fs.writeFileSync(filepath, f);
            }
        }

        for (let doc of data.docentes) {
            let filepath = `${uc['$'].sigla}/${doc.foto}`;
            const f = await jsZip.files[filepath].async('nodebuffer');

            filepath = path.join(resources, filepath);
            fs.writeFileSync(filepath, f);
        }

        data.producer = id;

        await ucController.insert(data);
    }
};

module.exports.exportComplete = async () => {
    const users = await userController.list();
    const zip = new JSZip();

    let manifest = {
        sites: {
            $: {
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                'xsi:noNamespaceSchemaLocation': '/static/complete-manifest.xsd',
            },
            users: [{
                user: [],
            }],
        },
    };

    for (let user of users) {
        const u = {
            $: {
                id: user._id,
                nome: user.nome,
                email: user.email,
                password: user.password,
                filiacao: user.filiacao,
                nivel: user.nivel,
                creationDate: user.creationDate,
                accessDate: user.accessDate,
                containsData: false,
            }
        };

        if (user.nivel !== CONSUMER) {
            try {
                zip.file(`${user._id}.zip`, await (await this.export(null, user._id)).arrayBuffer());
                u.$.containsData = true;
            } catch (e) {
            }
        }

        manifest.sites.users[0].user.push(u);
    }

    const builder = new xml2js.Builder();
    const manifestXml = builder.buildObject(manifest);
    zip.file('manifest.xml', manifestXml);

    return await zip.generateAsync({ type: 'blob' });
}

module.exports.importComplete = async (zip) => {
    const jsZip = await new JSZip().loadAsync(zip);

    if (!('manifest.xml' in jsZip.files)) {
        throw new Error('Erro ao importar a plataforma');
    }

    let manifest = await jsZip.files['manifest.xml'].async('string');

    const result = await new xml2js.Parser().parseStringPromise(manifest);

    let fileCount = 0;

    for (let u of result['sites'].users[0].user) {
        const user = u['$'];

        if (user.nivel === CONSUMER || user.containsData === 'false') continue;

        if (!(user.id + '.zip' in jsZip.files)) {
            throw new Error('Erro ao importar a plataforma');
        }

        const userZip = await jsZip.files[`${user.id}.zip`].async('nodebuffer');
        const userJsZip = await new JSZip().loadAsync(userZip);
        const userManifest = await userJsZip.files['manifest.xml'].async('string');
        const userResult = await new xml2js.Parser().parseStringPromise(userManifest);

        validateSip(userJsZip, userResult);

        fileCount++;
    }

    if (fileCount !== Object.keys(jsZip.files).length - 1) {
        throw new Error('Erro ao importar a plataforma');
    }

    await ucController.removeAll();
    await userController.deleteAll();
    fs.rmSync(resources, { recursive: true, force: true });
    fs.mkdirSync(resources);
    fs.writeFileSync(path.join(resources, '.gitkeep'), '');

    setEncription(false);

    for (let user of result['sites'].users[0].user) {
        let data = {
            _id: user['$'].id,
            nome: user['$'].nome,
            email: user['$'].email,
            password: user['$'].password,
            filiacao: user['$'].filiacao,
            nivel: user['$'].nivel,
            creationDate: user['$'].creationDate,
            accessDate: user['$'].accessDate,
        };

        await userController.addUser(data);

        if (user['$'].containsData === 'false') continue;

        const userZip = await jsZip.files[`${user['$'].id}.zip`].async('nodebuffer');
        await this.import(true, user['$'].id, userZip);
    }

    setEncription(true);
}
