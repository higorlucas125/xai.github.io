/** Nomes amigáveis e unidades das variáveis do modelo. */
export const ROTULOS = {
  'TRs': { nome: 'Temperatura real da estufa (TRs)', curto: 'Temp. real (TRs)', unidade: '°C', passo: 0.1 },
  'HRs': { nome: 'Umidade real da estufa (HRs)', curto: 'Umidade (HRs)', unidade: '%', passo: 0.5 },
  'TNs': { nome: 'Temperatura do bulbo (TNs)', curto: 'Temp. bulbo (TNs)', unidade: '°C', passo: 0.1 },
  'shpTRs': { nome: 'Setpoint de temperatura (shpTRs)', curto: 'Setpoint (shpTRs)', unidade: '°C', passo: 0.1 },
  'Peso de Entrada da Gaiola (kg)': { nome: 'Peso de entrada da gaiola', curto: 'Peso de entrada', unidade: 'kg', passo: 1 },
  'Posição da Gaiola na Estufa': { nome: 'Posição da gaiola na estufa', curto: 'Posição da gaiola', unidade: '', passo: 1 },
  'Turno_num': { nome: 'Turno de produção', curto: 'Turno', unidade: '', passo: 1 },
  'Tempo_h': { nome: 'Duração do ciclo', curto: 'Duração do ciclo', unidade: 'h', passo: 0.1 },
}

export const curto = (f) => ROTULOS[f]?.curto ?? f
