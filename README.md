# Calculadora RSC

Página estática (HTML/CSS/JS puro, sem backend) que replica os cálculos da `Planilha_RSC.xlsx` para apuração de pontuação do Reconhecimento de Saberes e Competências (RSC I, II e III).

## Arquivos

- `index.html` — estrutura da página
- `styles.css` — visual responsivo
- `data.js` — todas as diretrizes, itens, fatores de pontuação, unidades e tetos, extraídos das abas `RSC_I`, `RSC_II`, `RSC_III` e `Anexo_III` da planilha
- `app.js` — motor de cálculo (fórmulas replicadas) + renderização + persistência local

## Fórmulas replicadas

- Pontuação do item = `fator × quantidade informada`
- Subtotal do grupo = soma dos itens do grupo
- Pontuação obtida do grupo = `peso × subtotal` (peso e teto vêm do `Anexo_III`)
- Pontuação válida do grupo = `MIN(obtida, teto)`
- Subtotal do nível (RSC I/II/III) = soma das pontuações válidas dos grupos (máx. 100)
- Total geral = soma dos 3 níveis (máx. 300)

Motor validado numericamente contra os totais já preenchidos na planilha original (RSC I = 39,6 · RSC II = 28 · RSC III = 0 · Total = 67,6) — bateram exatos.

## Observação importante

Na planilha original, a grade de status "OK / NÃO_OK" (aba `Apuração da Pontuação`, células O15:Q17) **não é calculada por fórmula** — são valores digitados manualmente. O banner de situação desta página oferece duas regras (seletor "Regra de aprovação"), ambas no formato *mínimo no nível pretendido + mínimo no total geral* (o excedente do nível pretendido conta no total):

- **Resolução CPRSC nº 03/2021, art. 9º, parágrafo único** (redação da Res. CPRSC nº 8/2022): 60% da pontuação do nível = **60 pts no total** e 60% desses = **36 pts no nível pretendido**.
- **Manual de Solicitação do RSC do IFPI (SUAP)** (padrão, igual à planilha institucional): **25 pts no RSC pretendido** e **50 pts na pontuação global**.

Os valores estão em `REGRAS` no `app.js`. O manual do IFPI é anterior à Res. 3/2021 e cita a Res. 15/2014-CONSUP/IFPI; confirme com a CPPD qual regulamento institucional está em vigor (Res. 3/2021, art. 17: regulamentos vigentes valem até a homologação do novo).

Também pelo art. 7º da Res. 3/2021, as atividades devem ter sido realizadas em, no máximo, 5 anos antes do ingresso na Carreira EBTT (a calculadora não valida datas).

## Rodar localmente

Abra `index.html` direto no navegador (duplo clique) — não precisa de servidor.

## Publicar no GitHub Pages

```bash
git init
git add index.html styles.css app.js data.js README.md
git commit -m "feat: calculadora RSC"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

Depois, no GitHub: **Settings → Pages → Source: Deploy from a branch → main / (root)**.

A planilha original (`Planilha_RSC.xlsx`) contém dados pessoais preenchidos (nome, SIAPE) — **não a suba para um repositório público**.
