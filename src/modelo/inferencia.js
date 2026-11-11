/**
 * modelo/inferencia.js — Executa no navegador o modelo exportado do Mestrado_final.
 *
 * Reproduz exatamente o pipeline do scikit-learn:
 *   imputação pela mediana (+ indicador de HRs ausente) → StandardScaler → Random Forest.
 * Referência em Python: utils/atividade5_utils.py::prever_de_json (repositório Mestrado_final).
 */

/** Transforma um dicionário {feature: valor|null} no vetor que entra nas árvores. */
function transformar(m, amostra) {
  const brutos = m.features.map((f) => amostra[f])
  const ausente = brutos.map((v) => v === null || v === undefined || Number.isNaN(v))
  const imputados = brutos.map((v, i) => (ausente[i] ? m.imputacao_medianas[i] : Number(v)))
  const indicadores = m.indicadores_ausencia.map((i) => (ausente[i] ? 1 : 0))
  // Math.fround: o scikit-learn compara os nós das árvores em float32
  return [...imputados, ...indicadores].map((v, j) =>
    Math.fround((v - m.scaler_media[j]) / m.scaler_escala[j]))
}

/** Quebra prevista (%) para uma amostra. */
export function prever(m, amostra) {
  const z = transformar(m, amostra)
  let soma = 0
  for (const { f, t, l, r, v } of m.arvores) {
    let n = 0
    while (l[n] !== -1) n = z[f[n]] <= t[n] ? l[n] : r[n]
    soma += v[n]
  }
  return soma / m.arvores.length
}

/** OK se limite_inferior < quebra <= limite_superior (mesmo critério do processo). */
export function classificar(m, quebra) {
  const [li, ls] = m.limites_ok
  return quebra > li && quebra <= ls ? 'OK' : 'NOK'
}

/**
 * Explicação local: troca cada variável pela mediana histórica e mede quanto a
 * previsão muda. Positivo = a variável, no valor informado, AUMENTA a quebra.
 */
export function contribuicoes(m, amostra) {
  const base = prever(m, amostra)
  return m.features
    .map((f) => [f, base - prever(m, { ...amostra, [f]: m.medianas_referencia[f] })])
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
}

/** Previsão completa com status, explicação e recomendação (espelha prever_com_explicacao). */
export function preverComExplicacao(m, amostra) {
  const quebra = prever(m, amostra)
  const status = classificar(m, quebra)
  const contrib = contribuicoes(m, amostra)
  const [principal, efeito] = contrib[0]
  const [li, ls] = m.limites_ok
  const fmt = (v) => `${v >= 0 ? '+' : ''}${v.toFixed(3)} p.p.`

  // Efeitos abaixo de 0,005 p.p. são ruído numérico: não vale apontar "maior influência"
  const influencia = Math.abs(efeito) >= 0.005 ? ` Maior influência: ${principal} (${fmt(efeito)}).` : ''
  let recomendacao
  if (status === 'NOK') {
    recomendacao = `Alerta: quebra prevista fora da faixa (${li}; ${ls}].${influencia}`
  } else if (quebra - m.mediana_previsoes > 0.02) {
    recomendacao = `Dentro da faixa, mas acima da mediana histórica (${m.mediana_previsoes.toFixed(2)}%).${influencia}`
  } else if (quebra - m.mediana_previsoes >= -0.02) {
    recomendacao = `Dentro da faixa, próxima da mediana histórica (${m.mediana_previsoes.toFixed(2)}%). Nenhuma ação necessária.`
  } else {
    recomendacao = `Dentro da faixa e abaixo da mediana histórica (${m.mediana_previsoes.toFixed(2)}%). Nenhuma ação necessária.`
  }
  return { quebra, status, contribuicoes: contrib, recomendacao }
}

/** Quebra prevista para cada posição da gaiola (1–12), mantendo o resto igual. */
export function simularPosicoes(m, amostra, posicoes = 12) {
  const sims = Array.from({ length: posicoes }, (_, i) => {
    const posicao = i + 1
    const quebra = prever(m, { ...amostra, 'Posição da Gaiola na Estufa': posicao })
    return { posicao, quebra, status: classificar(m, quebra) }
  })
  const melhor = sims.reduce((a, b) => (b.quebra < a.quebra ? b : a))
  return { sims, melhor }
}

/** Confere a inferência com os vetores de teste gerados pelo scikit-learn. */
export function verificarParidade(m) {
  const { X, y_sklearn: y } = m.vetores_teste
  let iguais = 0
  let maiorDiferenca = 0
  X.forEach((linha, i) => {
    const amostra = Object.fromEntries(m.features.map((f, j) => [f, linha[j]]))
    const d = Math.abs(prever(m, amostra) - y[i])
    maiorDiferenca = Math.max(maiorDiferenca, d)
    if (d < 1e-9) iguais += 1
  })
  return { iguais, total: X.length, maiorDiferenca }
}
