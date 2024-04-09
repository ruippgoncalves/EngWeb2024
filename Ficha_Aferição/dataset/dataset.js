import fs from 'fs';

const dt = fs.readFileSync('data/dataset.json');
const data = JSON.parse(dt);

console.log(Object.keys(data));

for (let col of Object.keys(data)) {
    const dtCol = data[col];

    if (col === 'pessoas') {
        //let modalidades = new Set();

        for (let i = 0; i < dtCol.length; i++) {
            if ('BI' in dtCol[i]) {
                dtCol[i]._id = dtCol[i]['BI'];
                delete dtCol[i]['BI'];
            } else if ('CC' in dtCol[i]) {
                dtCol[i]._id = dtCol[i]['CC'];
                delete dtCol[i]['CC'];
            } else {
                console.log('No BI or CC found in pessoa', dtCol[i]);
            }

            //dtCol[i].desportos.forEach(d => modalidades.add(d));
        }

        /*modalidades = Array.from(modalidades);
        const modalidade2id = {};
        modalidades = modalidades.map(m => {
            const id = new mongoose.Types.ObjectId();
            modalidade2id[m] = id;

            return {
                _id: id,
                modalidade: m
            };
        });

        fs.writeFileSync(`data/dataset-modalidades.json`, JSON.stringify(modalidades));

        for (let i = 0; i < dtCol.length; i++) {
            dtCol[i].desportos = dtCol[i].desportos.map(d => modalidade2id[d]);
        }*/
    }

    fs.writeFileSync(`data/dataset-${col}.json`, JSON.stringify(dtCol));
}
