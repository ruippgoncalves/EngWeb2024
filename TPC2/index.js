import axios from "axios";
import {MiniExpress, MiniRouter} from "./miniexpress.js";

const PORT = process.env.PORT || "5000";

let app = new MiniExpress();
let students = new MiniRouter();
let courses = new MiniRouter();
let instruments = new MiniRouter();

app.get('/', (req, res) => {
    res.sendMJinja2('templates/index.html', {});
});

app.route('/alunos', students);
app.route('/cursos', courses);
app.route('/instrumentos', instruments);

// Students
students.get('/', async (req, res) => {
    try {
        const d = await axios.get('http://localhost:3000/alunos?_sort=nome');

        res.sendMJinja2('templates/alunos.html', {
            alunos: d.data,
        });
    } catch (_) {
        res.status(404);
        res.end();
    }
});

students.get('/:id', async (req, res) => {
    try {
        const d = await axios.get(`http://localhost:3000/alunos/${req.params.id}`);
        console.log(`http://localhost:3000/cursos/${d.data.curso}`)
        const d2 = await axios.get(`http://localhost:3000/cursos/${d.data.curso}`);

        res.sendMJinja2('templates/aluno.html', {
            aluno: d.data,
            curso: d2.data,
        });
    } catch (e) {
        console.dir(e)
        res.status(404);
        res.end();
    }
});

// Courses
courses.get('/', async (req, res) => {
    try {
        let query = 'http://localhost:3000/cursos?_sort=designacao';
        let inst = null;

        if ('instrumento' in req.url.query) {
            const id = req.url.query.instrumento;
            query += '&instrumento.id=' + id;
            inst = (await axios.get('http://localhost:3000/instrumentos/' + id)).data['#text']
        }

        const d = await axios.get(query);

        res.sendMJinja2('templates/cursos.html', {
            cursos: d.data,
            inst,
        });
    } catch (_) {
        res.status(404);
        res.end();
    }
});

courses.get('/:id', async (req, res) => {
    try {
        const d = await axios.get(`http://localhost:3000/cursos/${req.params.id}`);

        res.sendMJinja2('templates/curso.html', {
            curso: d.data,
        });
    } catch (_) {
        res.status(404);
        res.end();
    }
});

// Instruments
instruments.get('/', async (req, res) => {
    try {
        const d = await axios.get('http://localhost:3000/instrumentos?_sort=#text');

        res.sendMJinja2('templates/instrumentos.html', {
            instrumentos: d.data,
        });
    } catch (_) {
        res.status(404);
        res.end();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
