import os
import sys
import xml.etree.ElementTree as ET
import json

def parse_xml_to_json(xml, json_data):
    tag = {}
    attrs = {}
    
    for key, value in xml.attrib.items():
        attrs[key] = value

    if attrs:
        tag['attributes'] = attrs

    if xml.text and xml.text.strip():
        tag['text'] = xml.text

    for child in xml:
        parse_xml_to_json(child, tag)

    json_data[xml.tag] = tag

if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Usage: python xml2json.py <folder>')
        exit(1)

    folder = sys.argv[1]

    for filename in os.listdir(folder):
        if not filename.endswith('.xml'):
            continue

        f = open(os.path.join(folder, filename), 'r', encoding='utf-8')
        data = ET.parse(f).getroot()

        json_data = {}

        parse_xml_to_json(data, json_data)

        json_file = open(os.path.join(folder, filename.replace('.xml', '.json')), 'w', encoding='utf-8')
        json.dump(json_data, json_file, ensure_ascii=False, indent=4)
