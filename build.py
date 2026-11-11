"""Genera un HTML autónomo sin dependencias de ejecución. Python 3, biblioteca estándar."""
from pathlib import Path
ROOT = Path(__file__).resolve().parent
src = ROOT / 'src'
html = (src / 'template.html').read_text(encoding='utf-8')
css = (src / 'styles.css').read_text(encoding='utf-8')
js = '\n'.join(path.read_text(encoding='utf-8') for path in sorted(src.glob('*.js')))
assert '</script>' not in js.lower(), 'Escape las etiquetas de cierre incluidas en textos JavaScript.'
html = html.replace('/*__STYLE__*/', css).replace('/*__SCRIPT__*/', js)
(ROOT / 'dist').mkdir(exist_ok=True)
(ROOT / 'dist' / 'index.html').write_text(html, encoding='utf-8')
(ROOT / 'MVP_S10_GORE_Ayacucho.html').write_text(html, encoding='utf-8')
print('Generados MVP_S10_GORE_Ayacucho.html y dist/index.html')
