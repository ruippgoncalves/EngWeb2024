const http = require('http');
const data = require('./data');
const url = require('url');
const axios = require('axios');

http.createServer((req, res) => {
    console.log(data.myDateTime(), req.method, req.url);
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});

    res.write('<h1>Hello There</h1>');

    let q = url.parse(req.url, true);

/*    let n1 = parseInt(q.query.n1 ?? '0') ?? 0;
    let n2 = parseInt(q.query.n2 ?? '0') ?? 0;

    if (isNaN(n1)) n1 = 0;
    if (isNaN(n2)) n2 = 0;

    if (q.pathname === '/add') {
        res.write(`<pre>${n1} + ${n2} = ${n1 + n2}</pre>`);
    } else if (q.pathname === '/sub') {
        res.write(`<pre>${n1} - ${n2} = ${n1 - n2}</pre>`);
    } else if (q.pathname === '/mul') {
        res.write(`<pre>${n1} * ${n2} = ${n1 * n2}</pre>`);
    } else if (q.pathname === '/div') {
        res.write(`<pre>${n1} / ${n2} = ${n1 / n2}</pre>`);
    }*/

    if (q.pathname === '/cidades') {
        axios.get('http://localhost:3000/cidades')
            .then((dt) => {
                res.write('<ul>');
                for (let i in dt.data)
                    res.write(`<li>${dt.data[i].nome}</li>`);
                res.write('</ul>');
                res.end();
            })
            .catch((err) => {
                console.error(err);
            })
    } else {
        res.end();
    }
}).listen(5000);

console.log('Server running on port 3000');
