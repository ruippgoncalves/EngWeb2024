const ucs = {};
const ucsOrder = [];
const ucsTable = document.getElementById('ucs-table');

Array.from(document.getElementsByTagName('tr')).filter(tr => tr.id.startsWith('uc-')).forEach(tr => {
    ucs[tr.id.substring(3)] = tr.outerHTML;
    ucsOrder.push(tr.id.substring(3));
});

document.getElementById('searchbar').addEventListener('input', async (e) => {
    if (e.target.value === '') {
        ucsTable.innerHTML = ucsOrder.map(id => ucs[id]).join('');
        return;
    }

    const search = await fetch('/search/ucs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search: e.target.value })
    }).then(res => res.json());

    ucsTable.innerHTML = '';

    search.forEach(id => {
        ucsTable.innerHTML += ucs[id];
    });
});
