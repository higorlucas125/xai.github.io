import { useIdioma } from '../i18n/idioma.jsx'
import { Linha } from './Graficos.jsx'

const INTEIRAS = new Set(['Posição da Gaiola na Estufa', 'Turno_num'])

export default function XaiGlobal({ modelo }) {
  const { t, n, curto } = useIdioma()
  const itens = Object.entries(modelo.metadados.importancia_permutacao).sort((a, b) => b[1] - a[1])
  const max = Math.max(...itens.map(([, v]) => v), 1e-6)
  const pdp = Object.entries(modelo.graficos.dependencia_parcial)

  return (
    <section id="xai" className="secao">
      <h2 className="font-display">{t('xai.titulo')}</h2>
      <p><strong>{t('xai.introForte')}</strong>{t('xai.intro')}</p>
      <ul className="importancias">
        {itens.map(([f, v]) => (
          <li key={f}>
            <span>{curto(f)}</span>
            <span className="contrib-barra">
              <span className="contrib-preench azul" style={{ width: `${Math.max(0, v / max) * 100}%` }} />
            </span>
            <span className="font-mono">{v >= 0 ? '+' : ''}{n(v, 4)}</span>
          </li>
        ))}
      </ul>

      <figure className="figura-grafico">
        <h3 className="titulo-grafico">{t('xai.pdpTitulo')}</h3>
        <div className="grade-pdp">
          {pdp.map(([f, { grade, valores }]) => (
            <Linha
              key={f} grade={grade} valores={valores} inteiro={INTEIRAS.has(f)}
              rotX={curto(f)} rotY={t('xai.pdpEixoY')}
            />
          ))}
        </div>
        <figcaption>{t('xai.pdpLegenda')}</figcaption>
      </figure>
    </section>
  )
}
