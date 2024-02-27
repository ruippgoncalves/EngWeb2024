import io
import os


class HTMLFromStrTemplate:
    def __init__(self, template):
        if isinstance(template, io.IOBase):
            template = template.read()

        self._template = template

    def render(self, **kwargs):
        return self._template.format(**kwargs)


def load_all_templates(folder):
    templates = {}

    for filename in os.listdir(folder):
        f = open(os.path.join(folder, filename), 'r', encoding='utf-8')
        filename = filename.rsplit('.', 1)[0]
        templates[filename] = HTMLFromStrTemplate(f)

    return templates
