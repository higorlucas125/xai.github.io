/**
 * Melhorias.jsx — O que mudou na versão "fim a fim" da análise e o que ela revelou.
 * Dados em src/dados/melhorias.js; textos em src/i18n/textos.js (chaves mel.*).
 */

import { useIdioma } from '../i18n/idioma.jsx'
import { Barras } from './Graficos.jsx'
import {
  DESVIO_POR_POSICAO, QUEBRA_BAIXA_POR_MES, RESULTADOS, TURNO_POR_PERIODO, VERSAO_MELHORIAS,
} from '../dados/melhorias.js'

const CORRECOES = ['umidade', 'juncao', 'posicoes', 'mes', 'sintetico', 'variaveis']

export default function Melhorias() {
  const { t, n, idioma, data } = useIdioma()
  const r = RESULTADOS
  const meses = idioma === 'pt' ? QUEBRA_BAIXA_POR_MES.rotulos : QUEBRA_BAIXA_POR_MES.rotulosEn
  const pos = DESVIO_POR_POSICAO

  return (
    <section id="melhorias" className="secao">
      <h2 className="font-display">
        {t('mel.titulo')} <span className="etiqueta">{t('mel.versao', { data: data(VERSAO_MELHORIAS) })}</span>
      </h2>
      <p>{t('mel.intro')}</p>

      <div className="tabela-rolagem">
        <table className="tabela-melhorias">
          <thead>
            <tr><th>{t('mel.colProblema')}</th><th>{t('mel.colAntes')}</th><th>{t('mel.colDepois')}</th></tr>
          </thead>
          <tbody>
            {CORRECOES.map((c) => (
              <tr key={c}>
                <td><strong>{t(`mel.${c}.titulo`)}</strong></td>
                <td>{t(`mel.${c}.antes`)}</td>
                <td>{t(`mel.${c}.depois`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="indicadores">
        <div>
          <span className="font-mono">{n(r.modeloA.mae, 3)} <small>vs {n(r.modeloA.baseline, 3)}</small></span>
          {t('mel.indA', { p: n(r.modeloA.p, 3) })}
        </div>
        <div>
          <span className="font-mono">{n(r.modeloB.prAuc, 3)} <small>vs {n(r.modeloB.baseline, 3)}</small></span>
          {t('mel.indB', { modelo: idioma === 'pt' ? r.modeloB.nome : r.modeloB.nomeEn, p: n(r.modeloB.p, 3) })}
        </div>
        <div>
          <span className="font-mono">{n(r.sintetico.sintetico, 3)} <small>vs {n(r.sintetico.real, 3)}</small></span>
          {t('mel.indSint')}
        </div>
      </div>

      <h3 className="subtitulo-secao">{t('mel.achadosTitulo')}</h3>
      <div className="grade-melhorias">
        <figure className="figura-grafico">
          <h3 className="titulo-grafico">{t('mel.grafMesTitulo')}</h3>
          <Barras
            rotulos={meses} sufixo="%" casas={0}
            series={[{ nome: '', valores: QUEBRA_BAIXA_POR_MES.valores, classe: 'nok' }]}
            rotY={t('mel.grafMesY')}
          />
          <figcaption>{t('mel.grafMesLegenda')}</figcaption>
        </figure>

        <figure className="figura-grafico">
          <h3 className="titulo-grafico">{t('mel.grafTurnoTitulo')}</h3>
          <Barras
            rotulos={[1, 2, 3].map((v) => t('form.turnoN', { n: v }))} sufixo="%"
            series={[
              { nome: t('mel.antes'), valores: TURNO_POR_PERIODO.antes, classe: 'nok' },
              { nome: t('mel.depois'), valores: TURNO_POR_PERIODO.depois, classe: 'azul' },
            ]}
            rotY={t('mel.grafMesY')}
          />
          <p className="legenda">
            <span className="leg-pos">{t('mel.antes')}</span>
            <span className="leg-azul">{t('mel.depois')}</span>
          </p>
          <figcaption>{t('mel.grafTurnoLegenda')}</figcaption>
        </figure>
      </div>

      <figure className="figura-grafico">
        <h3 className="titulo-grafico">{t('mel.grafPosTitulo')}</h3>
        <Barras
          rotulos={pos.posicoes.map(String)} casas={2} sufixo=" p.p." larg={1100} alt={300}
          series={[
            { nome: t('mel.antes'), valores: pos.antes, classe: 'nok' },
            { nome: t('mel.depois'), valores: pos.depois, classe: 'azul' },
          ]}
          rotY={t('mel.grafPosY')}
        />
        <p className="legenda">
          <span className="leg-pos">{t('mel.antesP', { p: pos.pAntes.toExponential(1) })}</span>
          <span className="leg-azul">{t('mel.depoisP', { p: n(pos.pDepois) })}</span>
        </p>
        <figcaption>{t('mel.grafPosLegenda')}</figcaption>
      </figure>

      <ul className="lista">
        {['leitura1', 'leitura2', 'leitura3'].map((k) => {
          const [forte, resto] = t(`mel.${k}`)
          return <li key={k}><strong>{forte}</strong>{resto}</li>
        })}
      </ul>
      <p className="nota">{t('mel.fonte')}</p>
    </section>
  )
}
