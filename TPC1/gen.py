import json
import os
import re
import shutil
from datetime import datetime
from random import shuffle

from utils.html_from_str_template import load_all_templates

text_dir = 'data/texto'
atual_dir = 'data/atual'
build_dir = 'build'

templates = {}
imgs = []

index = {
    'tag': 'index',
    'content': []
}
cur_id = ''
cur_title = ''


def get_tag(text, tag):
    for t in text['content']:
        if 'tag' in t and t['tag'] == tag:
            return t

        try:
            return get_tag(t, tag)
        except:
            continue

    raise ValueError('Invalid search in tag')


def get_text_content(text):
    return get_tag(text, '#text')['text']


def read_meta(text):
    global cur_id, cur_title
    cur_id = get_text_content(get_tag(text, 'número'))
    cur_title = get_text_content(get_tag(text, 'nome'))


def adjust_img_src(src):
    p = os.path.join(text_dir, src)
    return os.path.relpath(p, build_dir)


def create_text(text):
    args = {}

    if text['tag'] == '#text':
        args['content'] = text['text']
    elif text['tag'] == 'figura':
        args['id'] = text['attributes']['id']
        args['src'] = adjust_img_src(get_tag(text, 'imagem')['attributes']['path'])
        args['alt'] = get_text_content(get_tag(text, 'legenda'))
    elif text['tag'] == 'meta':
        read_meta(text)
    elif text['tag'] == 'index':
        s = dict(text['content'])
        lis = [templates['index-item'].render(id=id, name=s[id], src=l) for id, l in imgs]
        args['content'] = ''.join(lis)
    else:
        args['content'] = ''.join([create_text(t) for t in text['content']])

    if text['tag'] not in templates:
        return args['content'] if 'content' in args else ''

    return templates[text['tag']].render(**args)


def create_page(text):
    # TODO is it supposed to sort for a given order or leave as it is on the xml? 33
    # TODO 23 casas contains multiple of the same

    content = create_text(text)
    render = templates['page'].render(title=cur_title, content=content, date=datetime.today().strftime('%d/%m/%Y'))

    out = open(os.path.join(build_dir, cur_id + '.html'), 'w', encoding='utf-8')
    out.write(render)
    out.close()

    index['content'].append((cur_id, cur_title))

if __name__ == '__main__':
    # xml2json(text_dir)
    templates = load_all_templates('templates')

    # Image map
    for i in os.listdir(atual_dir):
        imgs.append((re.search(r'\d+', i).group(), os.path.join(atual_dir, i)))

    # TODO line to send
    # TODO zip file names (is it suposed)
    # TODO is it sorted?
    shuffle(imgs)

    # Build dir
    if os.path.exists(build_dir):
        shutil.rmtree(build_dir)
    os.makedirs(build_dir)

    # Build the page for each text
    for filename in os.listdir(text_dir):
        if not filename.endswith('.json'):
            continue

        json_data = os.path.join(text_dir, filename)
        json_data = open(json_data, 'r', encoding='utf-8')
        json_data = json.load(json_data)
        create_page(json_data)

    # Index
    cur_id = 'index'
    cur_title = 'Ruas de Braga'
    create_page(index)
