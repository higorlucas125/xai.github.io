/**
 * i18n/idioma.jsx — Contexto de idioma (PT/EN).
 *
 * Ordem de escolha do idioma inicial:
 *   1. parâmetro ?lang=pt|en na URL (permite compartilhar o link já no idioma certo)
 *   2. escolha anterior salva no navegador
 *   3. idioma do navegador (pt* → português; qualquer outro → inglês)
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { IDIOMAS, TEXTOS } from './textos.js'

const CHAVE = 'xai-mortadela-idioma'
const Ctx = createContext(null)

function lerSalvo() {
  try { return localStorage.getItem(CHAVE) } catch { return null }
}

function salvar(idioma) {
  try { localStorage.setItem(CHAVE, idioma) } catch { /* armazenamento indisponível */ }
}

export function idiomaInicial() {
  const daUrl = new URLSearchParams(location.search).get('lang')
  if (daUrl && IDIOMAS[daUrl]) return daUrl
  const salvo = lerSalvo()
  if (salvo && IDIOMAS[salvo]) return salvo
  return (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

/** Traduz uma chave; substitui {variaveis}. Chaves ausentes caem no português. */
export function traduzir(idioma, chave, vars = {}) {
  const valor = TEXTOS[idioma]?.[chave] ?? TEXTOS.pt[chave] ?? chave
  if (typeof valor === 'function') return valor(vars)
  return valor.replace(/\{(\w+)\}/g, (_, k) => (vars[k] ?? `{${k}}`))
}

export function ProvedorIdioma({ children }) {
  const [idioma, setIdiomaEstado] = useState(idiomaInicial)

  const setIdioma = useCallback((novo) => {
    setIdiomaEstado(novo)
    salvar(novo)
    const url = new URL(location.href)
    url.searchParams.set('lang', novo)
    history.replaceState(null, '', url)
  }, [])

  useEffect(() => {
    document.documentElement.lang = IDIOMAS[idioma].locale
    document.title = traduzir(idioma, 'meta.titulo')
    document.querySelector('meta[name="description"]')?.setAttribute('content', traduzir(idioma, 'meta.descricao'))
  }, [idioma])

  const valor = useMemo(() => {
    const locale = IDIOMAS[idioma].locale
    return {
      idioma,
      setIdioma,
      t: (chave, vars) => traduzir(idioma, chave, vars),
      /** Número com separador decimal do idioma (5,56 em PT; 5.56 em EN). */
      n: (v, casas = 2) => Number(v).toLocaleString(locale, { minimumFractionDigits: casas, maximumFractionDigits: casas }),
      /** Nome completo e curto de uma variável do modelo. */
      nome: (f) => traduzir(idioma, `f.${f}`),
      curto: (f) => traduzir(idioma, `fc.${f}`),
      data: (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString(locale),
    }
  }, [idioma, setIdioma])

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>
}

export function useIdioma() {
  return useContext(Ctx)
}

export function SeletorIdioma() {
  const { idioma, setIdioma, t } = useIdioma()
  return (
    <div className="seletor-idioma" role="group" aria-label={t('idioma.rotulo')}>
      {Object.entries(IDIOMAS).map(([codigo, { nome, curto }]) => (
        <button
          key={codigo} type="button" lang={codigo}
          className={codigo === idioma ? 'ativo' : ''}
          aria-pressed={codigo === idioma}
          title={nome}
          onClick={() => setIdioma(codigo)}
        >
          {curto}
        </button>
      ))}
    </div>
  )
}
