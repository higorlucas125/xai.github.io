# XAI na defumação de mortadela — previsão de quebra

Site estático da dissertação de mestrado, em **português e inglês**: simula a **quebra (%)** de uma gaiola de mortadela defumada a partir dos parâmetros do ciclo da estufa e **explica** cada previsão (XAI).

🔗 **https://higorlucas125.github.io/xai.github.io/**

O modelo (Random Forest com 300 árvores) **roda inteiro no navegador**, sem backend nem servidor Python. O arquivo `modelo.json` contém só o modelo treinado; os dados brutos da produção não são publicados.

## O que o site mostra

- **Simulador**: quebra prevista, status OK/NOK (faixa (5,0; 8,5]) e margem de erro típica.
- **XAI local**: quanto cada variável, no valor informado, aumenta ou reduz a quebra em relação a um ciclo típico.
- **Simulação por posição**: quebra prevista nas 12 posições da gaiola.
- **Desempenho**: modelos comparados com GroupKFold por ciclo e t-test corrigido de Nadeau & Bengio.
- **XAI global**: importância por permutação (nos ciclos de teste) e dependência parcial.
- **Limitações**: como interpretar os resultados.

O idioma é escolhido pelo botão **PT / EN** no topo. Na primeira visita, o site segue o idioma do navegador, e a escolha fica salva. Para compartilhar já num idioma, use `?lang=pt` ou `?lang=en` no link. Os textos ficam em `src/i18n/textos.js`.

Os gráficos são desenhados em SVG a partir dos dados exportados com o modelo, por isso também são traduzidos.

No rodapé, o site confere a própria inferência com previsões geradas pelo scikit-learn ("25/25 previsões idênticas").

## Estrutura

```
docs/            ← site compilado (publicado pelo GitHub Pages)
src/             ← código-fonte React
  modelo/inferencia.js   ← imputação → scaler → árvores, em JavaScript
  i18n/textos.js         ← textos em português e inglês
public/          ← modelo.json (copiado para docs/ no build)
build.mjs        ← build com esbuild
```

## Publicação (GitHub Pages)

**Settings → Pages → Build and deployment → Source: "Deploy from a branch" → Branch: `main`, pasta `/docs`.**

O site já está compilado em `docs/`, então não é preciso rodar nada para publicar.

## Atualizar o modelo

1. No repositório `Mestrado_final`, rode:
   ```bash
   python experimentos/exportar_modelo_web.py
   ```
2. Copie `resultados/atividade5/modelo_web.json` para `public/modelo.json`.
3. Recompile e faça o commit:
   ```bash
   npm install
   npm run build      # gera docs/
   ```

Para ver localmente: `npm run dev` (compila e serve `docs/` em http://localhost:3000).
