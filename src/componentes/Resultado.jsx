import { useIdioma } from '../i18n/idioma.jsx'

function textoRecomendacao(rec, modelo, t, n, curto) {
  const [li, ls] = modelo.limites_ok
  const inf = rec.principal
    ? t('rec.influencia', { f: curto(rec.principal), e: `${rec.efeito >= 0 ? '+' : ''}${n(rec.efeito, 3)}` })
    : ''
  return t(`rec.${rec.tipo}`, { li: n(li, 1), ls: n(ls, 1), med: n(modelo.mediana_previsoes), inf })
}

export default function Resultado({ modelo, resultado, simulacao, posicaoAtual, onEscolherPosicao }) {
  const { t, n, curto } = useIdioma()
  const { quebra, status, contribuicoes, recomendacao } = resultado
  const [li, ls] = modelo.limites_ok
  const mae = modelo.mae_validacao
  const maxAbs = Math.max(...contribuicoes.map(([, v]) => Math.abs(v)), 1e-6)
  const { sims, melhor } = simulacao
  const ganho = sims[posicaoAtual - 1].quebra - melhor.quebra

  let textoGanho
  if (melhor.posicao === posicaoAtual) textoGanho = t('res.jaAtual')
  else if (ganho < 0.005) textoGanho = t('res.igualAtual')
  else textoGanho = t('res.ganho', { g: n(ganho) })

  return (
    <div className="cartao resultado" aria-live="polite">
      <div className="resultado-topo">
        <div>
          <span className="rotulo">{t('res.quebraPrevista')}</span>
          <div className="numero-grande font-mono">
            {n(quebra)}<span>%</span>
          </div>
          <span className="nota font-mono">
            {t('res.erroTipico', { mae: n(mae), li: n(li, 1), ls: n(ls, 1) })}
          </span>
        </div>
        <span className={`selo-status ${status === 'OK' ? 'ok' : 'nok'}`}>
          <span className="ponto" />{status}
        </span>
      </div>

      <p className="recomendacao">{textoRecomendacao(recomendacao, modelo, t, n, curto)}</p>

      <h3>{t('res.porque')} <span className="sufixo">{t('res.xaiLocal')}</span></h3>
      <p className="legenda">
        <span className="leg-pos">{t('res.aumenta')}</span>
        <span className="leg-neg">{t('res.reduz')}</span>
        <span>{t('res.legenda')}</span>
      </p>
      {maxAbs < 0.005 ? <p className="dica">{t('res.dicaMediana')}</p> : null}
      <ul className="contribuicoes">
        {contribuicoes.map(([f, v]) => (
          <li key={f}>
            <span className="contrib-nome">{curto(f)}</span>
            <span className="contrib-barra">
              <span
                className={`contrib-preench ${v >= 0 ? 'pos' : 'neg'}`}
                style={{ width: `${(Math.abs(v) / maxAbs) * 100}%` }}
              />
            </span>
            <span className="contrib-valor font-mono">{v >= 0 ? '+' : ''}{n(v, 3)}</span>
          </li>
        ))}
      </ul>

      <h3>{t('res.simulacao')}</h3>
      <div className="posicoes">
        {sims.map((s) => (
          <button
            type="button" key={s.posicao}
            className={[
              'posicao', s.posicao === melhor.posicao ? 'melhor' : '',
              s.posicao === posicaoAtual ? 'atual' : '',
            ].join(' ')}
            onClick={() => onEscolherPosicao(s.posicao)}
            aria-pressed={s.posicao === posicaoAtual}
            title={t('res.usarPosicao', { n: s.posicao })}
          >
            <span className="font-mono">P{s.posicao}</span>
            <span className="font-mono">{n(s.quebra)}%</span>
          </button>
        ))}
      </div>
      <p className="nota">
        {t('res.menorQuebra')} <strong>{t('res.posicaoN', { n: melhor.posicao })}</strong>
        {textoGanho}
        {ganho < mae ? t('res.naoSignificativa', { mae: n(mae) }) : t('res.significativa')}
      </p>
    </div>
  )
}
