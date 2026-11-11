import { useIdioma } from '../i18n/idioma.jsx'
import { Dispersao } from './Graficos.jsx'

export default function Desempenho({ modelo }) {
  const { t, n } = useIdioma()
  const meta = modelo.metadados
  const mae = modelo.mae_validacao
  const linhas = Object.entries(meta.desempenho).sort((a, b) => a[1].MAE_media - b[1].MAE_media)
  const teste = meta.teste_vs_baseline
  const baseline = meta.desempenho['Baseline (mediana)']
  const { real, previsto } = modelo.graficos.previsto_vs_real
  const nomeModelo = (nome) => (nome.startsWith('Baseline') ? t(`modelo.${nome}`) : nome)

  return (
    <section id="desempenho" className="secao">
      <h2 className="font-display">{t('des.titulo')}</h2>
      <p>
        {t('des.intro1')}<strong>{t('des.introForte')}</strong>{t('des.intro2')}
      </p>
      <div className="tabela-rolagem">
        <table>
          <thead>
            <tr><th>{t('des.modelo')}</th><th>MAE (p.p.)</th><th>RMSE (p.p.)</th><th>R²</th></tr>
          </thead>
          <tbody>
            {linhas.map(([nome, d]) => (
              <tr key={nome} className={nome === meta.modelo ? 'linha-destaque' : ''}>
                <td>
                  {nomeModelo(nome)}
                  {nome === meta.modelo ? <span className="etiqueta">{t('des.usadoNoSite')}</span> : null}
                </td>
                <td className="font-mono">{n(d.MAE_media, 3)} ± {n(d.MAE_dp, 3)}</td>
                <td className="font-mono">{n(d.RMSE_media, 3)} ± {n(d.RMSE_dp, 3)}</td>
                <td className="font-mono">{n(d.R2_media)} ± {n(d.R2_dp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="indicadores">
        <div><span className="font-mono">{n(mae, 3)}</span>{t('des.maeRf')}</div>
        <div>
          <span className="font-mono">{n(100 * (1 - mae / baseline.MAE_media), 0)}%</span>
          {t('des.menosErro')}
        </div>
        <div><span className="font-mono">p = {n(teste.p_valor, 3)}</span>{t('des.ttest')}</div>
      </div>
      <p className="nota">{t('des.notaRmse')}</p>
      <figure className="figura-grafico">
        <h3 className="titulo-grafico">{t('des.grafTitulo')}</h3>
        <Dispersao
          real={real} previsto={previsto} limite={modelo.limites_ok[1]}
          rotX={t('des.eixoReal')} rotY={t('des.eixoPrevisto')} rotIdeal={t('des.ideal')}
        />
        <figcaption>{t('des.grafLegenda')}</figcaption>
      </figure>
    </section>
  )
}
