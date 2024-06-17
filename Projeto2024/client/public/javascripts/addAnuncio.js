$(document).ready(() => {
    let docentes = 1;

    // TODO Should I stay or Should I Go - Em homenagem ao R4ndomJ
    // TODO Should i do jquery?
    $('#newAnuncio').click(() => {
        event.preventDefault()

        anuncio = $('#anuncio').children().length + 1;
            //nao consigo testar no meu pc nao sei porque, mas ja tens o teu multiline (e so com um `)
        $('#anuncio').append(`
            <fieldset id="anuncio${anuncio}" class="w3-margin w3-padding">
                <label for="titulo">Titulo:</label>
                <input class="w3-input w3-round w3-border" type="text" name="titulo" required/>
                <label for="descricao1">Descrição:</label>
                <input class="w3-input w3-round w3-border" type="hidden" name="descricao" id ="descricao${anuncio}" required/>
            </fieldset>
            <script>
                var easyMDE = new EasyMDE({ element: document.getElementById('descricao${anuncio}') });
                document.getElementById('form').addEventListener('submit', function(e) {
                    document.getElementById('descricao${anuncio}').value = easyMDE.value();
                });
            </script>
        `);
    });          
   

    document.getElementById('form').addEventListener('formdata', function (event) {
        const formData = event.formData;

        const anuncios = [];
        const entities = ['titulo', 'descricao'];
        
        for (let i = 0; i < formData.getAll('titulo').length; i++) {
            const obj = {};

            for (const entity of entities) {
                obj[entity] = formData.getAll(entity)[i];
            }
            
            obj["data"] =  Date.now(); 

            anuncios.push(obj);
        }

        formData.set('anuncios', JSON.stringify(anuncios));

        for (const entry of formData.entries()) {
            if (entry[0] !== 'anuncios') {
                formData.delete(entry[0]);
            }
        }
    });
});