export default function Limitacoes({ meta, mae, pesoTipico }) {
  const resolucao = (100 / pesoTipico).toFixed(2)
  return (
    <section id="limitacoes" className="secao">
      <h2 className="font-display">Como ler estes resultados</h2>
      <ul className="lista">
        <li>
          <strong>O peso de entrada domina por um motivo em grande parte aritmético.</strong> Cada gaiola
          perde quase sempre a mesma massa ({meta.perda_kg_media} ± {meta.perda_kg_dp} kg). Então, quanto
          mais pesada a gaiola, menor a quebra em %. Não é necessariamente um efeito do processo.
        </li>
        <li>
          <strong>A resolução da balança limita o modelo.</strong> Os pesos são registrados em kg inteiros,
          e 1 kg ≈ {resolucao} p.p. de quebra numa gaiola de {Math.round(pesoTipico)} kg. Isso já é mais que o erro típico do
          modelo (± {mae.toFixed(2)} p.p.).
        </li>
        <li>
          <strong>Os parâmetros da estufa quase não explicam a quebra nestes dados.</strong> TRs, HRs, TNs,
          setpoint e duração são médias por ciclo. Curvas completas ao longo do ciclo podem conter o sinal
          que as médias perdem.
        </li>
        <li>
          <strong>Eventos NOK são raríssimos.</strong> Há {meta.nok_reais} caso real entre {meta.medicoes} medições
          (15,7% de quebra), e ele não é previsível com estas variáveis. O status OK/NOK aqui vem da quebra
          prevista, não de um classificador.
        </li>
        <li>
          <strong>A umidade (HRs) não foi registrada em ≈75% dos ciclos</strong> (o sensor gravava 0).
          O modelo trata esses casos como ausentes. Marque “sem leitura” para simular essa situação.
        </li>
      </ul>
    </section>
  )
}
