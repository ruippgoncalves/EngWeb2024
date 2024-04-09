$(document).ready(function() {
    $.get('/pessoas', function(data) {
        data.forEach(function(item) {
            $('#data').append(`<tr>
            <td>${item._id}</td>
            <td>${item.nome}</td>
            <td>${item.sexo}</td>
            <td>${item.morada.cidade}${'distrito' in item.morada? `, ${item.morada.distrito}` : ''}</td>
            <td>${item.descrição}</td>
            <td>${item.profissao}</td>
            <td>${item.partido_politico.party_name} (${item.partido_politico.party_abbr})</td>
            <td>${'religiao' in item ? item.religiao : '---'}</td>
            <td>${item.desportos.join(', ')}</td>
            <td>${item.animais.join(', ')}</td>
            <td>${item.figura_publica_pt.join(', ')}</td>
            <td>${item.marca_carro}</td>
            <td>${item.destinos_favoritos.join(', ')}</td>
            <td>${item.atributos.fumador ? 'Sim' : 'Não'}</td>
            <td>${item.atributos.gosta_cinema ? 'Sim' : 'Não'}</td>
            <td>${item.atributos.gosta_viajar ? 'Sim' : 'Não'}</td>
            <td>${item.atributos.acorda_cedo ? 'Sim' : 'Não'}</td>
            <td>${item.atributos.gosta_ler ? 'Sim' : 'Não'}</td>
            <td>${item.atributos.gosta_musica ? 'Sim' : 'Não'}</td>
            <td>${item.atributos.gosta_comer ? 'Sim' : 'Não'}</td>
            <td>${item.atributos.gosta_animais_estimacao ? 'Sim' : 'Não'}</td>
            <td>${item.atributos.gosta_dancar ? 'Sim' : 'Não'}</td>
            <td>${item.atributos.comida_favorita}</td>
            </tr>`);
        });

        $('#loading').hide();
    });
});