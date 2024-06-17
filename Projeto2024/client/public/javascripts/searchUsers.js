const users = {};
const usersOrder = [];
const userList = document.getElementById('user-list');

Array.from(document.getElementsByClassName('card')).filter(c => c.id.startsWith('card-')).forEach(c => {
    users[c.id.substring(5)] = c.outerHTML;
    usersOrder.push(c.id.substring(5));
});

document.getElementById('searchUsers').addEventListener('input', async (e) => {
    if (e.target.value === '') {
        userList.innerHTML = usersOrder.map(id => users[id]).join('');
        return;
    }

    const search = await fetch('/search/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search: e.target.value })
    }).then(res => res.json());

    userList.innerHTML = '';

    search.forEach(id => {
        userList.innerHTML += users[id];
    });
});
