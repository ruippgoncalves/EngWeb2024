$(document).ready(() => {
    $('#newAula').click(() => {
        event.preventDefault()

        let aulas = $('#aulas').children().length + 1;

        $('#aulas').append(`
            <fieldset class="w3-margin w3-padding">
                <div class="w3-margin w3-padding">
                    <label class="white-smoke" for="tipo">Tipo de aula:</label>
                    <input class="w3-input w3-round w3-border" type="text" name="tipo" placeholder="Tipo de aula" required/>
                </div>
                <div class="w3-margin w3-padding">
                    <label class="white-smoke" for="data">Data:</label>
                    <input class="w3-input w3-round w3-border" type="text" name="data" placeholder="Data" required/>
                </div>
                <div class="w3-margin w3-padding">
                    <label class="white-smoke" for="sumario">Sumário:</label>
                    <input class="w3-input w3-round w3-border" type="hidden" name="sumario" id="aula${aulas}" />
                </div>
            </fieldset>
        `);

        $('body').append(`
            <script>
                setTimeout(() => {
                    let easyMDE = new EasyMDE({ element: document.getElementById('aula${aulas}') });
                    document.getElementById('form').addEventListener('submit', function(e) {
                        document.getElementById('aula${aulas}').value = easyMDE.value();
                    });
                }, 0);
            </script>
        `);
    });          
});