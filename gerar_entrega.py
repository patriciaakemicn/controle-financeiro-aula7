from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import re

pasta = Path(__file__).resolve().parent
url = (pasta / 'github.txt').read_text().strip()
if not re.fullmatch(r'https://github\.com/[^/\s]+/[^/\s]+/?', url):
    raise SystemExit('Preencha github.txt com o URL real do repositorio publico antes de gerar a entrega.')
itens = ['src', 'test', 'package.json', 'package-lock.json', 'tsconfig.json', 'nest-cli.json', '.env.example', 'github.txt']
with ZipFile(pasta / 'aula7_entrega.zip', 'w', ZIP_DEFLATED) as zip:
    for nome in itens:
        item = pasta / nome
        arquivos = sorted(item.rglob('*')) if item.is_dir() else [item]
        for arquivo in arquivos:
            if arquivo.is_file():
                zip.write(arquivo, arquivo.relative_to(pasta))
print('Criado aula7_entrega.zip. Confira tambem se o repositorio esta publico.')
