import { useIdioma } from '../i18n/idioma.jsx'

export default function Limitacoes({ modelo }) {
  const { t, n } = useIdioma()
  const meta = modelo.metadados
  const peso = modelo.medianas_referencia['Peso de Entrada da Gaiola (kg)']
  const itens = [
    t('lim.peso', { media: n(meta.perda_kg_media, 1), dp: n(meta.perda_kg_dp, 1) }),
    t('lim.balanca', { res: n(100 / peso), peso: Math.round(peso), mae: n(modelo.mae_validacao) }),
    t('lim.estufa'),
    t('lim.nok', { nok: meta.nok_reais, n: meta.medicoes }),
    t('lim.hrs'),
  ]
  return (
    <section id="limitacoes" className="secao">
      <h2 className="font-display">{t('lim.titulo')}</h2>
      <ul className="lista">
        {itens.map(([forte, resto]) => (
          <li key={forte}><strong>{forte}</strong>{resto}</li>
        ))}
      </ul>
    </section>
  )
}
