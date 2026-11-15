/**
 * dados/melhorias.js — Números da versão "fim a fim" (notebook ipynb/Dissertacao_fim_a_fim.ipynb
 * do repositório Mestrado_final, executado em 15/11/2026, escopo MSD).
 *
 * Para atualizar: rode o notebook e copie os valores das Partes 6, 6b, 7, 8 e 9.
 */

export const VERSAO_MELHORIAS = '2026-11-15'

/** % de gaiolas com quebra < 5 % por mês (planilha 2021–22, MSD). */
export const QUEBRA_BAIXA_POR_MES = {
  rotulos: ['ago/21', 'set', 'out', 'nov', 'dez', 'jan/22', 'fev', 'mar', 'abr', 'mai'],
  rotulosEn: ['Aug/21', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan/22', 'Feb', 'Mar', 'Apr', 'May'],
  valores: [41.1, 19.0, 22.2, 9.4, 3.4, 0.2, 0.3, 0.3, 0.0, 0.2],
}

/** Desvio da quebra (p.p.) de cada posição em relação à média das 12 gaiolas da estufada. */
export const DESVIO_POR_POSICAO = {
  posicoes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  antes: [0.068, 0.009, -0.060, -0.048, -0.037, 0.007, 0.076, 0.000, -0.016, -0.036, -0.014, 0.052],
  depois: [0.006, -0.005, 0.002, -0.008, 0.007, 0.007, 0.004, -0.003, 0.004, -0.022, -0.005, 0.014],
  pAntes: 9.6e-8,
  pDepois: 0.57,
}

/** % de quebra baixa por turno em cada período. */
export const TURNO_POR_PERIODO = {
  antes: [23.0, 5.8, 6.2],
  depois: [1.1, 0.3, 0.2],
}

export const RESULTADOS = {
  ciclos2023: 2509,
  medicoesLigadas: 620,
  ciclosLigados: 335,
  gaiolas2122: 24804,
  pctBaixa: 7.4,
  modeloA: { nome: 'Random Forest', mae: 0.110, baseline: 0.132, p: 0.004 },
  modeloB: { nome: 'Regressão Logística', nomeEn: 'Logistic Regression', prAuc: 0.163, baseline: 0.074, rocAuc: 0.672, p: 0.003 },
  sintetico: { real: 0.159, sintetico: 0.137 },     // HistGradientBoosting, PR-AUC
}
