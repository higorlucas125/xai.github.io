import { useMemo, useState } from 'react'

import Formulario from './componentes/Formulario.jsx'
import Resultado from './componentes/Resultado.jsx'
import Desempenho from './componentes/Desempenho.jsx'
import XaiGlobal from './componentes/XaiGlobal.jsx'
import Limitacoes from './componentes/Limitacoes.jsx'
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
          <span className="selo font-mono">XAI · Random Forest · validação por ciclo</span>
          <h1 className="font-display">
            Previsão de quebra na <span className="destaque">defumação de mortadela</span>
          </h1>
          <p className="subtitulo">
            Ajuste os parâmetros de um ciclo da estufa e veja a quebra prevista, o status
            OK/NOK e quais variáveis mais pesaram na previsão. O modelo roda inteiro no seu navegador.
          </p>
          <nav className="menu font-mono" aria-label="Seções">
            <a href="#simulador">Simulador</a>
            <a href="#desempenho">Desempenho</a>
            <a href="#xai">XAI global</a>
            <a href="#limitacoes">Limitações</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="simulador" className="grade-simulador" aria-label="Simulador">
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

        <Desempenho meta={meta} mae={modelo.mae_validacao} />
        <XaiGlobal meta={meta} />
        <Limitacoes meta={meta} mae={modelo.mae_validacao} pesoTipico={modelo.medianas_referencia['Peso de Entrada da Gaiola (kg)']} />
      </main>

      <footer className="rodape font-mono">
        <span>
          Modelo gerado em {meta.gerado_em} · {meta.medicoes} medições · {meta.ciclos} ciclos de estufa
        </span>
        <span className={paridade.iguais === paridade.total ? 'ok' : 'nok'}>
          Inferência verificada: {paridade.iguais}/{paridade.total} previsões idênticas às do scikit-learn
        </span>
        <span>Dissertação de mestrado — Higor Lucas</span>
      </footer>
    </>
  )
}
