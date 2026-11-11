export default function Desempenho({ meta, mae }) {
  const linhas = Object.entries(meta.desempenho).sort((a, b) => a[1].MAE_media - b[1].MAE_media)
  const t = meta.teste_vs_baseline
  const baseline = meta.desempenho['Baseline (mediana)']
  return (
    <section id="desempenho" className="secao">
      <h2 className="font-display">Desempenho do modelo</h2>
      <p>
        Avaliado com <strong>GroupKFold por ciclo de estufa</strong> (5 folds × 5 repetições):
        nenhuma gaiola do mesmo ciclo aparece ao mesmo tempo no treino e no teste.
        O baseline sempre prevê a mediana histórica; um modelo útil precisa superá-lo.
      </p>
      <div className="tabela-rolagem">
        <table>
          <thead>
            <tr><th>Modelo</th><th>MAE (p.p.)</th><th>RMSE (p.p.)</th><th>R²</th></tr>
          </thead>
          <tbody>
            {linhas.map(([nome, d]) => (
              <tr key={nome} className={nome === meta.modelo ? 'linha-destaque' : ''}>
                <td>{nome}{nome === meta.modelo ? <span className="etiqueta">usado no site</span> : null}</td>
                <td className="font-mono">{d.MAE_media.toFixed(3)} ± {d.MAE_dp.toFixed(3)}</td>
                <td className="font-mono">{d.RMSE_media.toFixed(3)} ± {d.RMSE_dp.toFixed(3)}</td>
                <td className="font-mono">{d.R2_media.toFixed(2)} ± {d.R2_dp.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="indicadores">
        <div><span className="font-mono">{mae.toFixed(3)}</span>MAE do Random Forest (p.p. de quebra)</div>
        <div>
          <span className="font-mono">{(100 * (1 - mae / baseline.MAE_media)).toFixed(0)}%</span>
          menos erro que o baseline
        </div>
        <div><span className="font-mono">p = {t.p_valor.toFixed(3)}</span>t-test corrigido (Nadeau &amp; Bengio)</div>
      </div>
      <p className="nota">
        O RMSE e o R² são dominados por um único ciclo NOK de 15,7% de quebra, que nenhum modelo prevê.
        Por isso o MAE é a métrica principal.
      </p>
      <figure>
        <img src="./previsto_vs_real.png" alt="Gráfico de dispersão da quebra prevista contra a real, fora da amostra" loading="lazy" />
        <figcaption>Quebra prevista × real (previsões fora da amostra, por ciclo).</figcaption>
      </figure>
    </section>
  )
}
