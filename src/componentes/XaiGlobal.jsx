import { curto } from '../rotulos.js'

export default function XaiGlobal({ meta }) {
  const itens = Object.entries(meta.importancia_permutacao).sort((a, b) => b[1] - a[1])
  const max = Math.max(...itens.map(([, v]) => v), 1e-6)
  return (
    <section id="xai" className="secao">
      <h2 className="font-display">O que o modelo aprendeu — XAI global</h2>
      <p>
        <strong>Importância por permutação</strong>: quanto o erro (MAE) piora quando os valores de uma
        variável são embaralhados. Ela é medida nos ciclos de <em>teste</em>, então mostra do que o modelo
        depende para generalizar, e não só para decorar o treino.
      </p>
      <ul className="importancias">
        {itens.map(([f, v]) => (
          <li key={f}>
            <span>{curto(f)}</span>
            <span className="contrib-barra">
              <span className="contrib-preench azul" style={{ width: `${Math.max(0, v / max) * 100}%` }} />
            </span>
            <span className="font-mono">{v >= 0 ? '+' : ''}{v.toFixed(4)}</span>
          </li>
        ))}
      </ul>
      <figure>
        <img src="./dependencia_parcial.png" alt="Gráficos de dependência parcial das três variáveis mais importantes" loading="lazy" />
        <figcaption>
          Dependência parcial: efeito médio de cada variável na quebra prevista, mantendo as demais fixas.
        </figcaption>
      </figure>
    </section>
  )
}
