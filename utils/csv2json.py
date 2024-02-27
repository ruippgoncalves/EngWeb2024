import os
import re
import sys
import csv
import json


def _append_text(where, text):
    trimmed = re.sub(r'\s+(?![\n])', ' ', text)
    trimmed = trimmed.replace(' ,', ',')
    where.append({'tag': '#text', 'text': trimmed})


def _xml_to_dict(element):
    result = {'tag': element.tag, 'attributes': dict(element.attrib)}

    result['content'] = []

    if element.text and element.text.strip():
        _append_text(result['content'], element.text)

    for child in element:
        result['content'].append(_xml_to_dict(child))

        if child.tail and child.tail.strip():
            _append_text(result['content'], child.tail)

    return result


def csv2json(folder):
    for filename in os.listdir(folder):
        if not filename.endswith('.csv'):
            continue

        f = open(os.path.join(folder, filename), 'r', encoding='utf-8')
        csv_reader = csv.DictReader(f, delimiter=';')

        data = []

        for row in csv_reader:
            data.append(row)

        json_file = open(os.path.join(folder, filename.replace('.csv', '.json')), 'w', encoding='utf-8')
        json.dump(data, json_file, ensure_ascii=False, indent=4)
        json_file.close()


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Usage: python csv2json.py <folder>')
        exit(1)

    folder = sys.argv[1]

    csv2json(folder)
