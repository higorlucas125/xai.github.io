import { CONTROLES } from '../rotulos.js'
import { useIdioma } from '../i18n/idioma.jsx'

const CONTINUAS = ['TRs', 'TNs', 'shpTRs', 'Peso de Entrada da Gaiola (kg)', 'Tempo_h']

function arredondar(v, passo) {
  return Math.round(v / passo) * passo
}

function Controle({ feature, faixa, valor, onChange, desabilitado = false, textoValor }) {
  const { nome, n } = useIdioma()
  const { unidade, passo } = CONTROLES[feature]
  const [min, max] = [arredondar(faixa[0], passo), arredondar(faixa[1], passo)]
  const id = `campo-${feature.replace(/\W+/g, '-')}`
  const casas = passo < 1 ? 1 : 0
  return (
    <div className="controle">
      <div className="controle-topo">
        <label htmlFor={id}>{nome(feature)}</label>
        <span className="controle-valor font-mono">
          {textoValor ?? `${n(valor, casas)}${unidade ? ` ${unidade}` : ''}`}
        </span>
      </div>
      <input
        id={id} type="range" min={min} max={max} step={passo}
        value={Math.min(max, Math.max(min, valor))}
        disabled={desabilitado}
        onChange={(e) => onChange(feature, parseFloat(e.target.value))}
      />
      <div className="controle-faixa font-mono">
        <span>{n(min, casas)}</span>
        <span>{n(max, casas)}</span>
      </div>
    </div>
  )
}

export default function Formulario({ modelo, valores, onChange, hrsSemLeitura, onHrsSemLeitura, onRestaurar }) {
  const { t } = useIdioma()
  const { faixas } = modelo
  return (
    <form className="cartao" onSubmit={(e) => e.preventDefault()} aria-label={t('form.titulo')}>
      <div className="cartao-cabecalho">
        <h2 className="font-display">{t('form.titulo')}</h2>
        <button type="button" className="botao-secundario font-mono" onClick={onRestaurar}>
          {t('form.restaurar')}
        </button>
      </div>
      <p className="nota">{t('form.nota')}</p>

      {CONTINUAS.map((f) => (
        <Controle key={f} feature={f} faixa={faixas[f]} valor={valores[f]} onChange={onChange} />
      ))}

      <Controle
        feature="HRs" faixa={faixas.HRs} valor={valores.HRs} onChange={onChange}
        desabilitado={hrsSemLeitura} textoValor={hrsSemLeitura ? t('form.semLeitura') : undefined}
      />
      <label className="checagem">
        <input type="checkbox" checked={hrsSemLeitura} onChange={(e) => onHrsSemLeitura(e.target.checked)} />
        {t('form.hrsCheck')}
      </label>

      <div className="linha-selects">
        <label className="select">
          <span>{t('form.posicao')}</span>
          <select
            className="font-mono" value={valores['Posição da Gaiola na Estufa']}
            onChange={(e) => onChange('Posição da Gaiola na Estufa', parseInt(e.target.value, 10))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((p) => (
              <option key={p} value={p}>{t('form.posicaoN', { n: p })}</option>
            ))}
          </select>
        </label>
        <label className="select">
          <span>{t('form.turno')}</span>
          <select
            className="font-mono" value={valores.Turno_num}
            onChange={(e) => onChange('Turno_num', parseInt(e.target.value, 10))}
          >
            {[1, 2, 3].map((v) => <option key={v} value={v}>{t('form.turnoN', { n: v })}</option>)}
          </select>
        </label>
      </div>
    </form>
  )
}
