# Simulador RSC (EBTT)

> **Ferramenta NÃO OFICIAL.** Estima a pontuação do Reconhecimento de Saberes e Competências (RSC I, II e III) de docentes da carreira EBTT. **Não substitui** a análise da CPPD nem a normativa vigente da sua instituição. O resultado é apenas uma simulação.

**Acesse online:** `https://felipedantas-pi.github.io/simulador-rsc-ebtt/`

## Para que serve

Você informa as quantidades de cada atividade (cursos, projetos, orientações, produções etc.) e o simulador calcula, automaticamente:

- a pontuação de cada item, de cada grupo e de cada nível (RSC I, II e III);
- o total geral;
- se a pontuação atinge o mínimo exigido para o RSC que você pretende pleitear.

Os itens, fatores de pontuação, unidades máximas e tetos seguem a planilha institucional de apuração do IFPI.

## Como usar (no site)

1. Abra o endereço acima, no computador ou no celular.
2. (Opcional) Preencha seus dados no topo. Eles servem só para impressão.
3. Marque o **RSC que pretende pleitear** (I, II ou III).
4. Escolha a **regra de aprovação**:
   - **Manual IFPI (SUAP):** mínimo de 25 pontos no RSC pretendido e 50 pontos no total (padrão);
   - **Resolução CPRSC nº 03/2021:** mínimo de 36 pontos no RSC pretendido e 60 pontos no total.
5. Navegue pelas abas **RSC I**, **RSC II** e **RSC III**, abra cada grupo e digite as quantidades. O limite de unidades de cada item é aplicado automaticamente.
6. Na aba **Resumo**, veja a pontuação por grupo e nível, e o banner de situação (suficiente ou insuficiente, com quantos pontos faltam).
7. Use **Imprimir / PDF** para guardar o resultado e **Limpar quantidades** para recomeçar.

Seus dados ficam salvos **apenas no seu navegador** (`localStorage`). Nada é enviado a servidor. Limpar os dados do navegador apaga o que foi digitado.

## Como funciona o cálculo

- Pontos do item = `fator × quantidade` (limitada ao máximo de unidades do item).
- Subtotal do grupo = soma dos itens do grupo.
- Pontos obtidos = `peso do grupo × subtotal`.
- Pontos válidos = `MIN(obtidos, teto do grupo)`.
- Pontuação do nível = soma dos pontos válidos dos grupos (máximo de 100 por nível).
- Total geral = soma dos três níveis.
- Situação = pontuação do nível pretendido ≥ mínimo do nível **e** total geral ≥ mínimo do total. O excedente do nível pretendido conta no total.

Os cálculos foram conferidos contra os totais da planilha original.

## Usar localmente (sem internet)

Não precisa instalar nada, só de um navegador.

**Opção A: baixar o ZIP (mais simples)**

1. Na página do repositório no GitHub, clique em **Code** e depois em **Download ZIP**.
2. Extraia o arquivo em uma pasta.
3. Dê duplo clique em `index.html`. O simulador abre no navegador.

**Opção B: clonar com Git**

```bash
git clone https://github.com/SEU_USUARIO/simulador-rsc-ebtt.git
```
```bash
cd simulador-rsc-ebtt
```

Depois, abra o `index.html` no navegador.

**Servidor local (opcional)**

Se preferir abrir por endereço local, com Python instalado:
```bash
python -m http.server 8000
```
Acesse `http://localhost:8000`.

## Estrutura

```
index.html    página
styles.css    visual (responsivo e impressão)
data.js       itens, fatores, unidades máximas e tetos (extraídos da planilha)
app.js        motor de cálculo, interface e persistência local
```

## Atualizar regras ou itens

- **Itens, fatores e tetos:** edite `data.js`.
- **Mínimos de aprovação:** edite o objeto `REGRAS` no início do `app.js`.

## Aviso importante

- A pontuação final é definida pela **CPPD** e pela normativa vigente da instituição.
- O IF ainda pode utilizar a regra 25/50 ou migrar para 36/60 (Res. CPRSC nº 03/2021, art. 9º). Confirme com sua CPPD qual se aplica.
- A Res. CPRSC nº 03/2021 (art. 7º) limita as atividades a, no máximo, 5 anos antes do ingresso na carreira EBTT. O simulador **não valida datas**.
- A calculadora não avalia documentos comprobatórios. Eles precisam atender às exigências do processo no SUAP.

## Fontes

- Planilha institucional de apuração da pontuação do RSC (IFPI).
- Resolução CPRSC nº 3/2021 e Resolução CPRSC nº 8/2022.
- Manual de Solicitação do RSC do IFPI (SUAP).

## Licença

Defina uma licença (por exemplo, MIT) antes de publicar, se quiser permitir reuso.
