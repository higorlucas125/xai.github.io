import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './estilos.css'

const raiz = createRoot(document.getElementById('root'))

// Caminho relativo: funciona em https://higorlucas125.github.io/xai.github.io/ e localmente
fetch('./modelo.json')
  .then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return r.json()
  })
  .then((modelo) => raiz.render(<App modelo={modelo} />))
  .catch((e) => raiz.render(
    <div className="erro-carga" role="alert">
      Não foi possível carregar o modelo ({e.message}). Recarregue a página.
    </div>,
  ))
