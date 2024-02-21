import axios from "axios";
import {MiniExpress, MiniRouter} from "./miniexpress.js";

const PORT = process.env.PORT || "5000";

let app = new MiniExpress();
let router = new MiniRouter();

app.get('/', (req, res) => {
    res.sendHTML('<h1>Hello There</h1>');
});

app.get('/dummy', (req, res) => {
    axios.get('http://localhost:3000/alunos')
        .then((dt) => {
            res.sendHTML('Dummy');
        })
        .catch((err) => {
            console.error(err);
            res.end();
        });
});

app.route('/route', router);

router.get('/', (req, res) => {
    res.sendHTML('<h1>Hello There 2</h1>');
});

router.get('/:id', (req, res) => {
    res.sendMJinja2('templates/index.html', {title: req.params.id});
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

