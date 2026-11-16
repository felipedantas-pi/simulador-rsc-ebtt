(function () {
  "use strict";

  const STORAGE_KEY = "rsc_calc_v1";
  const LEVELS = ["I", "II", "III"];
  // Regras de aprovação (mínimo no nível pretendido + mínimo no total geral; o excedente do nível pretendido conta no total):
  // - cprsc: Resolução CPRSC nº 03/2021, art. 9º, parágrafo único (60% da pontuação do nível = 60 pts, e 60% desses = 36 pts no nível pretendido).
  // - ifpi: Manual de Solicitação do RSC do IFPI (SUAP): 25 pts no RSC pretendido e 50 pts na pontuação global.
  const REGRAS = {
    cprsc: { nome: "Resolução CPRSC nº 03/2021", nivel: 36, total: 60 },
    ifpi: { nome: "Manual IFPI (SUAP)", nivel: 25, total: 50 },
  };
  const REGRA_PADRAO = "ifpi";

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { info: {}, qty: {} };
      const parsed = JSON.parse(raw);
      return { info: parsed.info || {}, qty: parsed.qty || {} };
    } catch (e) {
      return { info: {}, qty: {} };
    }
  }

  const state = loadState();

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function qtyKey(level, gi, ii) {
    return `${level}.${gi}.${ii}`;
  }

  function fmt(n) {
    const rounded = Math.round(n * 100) / 100;
    return rounded.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  }

  function itemPoints(item, qty) {
    const q = Number(qty) || 0;
    let pts = item.factor * q;
    if (item.round) pts = Math.round(pts);
    return pts;
  }

  function computeGroup(level, gi, group) {
    let subtotal = 0;
    group.items.forEach((item, ii) => {
      const qty = state.qty[qtyKey(level, gi, ii)] || 0;
      subtotal += itemPoints(item, qty);
    });
    const obtained = group.weight * subtotal;
    const valid = Math.min(obtained, group.cap);
    return { subtotal, obtained, valid };
  }

  function computeLevel(level) {
    const data = RSC_DATA[level];
    let validTotal = 0;
    let obtainedTotal = 0;
    const groups = data.groups.map((group, gi) => {
      const r = computeGroup(level, gi, group);
      validTotal += r.valid;
      obtainedTotal += r.obtained;
      return r;
    });
    return { groups, validTotal, obtainedTotal };
  }

  function computeAll() {
    const result = {};
    let grandTotal = 0;
    LEVELS.forEach((lvl) => {
      const r = computeLevel(lvl);
      result[lvl] = r;
      grandTotal += r.validTotal;
    });
    return { result, grandTotal };
  }

  // ---------- Rendering ----------

  function buildLevelPanel(level) {
    const data = RSC_DATA[level];
    const panel = document.createElement("div");
    panel.className = "tab-panel";
    panel.id = `panel-${level}`;

    const summary = document.createElement("div");
    summary.className = "level-summary";
    summary.innerHTML = `
      <div class="score-block">
        <span class="score-value" id="score-${level}">0</span>
        <span class="score-max">/ 100 pontos válidos</span>
      </div>
      <div class="progress-track"><div class="progress-fill" id="progress-${level}" style="width:0%"></div></div>
      <span class="score-max" id="raw-${level}"></span>
    `;
    panel.appendChild(summary);

    data.groups.forEach((group, gi) => {
      const groupEl = document.createElement("section");
      groupEl.className = "group";
      groupEl.id = `group-${level}-${gi}`;

      const header = document.createElement("button");
      header.type = "button";
      header.className = "group-header";
      header.innerHTML = `
        <span class="group-title">${group.title}</span>
        <span class="group-meta">
          <span class="group-cap">peso ${group.weight} · teto ${group.cap} pts</span>
          <span class="group-score" id="gscore-${level}-${gi}">0 pts</span>
          <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
        </span>
      `;
      header.addEventListener("click", () => {
        groupEl.classList.toggle("open");
      });
      groupEl.appendChild(header);

      const body = document.createElement("div");
      body.className = "group-body";

      const colHeaders = document.createElement("div");
      colHeaders.className = "col-headers";
      colHeaders.innerHTML = `<span>Atividade</span><span>Fator</span><span>Unidade / máx.</span><span>Qtd.</span><span>Pontos</span>`;
      body.appendChild(colHeaders);

      group.items.forEach((item, ii) => {
        const row = document.createElement("div");
        row.className = "item-row";
        const key = qtyKey(level, gi, ii);
        const savedQty = state.qty[key] || "";

        row.innerHTML = `
          <span class="item-desc">${item.desc}</span>
          <span class="item-factor">${fmt(item.factor)}</span>
          <span class="item-max">${item.unit}<br>máx. ${item.max}</span>
          <span class="item-qty"><input type="number" min="0" step="1" inputmode="numeric" value="${savedQty}" data-level="${level}" data-gi="${gi}" data-ii="${ii}" data-max="${item.max}" aria-label="Quantidade comprovada"></span>
          <span class="item-points" id="pts-${key}">0</span>
        `;
        body.appendChild(row);
      });

      groupEl.appendChild(body);
      panel.appendChild(groupEl);
    });

    return panel;
  }

  function buildTabs() {
    const tabsEl = document.getElementById("tabs");
    const panelsEl = document.getElementById("panels");

    LEVELS.forEach((level, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab-btn" + (idx === 0 ? " active" : "");
      btn.textContent = RSC_DATA[level].label;
      btn.dataset.target = `panel-${level}`;
      btn.dataset.level = level;
      btn.addEventListener("click", () => activateTab(btn.dataset.target));
      tabsEl.appendChild(btn);

      const panel = buildLevelPanel(level);
      if (idx === 0) panel.classList.add("active");
      panelsEl.appendChild(panel);
    });

    const resumoBtn = document.createElement("button");
    resumoBtn.type = "button";
    resumoBtn.className = "tab-btn";
    resumoBtn.textContent = "Resumo";
    resumoBtn.dataset.target = "panel-resumo";
    resumoBtn.addEventListener("click", () => activateTab("panel-resumo"));
    tabsEl.appendChild(resumoBtn);
  }

  function activateTab(targetId) {
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.toggle("active", b.dataset.target === targetId);
    });
    document.querySelectorAll(".tab-panel").forEach((p) => {
      p.classList.toggle("active", p.id === targetId);
    });
  }

  function buildResumo() {
    const panel = document.getElementById("panel-resumo");
    panel.innerHTML = `
      <div class="resumo-grid" id="resumo-cards"></div>
      <table class="resumo-table" id="resumo-table">
        <thead>
          <tr><th>Diretriz</th><th class="num">Peso</th><th class="num">Teto</th><th class="num">Obtida</th><th class="num">Válida</th></tr>
        </thead>
        <tbody id="resumo-tbody"></tbody>
      </table>
      <div class="status-banner" id="status-banner"></div>
    `;
  }

  function renderCalculations() {
    const { result, grandTotal } = computeAll();

    LEVELS.forEach((level) => {
      const r = result[level];
      const data = RSC_DATA[level];
      r.groups.forEach((g, gi) => {
        const scoreEl = document.getElementById(`gscore-${level}-${gi}`);
        if (scoreEl) scoreEl.textContent = `${fmt(g.valid)} pts`;
        data.groups[gi].items.forEach((item, ii) => {
          const key = qtyKey(level, gi, ii);
          const qty = state.qty[key] || 0;
          const pts = itemPoints(item, qty);
          const ptsEl = document.getElementById(`pts-${key}`);
          if (ptsEl) ptsEl.textContent = fmt(pts);
        });
      });
      const scoreValEl = document.getElementById(`score-${level}`);
      const progEl = document.getElementById(`progress-${level}`);
      const rawEl = document.getElementById(`raw-${level}`);
      if (scoreValEl) scoreValEl.textContent = fmt(r.validTotal);
      if (progEl) {
        const pct = Math.min(100, (r.validTotal / 100) * 100);
        progEl.style.width = pct + "%";
        progEl.classList.toggle("complete", r.validTotal >= 100);
      }
      if (rawEl) rawEl.textContent = r.obtainedTotal > r.validTotal ? `(bruto: ${fmt(r.obtainedTotal)} pts)` : "";
    });

    // Resumo cards
    const cardsEl = document.getElementById("resumo-cards");
    if (cardsEl) {
      cardsEl.innerHTML = LEVELS.map((level) => `
        <div class="resumo-card">
          <h3>${RSC_DATA[level].label}</h3>
          <div class="big">${fmt(result[level].validTotal)}</div>
          <div class="of100">de 100 pontos</div>
        </div>
      `).join("") + `
        <div class="resumo-card total">
          <h3>Total geral</h3>
          <div class="big">${fmt(grandTotal)}</div>
          <div class="of100">de 300 pontos</div>
        </div>
      `;
    }

    // Resumo table
    const tbody = document.getElementById("resumo-tbody");
    if (tbody) {
      let rows = "";
      LEVELS.forEach((level) => {
        const data = RSC_DATA[level];
        const r = result[level];
        rows += `<tr><td colspan="5" style="background:var(--gray-100);font-weight:800;color:var(--green-900)">${data.label}</td></tr>`;
        data.groups.forEach((group, gi) => {
          const g = r.groups[gi];
          const capped = g.obtained > g.cap;
          rows += `<tr class="${capped ? "capped" : ""}">
            <td>${group.title}</td>
            <td class="num">${group.weight}</td>
            <td class="num">${group.cap}</td>
            <td class="num">${fmt(g.obtained)}</td>
            <td class="num valid">${fmt(g.valid)}</td>
          </tr>`;
        });
        rows += `<tr class="subtotal"><td>Subtotal ${data.label}</td><td></td><td class="num">100</td><td></td><td class="num">${fmt(r.validTotal)}</td></tr>`;
      });
      tbody.innerHTML = rows;
    }

    // Status banner
    const pretendido = state.info.pretendido || "";
    const banner = document.getElementById("status-banner");
    if (banner) {
      if (!pretendido) {
        banner.className = "status-banner pending";
        banner.textContent = "Marque o RSC que você pretende pleitear (no topo da página) para ver a situação.";
      } else {
        const nivelPts = result[pretendido].validTotal;
        const regra = REGRAS[state.info.regra] || REGRAS[REGRA_PADRAO];
        const MIN_NIVEL = regra.nivel;
        const MIN_TOTAL = regra.total;
        const okNivel = nivelPts >= MIN_NIVEL;
        const okTotal = grandTotal >= MIN_TOTAL;
        const label = RSC_DATA[pretendido].label;
        const partes = [
          `${label}: ${fmt(nivelPts)}/${MIN_NIVEL} pts ${okNivel ? "✔" : "(faltam " + fmt(MIN_NIVEL - nivelPts) + ")"}`,
          `Total geral: ${fmt(grandTotal)}/${MIN_TOTAL} pts ${okTotal ? "✔" : "(faltam " + fmt(MIN_TOTAL - grandTotal) + ")"}`,
          `Regra: ${regra.nome}`,
        ];
        if (okNivel && okTotal) {
          banner.className = "status-banner ok";
          banner.textContent = `Pontuação suficiente para ${label}. ${partes.join(" · ")}`;
        } else {
          banner.className = "status-banner pending";
          banner.textContent = `Pontuação ainda insuficiente para ${label}. ${partes.join(" · ")}`;
        }
      }
    }
  }

  function bindInputs() {
    document.getElementById("panels").addEventListener("input", (e) => {
      const input = e.target;
      if (input.tagName !== "INPUT" || input.type !== "number") return;
      const { level, gi, ii, max } = input.dataset;
      const key = qtyKey(level, gi, ii);
      let val = input.value === "" ? "" : Math.max(0, Number(input.value));
      if (val !== "" && max && val > Number(max)) {
        input.classList.add("over-limit");
      } else {
        input.classList.remove("over-limit");
      }
      state.qty[key] = val === "" ? 0 : val;
      saveState();
      renderCalculations();
    });
  }

  function bindInfoFields() {
    const ids = ["docente-nome", "docente-siape", "docente-campus", "docente-titulacao", "docente-processo"];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (state.info[id] !== undefined) el.value = state.info[id];
      el.addEventListener("input", () => {
        state.info[id] = el.value;
        saveState();
      });
    });

    // Escolha do RSC pretendido: checkboxes mutuamente exclusivos (marcar de novo desmarca).
    const boxes = document.querySelectorAll('input[name="rsc-pretendido"]');
    const syncBoxes = () => {
      boxes.forEach((b) => { b.checked = b.value === state.info.pretendido; });
      document.querySelectorAll(".tab-btn").forEach((btn) => {
        const lvl = btn.dataset.level;
        btn.classList.toggle("is-target", !!lvl && lvl === state.info.pretendido);
      });
    };
    boxes.forEach((box) => {
      box.addEventListener("change", () => {
        state.info.pretendido = box.checked ? box.value : "";
        saveState();
        syncBoxes();
        renderCalculations();
        if (box.checked) activateTab(`panel-${box.value}`);
      });
    });
    syncBoxes();

    // Regra de aprovação (select).
    const regraSel = document.getElementById("rsc-regra");
    if (regraSel) {
      regraSel.value = REGRAS[state.info.regra] ? state.info.regra : REGRA_PADRAO;
      regraSel.addEventListener("change", () => {
        state.info.regra = regraSel.value;
        saveState();
        renderCalculations();
      });
    }
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function bindActions() {
    document.getElementById("btn-print").addEventListener("click", () => window.print());
    document.getElementById("btn-clear").addEventListener("click", () => {
      if (!confirm("Limpar todas as quantidades informadas? Os dados do docente serão mantidos.")) return;
      state.qty = {};
      saveState();
      document.querySelectorAll('.item-qty input[type="number"]').forEach((inp) => {
        inp.value = "";
        inp.classList.remove("over-limit");
      });
      renderCalculations();
      showToast("Quantidades limpas.");
    });
  }

  function init() {
    buildTabs();
    buildResumo();
    bindInputs();
    bindInfoFields();
    bindActions();
    renderCalculations();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
