document.getElementById('form').addEventListener('formdata', function (event) {
    const formData = event.formData;

    const recurso = [];
    const entities = ['titulo', 'descricao', 'originalFilename',"ficheiro"];


    for (const entity of entities) {
        if (entity === 'ficheiro') {
            obj[entity] = formData.getAll(`${entity}${i + 1}`)[0].name; //TODO alterei verificar 
        } else {
            obj[entity] = formData.getAll(entity)[i];
        }

        recurso.push(obj);
    }

    formData.set('recursos', JSON.stringify(recurso));

    for (const entry of formData.entries()) {
        if (entry[0] !== 'recursos' && !entry[0].startsWith('foto')) {
            formData.delete(entry[0]);
        }
    }
});
