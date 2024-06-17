$(document).ready(() => {
    let datas = 0
    let horariosTeoricos = 0
    let horariosPraticos = 0
    let avaliacoes = 0

    $('#newData').click(() => {
        event.preventDefault()

        datas = $('#datas').children().length;

        $('#datas').append(`
            <div id="data${datas}">
                <label class="w3-margin" for="dataNome${datas}"> Nome: </label>
                <input class="w3-input w3-round w3-border w3-margin" type="text" name="dataNome${datas}"/>
                <label class="w3-margin" for="dataDia${datas}"> Dia: </label>
                <input class="w3-input w3-round w3-border w3-margin" type="text" name="dataDia${datas}"/>
            </div>
        `);
    });
    
    $('#removeData').click(() => {
        event.preventDefault()

        datas = $('#datas').children().length;

        $(`#data${datas}`).remove()
    });

    $('#newHorarioTeorico').click(() => {
        event.preventDefault()

        horariosTeoricos = $('#teoricas').children().length;

        $('#teoricas').append(`
            <input class="w3-input w3-round w3-border w3-margin" type="text" name="horarioTeorico${horariosTeoricos}" id="horarioTeorico${horariosTeoricos}"/>
        `);
    }); 

    $('#removeHorarioTeorico').click(() => {
        event.preventDefault()

        horariosTeoricos = $('#teoricas').children().length;

        $(`#horarioTeorico${horariosTeoricos}`).remove()
    });

    $('#newHorarioPratico').click(() => {
        event.preventDefault()

        horariosPraticos = $('#praticas').children().length;

        $('#praticas').append(`
            <input class="w3-input w3-round w3-border w3-margin" type="text" name="horarioPratico${horariosPraticos}" id="horarioPratico${horariosPraticos}"/>
        `);
    }); 

    $('#removeHorarioPratico').click(() => {
        event.preventDefault()

        horariosPraticos = $('#praticas').children().length;

        $(`#horarioPratico${horariosPraticos}`).remove()
    });

    $('#newAvaliacao').click(() => {
        event.preventDefault()

        avaliacoes = $('#avaliacoes').children().length;

        $('#avaliacoes').append(`
            <input class="w3-input w3-round w3-border w3-margin" type="text" name="avaliacao${avaliacoes}" id="avaliacao${avaliacoes}"/>
        `);
    }); 

    $('#removeAvaliacao').click(() => {
        event.preventDefault()

        avaliacoes = $('#avaliacoes').children().length;

        $(`#avaliacao${avaliacoes}`).remove()
    });
});