import { curto } from '../rotulos.js'

export default function Resultado({ modelo, resultado, simulacao, posicaoAtual, onEscolherPosicao }) {
  const { quebra, status, contribuicoes, recomendacao } = resultado
  const [li, ls] = modelo.limites_ok
  const mae = modelo.mae_validacao
  const maxAbs = Math.max(...contribuicoes.map(([, v]) => Math.abs(v)), 1e-6)
  const { sims, melhor } = simulacao
  const ganho = sims[posicaoAtual - 1].quebra - melhor.quebra

  return (
    <div className="cartao resultado" aria-live="polite">
      <div className="resultado-topo">
        <div>
          <span className="rotulo">Quebra prevista</span>
          <div className="numero-grande font-mono">
            {quebra.toFixed(2)}<span>%</span>
          </div>
          <span className="nota font-mono">
            erro típico ± {mae.toFixed(2)} p.p. · faixa OK ({li.toFixed(1)}; {ls.toFixed(1)}]
          </span>
        </div>
        <span className={`selo-status ${status === 'OK' ? 'ok' : 'nok'}`}>
          <span className="ponto" />{status}
        </span>
      </div>

      <p className="recomendacao">{recomendacao}</p>

      <h3>Por que essa previsão? <span className="sufixo">XAI local</span></h3>
      <p className="legenda">
        <span className="leg-pos">aumenta a quebra</span>
        <span className="leg-neg">reduz a quebra</span>
        <span>em p.p., comparado a um ciclo típico</span>
      </p>
      {maxAbs < 0.005 ? (
        <p className="dica">
          Todos os parâmetros estão no valor típico (mediana histórica), então nenhuma variável desloca a
          previsão. Mova um controle para ver o efeito de cada variável.
        </p>
      ) : null}
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
            <span className="contrib-valor font-mono">{v >= 0 ? '+' : ''}{v.toFixed(3)}</span>
          </li>
        ))}
      </ul>

      <h3>Simulação por posição da gaiola</h3>
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
            title={`Usar a posição ${s.posicao}`}
          >
            <span className="font-mono">P{s.posicao}</span>
            <span className="font-mono">{s.quebra.toFixed(2)}%</span>
          </button>
        ))}
      </div>
      <p className="nota">
        Menor quebra prevista: <strong>posição {melhor.posicao}</strong>
        {melhor.posicao === posicaoAtual
          ? ' (já é a posição atual). '
          : ganho < 0.005
            ? ' (praticamente igual à atual). '
            : ` (−${ganho.toFixed(2)} p.p. em relação à atual). `}
        {ganho < mae
          ? `A diferença é menor que o erro típico do modelo (± ${mae.toFixed(2)} p.p.), então não é significativa.`
          : 'A diferença supera o erro típico do modelo.'}
      </p>
    </div>
  )
}
