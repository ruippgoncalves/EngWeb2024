function createRuffleEmbed(id, project) {
    if (!document.getElementById(`embed-${project}`).hasChildNodes()) {
        document.getElementById(`embed-${project}-default`).classList = 'hidden';

        RuffleEmbed.createRuffleEmbed(`embed-${project}`, `/static/${id}/${project}`);

        let elem1 = document.getElementById(`embed-${project}`);
        elem1.classList = 'w3-container w3-margin w3-padding';

        let elem2 = document.getElementById(`embed-${project}-meta`);
        elem2.innerHTML = `
            Powered by <a href="https://ruffle.rs/" target="_blank">Ruffle</a>
            <br>
            <div class="flexbox">
                <a href="javascript:void(0)" onclick="removeRuffleEmbed('${project}')" class="button margin-10px padding-10px border-1px-black">Fechar Recurso</a>
                <a href="/ucs/${id}/resources/${project}" class="button margin-10px padding-10px border-1px-black">Abrir noutro separador</a>
            </div>`;
        elem2.classList = 'w3-container w3-margin w3-padding';

        let elem3 = document.getElementById(`embed-${project}-container`);
        elem3.classList = 'resource-container';
    }
}

function removeRuffleEmbed(project) {
    let elem1 = document.getElementById(`embed-${project}`);
    elem1.classList = 'hidden';
    elem1.innerHTML = '';

    let elem2 = document.getElementById(`embed-${project}-meta`);
    elem2.classList = 'hidden';
    elem2.innerHTML = '';

    let elem3 = document.getElementById(`embed-${project}-container`);
        elem3.classList = 'hidden';

    document.getElementById(`embed-${project}-default`).classList = 'w3-container flexbox flex-grow space-between';
}
