import fs from "fs";

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
    delete compositor.periodo;

    return {
        ...compositor,
        periodoId: periodo,
    }
});

fs.writeFileSync('data/compositores-final.json', JSON.stringify({
    compositores: compositorNormalizado,
    periodos: periodos,
}), 'utf-8');
