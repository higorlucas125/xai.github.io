/**
 * Graficos.jsx — Gráficos em SVG (sem bibliotecas), com textos traduzíveis.
 */

import { useIdioma } from '../i18n/idioma.jsx'

/** Escala linear e marcas "redondas" para um eixo. */
function escala([d0, d1], [r0, r1]) {
  const f = (v) => r0 + ((v - d0) / (d1 - d0 || 1)) * (r1 - r0)
  return f
}

function marcas([a, b], alvo = 5) {
  const passoBruto = (b - a) / alvo
  const pot = 10 ** Math.floor(Math.log10(passoBruto))
  const passo = [1, 2, 2.5, 5, 10].map((m) => m * pot).find((p) => p >= passoBruto) ?? passoBruto
  const lista = []
  for (let v = Math.ceil(a / passo) * passo; v <= b + 1e-9; v += passo) lista.push(+v.toFixed(10))
  return lista
}

function Eixos({ x, y, xMarcas, yMarcas, casasX, casasY, rotX, rotY, larg, alt, m }) {
  const { n } = useIdioma()
  return (
    <g className="eixos">
      {yMarcas.map((v) => (
        <g key={`y${v}`}>
          <line x1={m.e} x2={larg - m.d} y1={y(v)} y2={y(v)} className="grade" />
          <text x={m.e - 6} y={y(v)} dy="0.32em" textAnchor="end">{n(v, casasY)}</text>
        </g>
      ))}
      {xMarcas.map((v) => (
        <text key={`x${v}`} x={x(v)} y={alt - m.b + 16} textAnchor="middle">{n(v, casasX)}</text>
      ))}
      <line x1={m.e} x2={larg - m.d} y1={alt - m.b} y2={alt - m.b} className="eixo" />
      <text x={(m.e + larg - m.d) / 2} y={alt - 4} textAnchor="middle" className="rotulo-eixo">{rotX}</text>
      <text transform={`translate(12 ${(m.t + alt - m.b) / 2}) rotate(-90)`} textAnchor="middle" className="rotulo-eixo">{rotY}</text>
    </g>
  )
}

export function Dispersao({ real, previsto, limite, rotX, rotY, rotIdeal }) {
  const larg = 560
  const alt = 420
  const m = { t: 14, d: 14, b: 44, e: 52 }
  const todos = [...real, ...previsto]
  const dom = [Math.floor(Math.min(...todos)), Math.ceil(Math.max(...todos))]
  const x = escala(dom, [m.e, larg - m.d])
  const y = escala(dom, [alt - m.b, m.t])
  const tk = marcas(dom, 6)
  return (
    <svg viewBox={`0 0 ${larg} ${alt}`} className="grafico" role="img" aria-label={`${rotY} × ${rotX}`}>
      <Eixos x={x} y={y} xMarcas={tk} yMarcas={tk} casasX={0} casasY={0} rotX={rotX} rotY={rotY} larg={larg} alt={alt} m={m} />
      <line x1={x(limite)} x2={x(limite)} y1={m.t} y2={alt - m.b} className="limite" />
      <line x1={m.e} x2={larg - m.d} y1={y(limite)} y2={y(limite)} className="limite" />
      <line x1={x(dom[0])} y1={y(dom[0])} x2={x(dom[1])} y2={y(dom[1])} className="ideal" />
      {/* rótulo abaixo da diagonal, a 85% do caminho, para não cobrir a linha */}
      <text
        x={x(dom[0] + 0.85 * (dom[1] - dom[0])) + 6} y={y(dom[0] + 0.85 * (dom[1] - dom[0])) + 4}
        textAnchor="start" className="rotulo-ideal"
      >{rotIdeal}</text>
      {real.map((r, i) => (
        <circle key={i} cx={x(r)} cy={y(previsto[i])} r="3" className={r > limite ? 'ponto-nok' : 'ponto'} />
      ))}
    </svg>
  )
}

export function Linha({ grade, valores, rotX, rotY, inteiro = false }) {
  const larg = 300
  const alt = 210
  const m = { t: 10, d: 10, b: 42, e: 46 }
  const x = escala([grade[0], grade[grade.length - 1]], [m.e, larg - m.d])
  const yMin = Math.min(...valores)
  const yMax = Math.max(...valores)
  const folga = Math.max((yMax - yMin) * 0.15, 0.02)
  const domY = [yMin - folga, yMax + folga]
  const y = escala(domY, [alt - m.b, m.t])
  const caminho = grade.map((g, i) => `${i ? 'L' : 'M'}${x(g).toFixed(1)},${y(valores[i]).toFixed(1)}`).join('')
  const xTk = marcas([grade[0], grade[grade.length - 1]], 4).filter((v) => !inteiro || Number.isInteger(v))
  return (
    <svg viewBox={`0 0 ${larg} ${alt}`} className="grafico" role="img" aria-label={`${rotY} × ${rotX}`}>
      <Eixos
        x={x} y={y} xMarcas={xTk} yMarcas={marcas(domY, 4)} casasX={0} casasY={2}
        rotX={rotX} rotY={rotY} larg={larg} alt={alt} m={m}
      />
      <path d={caminho} className="curva" />
    </svg>
  )
}
