import { useMemo, useState } from 'react'

import Formulario from './componentes/Formulario.jsx'
import Resultado from './componentes/Resultado.jsx'
import Desempenho from './componentes/Desempenho.jsx'
import XaiGlobal from './componentes/XaiGlobal.jsx'
import Limitacoes from './componentes/Limitacoes.jsx'
import { SeletorIdioma, useIdioma } from './i18n/idioma.jsx'
import { preverComExplicacao, simularPosicoes, verificarParidade } from './modelo/inferencia.js'

function valoresIniciais(m) {
  const med = m.medianas_referencia
  return {
    ...Object.fromEntries(m.features.map((f) => [f, med[f]])),
    'Posição da Gaiola na Estufa': Math.round(med['Posição da Gaiola na Estufa']),
    'Turno_num': Math.round(med['Turno_num']),
    'Peso de Entrada da Gaiola (kg)': Math.round(med['Peso de Entrada da Gaiola (kg)']),
  }
}

export default function App({ modelo }) {
  const { t, data } = useIdioma()
  const [valores, setValores] = useState(() => valoresIniciais(modelo))
  const [hrsSemLeitura, setHrsSemLeitura] = useState(false)

  const amostra = useMemo(
    () => ({ ...valores, HRs: hrsSemLeitura ? null : valores.HRs }),
    [valores, hrsSemLeitura],
  )
  const resultado = useMemo(() => preverComExplicacao(modelo, amostra), [modelo, amostra])
  const simulacao = useMemo(() => simularPosicoes(modelo, amostra), [modelo, amostra])
  const paridade = useMemo(() => verificarParidade(modelo), [modelo])
  const meta = modelo.metadados

  return (
    <>
      <header className="topo">
        <div className="topo-interno">
          <div className="topo-linha">
            <span className="selo font-mono">{t('topo.selo')}</span>
            <SeletorIdioma />
          </div>
          <h1 className="font-display">
            {t('topo.titulo1')}<span className="destaque">{t('topo.titulo2')}</span>
          </h1>
          <p className="subtitulo">{t('topo.subtitulo')}</p>
          <nav className="menu font-mono" aria-label="Menu">
            <a href="#simulador">{t('menu.simulador')}</a>
            <a href="#desempenho">{t('menu.desempenho')}</a>
            <a href="#xai">{t('menu.xai')}</a>
            <a href="#limitacoes">{t('menu.limitacoes')}</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="simulador" className="grade-simulador" aria-label={t('menu.simulador')}>
          <Formulario
            modelo={modelo}
            valores={valores}
            onChange={(f, v) => setValores((atual) => ({ ...atual, [f]: v }))}
            hrsSemLeitura={hrsSemLeitura}
            onHrsSemLeitura={setHrsSemLeitura}
            onRestaurar={() => { setValores(valoresIniciais(modelo)); setHrsSemLeitura(false) }}
          />
          <Resultado
            modelo={modelo}
            resultado={resultado}
            simulacao={simulacao}
            posicaoAtual={valores['Posição da Gaiola na Estufa']}
            onEscolherPosicao={(p) => setValores((a) => ({ ...a, 'Posição da Gaiola na Estufa': p }))}
          />
        </section>

        <Desempenho modelo={modelo} />
        <XaiGlobal modelo={modelo} />
        <Limitacoes modelo={modelo} />
      </main>

      <footer className="rodape font-mono">
        <span>{t('rodape.gerado', { data: data(meta.gerado_em), n: meta.medicoes, c: meta.ciclos })}</span>
        <span className={paridade.iguais === paridade.total ? 'ok' : 'nok'}>
          {t('rodape.paridade', { i: paridade.iguais, t: paridade.total })}
        </span>
        <span>{t('rodape.autor')}</span>
      </footer>
    </>
  )
}
