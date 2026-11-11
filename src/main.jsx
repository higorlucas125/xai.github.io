import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ProvedorIdioma, idiomaInicial, traduzir } from './i18n/idioma.jsx'
import './estilos.css'

const raiz = createRoot(document.getElementById('root'))

// Caminho relativo: funciona em https://higorlucas125.github.io/xai.github.io/ e localmente
fetch('./modelo.json')
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  })
  .then((modelo) => raiz.render(
    <ProvedorIdioma>
      <App modelo={modelo} />
    </ProvedorIdioma>,
  ))
  .catch((e) => raiz.render(
    <div className="erro-carga" role="alert">
      {traduzir(idiomaInicial(), 'erro.carga', { msg: e.message })}
    </div>,
  ))
