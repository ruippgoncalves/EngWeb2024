import fs from 'fs';
import axios from "axios";

(async () => {
    const files = ['data/dataset-extra1.json', 'data/dataset-extra2.json', 'data/dataset-extra3.json'];

    for (const file of files) {
        const data = JSON.parse(fs.readFileSync(file)).pessoas;

        for (let i = 0; i < data.length; i++) {
            if ('BI' in data[i]) {
                data[i]._id = data[i]['BI'];
                delete data[i]['BI'];
            } else if ('CC' in data[i]) {
                data[i]._id = data[i]['CC'];
                delete data[i]['CC'];
            } else {
                console.log('No BI or CC found in pessoa', data[i]);
            }

            await axios.post('http://localhost:3000/pessoas', data[i])
                .then(() => console.log('Pessoa inserida com sucesso'));
        }
    }
})();
