import json

file = open('./data/filmes.json', mode='r', encoding='utf-8')

movies = []
genres = []
cast = []

for line in file:
    dt = json.loads(line)

    final = {
        'id': dt['_id']['$oid'],
        'title': dt['title'],
        'year': dt['year']
    }

    movies.append(final)

    g = dt.get('genres') or []
    c = dt.get('cast') or []

    # TODO I hate this, but the _embed performance is terrible
    for ge in g:
        genres.append({'genre': ge, 'movie': final})

    for ca in c:
        cast.append({'cast': ca, 'movie': final})

data = {
    'movies': movies,
    'genres': genres,
    'cast': cast,
}

file = open('./data/filmes_final.json', mode='w', encoding='utf-8')
json.dump(data, file, ensure_ascii=False, indent=4)
