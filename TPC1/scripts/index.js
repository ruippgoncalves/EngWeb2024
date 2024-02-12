let listItems = Array.from(document.querySelectorAll('li'));

listItems = listItems.map(e => {
    return {
        item: e,
        text: e.children[0].children[1].innerText,
    };
});

let fuse = new Fuse(Array.from(listItems), {
    keys: ['text'],
    includeScore: true,
});

function search(e) {
    let query = String(e.target.value);
    let result = fuse.search(query);

    if (result.some((e) => e.score === 0))
        result = result.filter((e) => e.score === 0)
    else
        result = result.filter((e) => e.score <= .3)

    console.log(result);

    listItems.forEach(function (item) {
        item.item.style.display = 'none';
    });

    result.forEach(function (item) {
        item.item.item.style.display = 'list-item';
    });

    if (result.length === 0 && query === '') {
        listItems.forEach(function (item) {
            item.item.style.display = 'list-item';
        });
    }

    return true;
}

let searchIn = document.querySelector('#search');

searchIn.onchange = search;
searchIn.onkeypress = search;
searchIn.onpaste = search;
searchIn.oninput = search;
