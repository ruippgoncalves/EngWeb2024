$(document).ready(() => {
    let docentes = 1;

    // TODO Should I stay or Should I Go - Em homenagem ao R4ndomJ
    // TODO Should i do jquery?
    $('#newDocente').click((event) => {
        event.preventDefault()

        docentes = $('#docentes').children().length + 1;
        $('#docentes').append(`
            <fieldset id="docente${docentes}" class="w3-margin w3-padding">
                <label class="white-smoke" for="nome">Nome:</label>
                <input class="w3-input w3-round w3-border" placeholder="Nome" type="text" name="nome" required/>
                <label class="white-smoke" for="foto">Foto:</label>
                <input class="white-smoke w3-input w3-round w3-border" type="file" name="foto${docentes}" required/>
                <label class="white-smoke" for="categoria">Categoria:</label>
                <input class="w3-input w3-round w3-border" placeholder="Categoria" type="text" name="categoria" required/>
                <label class="white-smoke" for="filiacao">Filiação:</label>
                <input class="w3-input w3-round w3-border" placeholder="Filiação" type="text" name="filiacao" required/>
                <label class="white-smoke" for="email">Email:</label>
                <input class="w3-input w3-round w3-border" placeholder="Email" type="text" name="email" required/>
                <label class="white-smoke" for="webpage">Web Page:</label>
                <input class="w3-input w3-round w3-border" placeholder="Web Page" type="text" name="webpage"/>
            </fieldset>
            `);
    });

    document.getElementById('form').addEventListener('formdata', function (event) {
        const formData = event.formData;

        const docentes = [];
        const entities = ['nome', 'foto', 'categoria', 'filiacao', 'email', 'webpage'];

        for (let i = 0; i < formData.getAll('nome').length; i++) {
            const obj = {};

            for (const entity of entities) {
                if (entity === 'foto') {
                    obj[entity] = formData.getAll(`${entity}${i + 1}`)[0].name; //TODO alterei verificar 
                } else {
                    obj[entity] = formData.getAll(entity)[i];
                }
            }

            docentes.push(obj);
        }

        formData.set('docentes', JSON.stringify(docentes));

        for (const entry of formData.entries()) {
            if (entry[0] !== 'docentes' && !entry[0].startsWith('foto')) {
                formData.delete(entry[0]);
            }
        }
    });
});