import json
import os
import shutil

file = open("data/mapa.json","r",encoding="UTF-8").read()

html = '''
<!DOCTYPE html>
<html>
<head>
    <title>IndiceEx</title>
    <meta charset="utf-8">
</head>
<body>
'''

template = html

context = json.loads(file)

html += "<ul>"

for elem in sorted(context["cidades"], key=lambda x: x["nome"]):
    html += f"<li><a href='{elem['nome']}.html'>{elem['nome']}</a></li>"

html += "</ul>"

html += "</body>"

html += "</html>"

if os.path.exists("build"):
    shutil.rmtree("build")
os.makedirs("build")

file = open("build/mapa.html","w",encoding="UTF-8")
file.write(html)
file.close()
