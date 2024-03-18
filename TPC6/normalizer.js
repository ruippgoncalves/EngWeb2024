const fs = require("fs");

const data = fs.readFileSync('data/compositores.json', 'utf-8');
const compositores = JSON.parse(data)['compositores'].filter(compositor => 'periodo' in compositor);

const periodos = Array.from(new Set(compositores.map(compositor => compositor.periodo))).map((periodo, i) => {
    return {
        _id: String(i),
        periodo: periodo,
    }
});

const periodosMap = {};

for (let periodo of periodos) {
    periodosMap[periodo.periodo] = periodo._id;
}

const compositorNormalizado = compositores.map(compositor => {
    const periodo = periodosMap[compositor.periodo];
    const id = compositor.id;

    delete compositor.periodo;
    delete compositor.id;

    return {
        _id: id,
        ...compositor,
        periodoId: periodo,
    }
});

fs.writeFileSync('data/compositors.json', JSON.stringify(compositorNormalizado), 'utf-8');
fs.writeFileSync('data/periodos.json', JSON.stringify(periodos), 'utf-8');
