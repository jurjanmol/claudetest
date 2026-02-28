// ============================================================
// Rooster & Beschikbaarheid — volledig functionele app
// ============================================================

// ---- DATA MODEL ----
const TEAMS = [
  { id: 'alpha', naam: 'Alpha', kleur: 'badge-blue',   manager: 'Maria Garcia' },
  { id: 'beta',  naam: 'Beta',  kleur: 'badge-green',  manager: 'Erik Smit'    },
  { id: 'gamma', naam: 'Gamma', kleur: 'badge-purple', manager: 'Anke Jansen'  },
  { id: 'delta', naam: 'Delta', kleur: 'badge-orange', manager: 'Koen Peters'  },
];

let medewerkers = [
  { id:'jv',  init:'JV', naam:'Jan de Vries',   team:'alpha', contract:40, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:8,za:0,zo:0} },
  { id:'sb',  init:'SB', naam:'Sara Bakker',    team:'alpha', contract:32, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:0,za:0,zo:0} },
  { id:'pk',  init:'PK', naam:'Pieter Klaassen',team:'alpha', contract:40, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:8,za:0,zo:0} },
  { id:'lm',  init:'LM', naam:'Lisa Mulder',    team:'alpha', contract:36, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:4,vr:4,za:0,zo:0} },
  { id:'rn',  init:'RN', naam:'Ruben Nijholt',  team:'alpha', contract:40, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:8,za:0,zo:0} },
  { id:'es',  init:'ES', naam:'Erik Smit',      team:'beta',  contract:40, rol:'Manager',    start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:8,za:0,zo:0} },
  { id:'nh',  init:'NH', naam:'Nina Hoekstra',  team:'beta',  contract:32, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:0,za:0,zo:0} },
  { id:'mb',  init:'MB', naam:'Mark de Boer',   team:'beta',  contract:40, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:8,za:0,zo:0} },
  { id:'lw',  init:'LW', naam:'Laura Willems',  team:'beta',  contract:36, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:4,vr:4,za:0,zo:0} },
  { id:'aj',  init:'AJ', naam:'Anke Jansen',    team:'gamma', contract:40, rol:'Manager',    start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:8,za:0,zo:0} },
  { id:'tv',  init:'TV', naam:'Tom Visser',     team:'gamma', contract:40, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:8,za:0,zo:0} },
  { id:'fd',  init:'FD', naam:'Fiona Dam',      team:'gamma', contract:32, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:0,za:0,zo:0} },
  { id:'kp',  init:'KP', naam:'Koen Peters',    team:'delta', contract:40, rol:'Manager',    start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:8,za:0,zo:0} },
  { id:'hw',  init:'HW', naam:'Hannah Wolf',    team:'delta', contract:40, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:8,vr:8,za:0,zo:0} },
  { id:'bg',  init:'BG', naam:'Bas Groot',      team:'delta', contract:36, rol:'Medewerker', start:'2026-01-01', schema:{ma:8,di:8,wo:8,do:4,vr:4,za:0,zo:0} },
];

let registraties = [
  { id:1, empId:'jv', type:'uitleen', week:9, jaar:2026, ma:8,di:8,wo:0,do:0,vr:0, omschr:'Ondersteuning migratie', naarTeam:'beta',  vanTeam:null },
  { id:2, empId:'jv', type:'project', week:9, jaar:2026, ma:0,di:0,wo:8,do:0,vr:0, omschr:'Architectuur review',   naarTeam:null,    vanTeam:null },
  { id:3, empId:'sb', type:'uitleen', week:9, jaar:2026, ma:8,di:0,wo:0,do:0,vr:0, omschr:'Review documenten',    naarTeam:'beta',  vanTeam:null },
  { id:4, empId:'sb', type:'verlof',  week:9, jaar:2026, ma:0,di:8,wo:0,do:0,vr:0, omschr:'Vakantie',             naarTeam:null,    vanTeam:null },
  { id:5, empId:'pk', type:'project', week:9, jaar:2026, ma:0,di:8,wo:8,do:0,vr:0, omschr:'Q1 release',           naarTeam:null,    vanTeam:null },
  { id:6, empId:'lm', type:'ziekte',  week:9, jaar:2026, ma:8,di:0,wo:0,do:0,vr:0, omschr:'Ziek gemeld',          naarTeam:null,    vanTeam:null },
  { id:7, empId:'tv', type:'uitleen', week:9, jaar:2026, ma:0,di:0,wo:0,do:8,vr:0, omschr:'Testondersteuning',    naarTeam:'delta', vanTeam:null },
  { id:8, empId:'jv', type:'verlof',  week:8, jaar:2026, ma:8,di:8,wo:0,do:0,vr:0, omschr:'Vakantie',             naarTeam:null,    vanTeam:null },
];
let nextId = 9;

// ---- STATE ----
const state = {
  week: 9, jaar: 2026,
  view: 'dashboard',
  selectedTeam: 'alpha',
  selectedEmp:  'jv',
  filterTeam: 'alle',
  filterType: 'alle',
};

// ---- WEEK HELPERS ----
const WEEK_DATES = {
  7:  'Week 7 \u2014 9 feb \u2013 13 feb 2026',
  8:  'Week 8 \u2014 17 feb \u2013 21 feb 2026',
  9:  'Week 9 \u2014 24 feb \u2013 28 feb 2026',
  10: 'Week 10 \u2014 3 mrt \u2013 7 mrt 2026',
  11: 'Week 11 \u2014 10 mrt \u2013 14 mrt 2026',
  12: 'Week 12 \u2014 17 mrt \u2013 21 mrt 2026',
};
const DAG_NAMEN = ['ma','di','wo','do','vr'];

function changeWeek(delta) {
  state.week = Math.max(1, Math.min(52, state.week + delta));
  const label = WEEK_DATES[state.week] || `Week ${state.week} \u2014 ${state.jaar}`;
  document.getElementById('week-label').innerHTML = label;
  renderCurrentView();
}

// ---- LOOKUP HELPERS ----
function getTeam(id)  { return TEAMS.find(t => t.id === id); }
function getEmp(id)   { return medewerkers.find(e => e.id === id); }

function teamBadge(teamId) {
  const t = getTeam(teamId);
  return t ? `<span class="team-badge ${t.kleur}">${t.naam}</span>` : '';
}

function regTotal(r) { return r.ma + r.di + r.wo + r.do + r.vr; }

function regsForWeek(week, jaar) {
  return registraties.filter(r => r.week === week && r.jaar === jaar);
}

function calcEmpStats(emp, week, jaar) {
  const regs = registraties.filter(r => r.empId === emp.id && r.week === week && r.jaar === jaar);
  const s = emp.schema;
  const bruto = s.ma + s.di + s.wo + s.do + s.vr;
  let verlof=0, ziekte=0, project=0, uitleen=0, inleen=0;
  regs.forEach(r => {
    const t = regTotal(r);
    if (r.type==='verlof')  verlof  += t;
    if (r.type==='ziekte')  ziekte  += t;
    if (r.type==='project') project += t;
    if (r.type==='uitleen') uitleen += t;
    if (r.type==='inleen')  inleen  += t;
  });
  const beschikbaar = Math.max(0, bruto - verlof - ziekte - project - uitleen + inleen);
  return { bruto, verlof, ziekte, project, uitleen, inleen, beschikbaar };
}

function calcTeamStats(teamId, week, jaar) {
  const emps = medewerkers.filter(e => e.team === teamId);
  let bruto=0, verlof=0, ziekte=0, project=0, uitleen=0, inleen=0;
  emps.forEach(e => {
    const s = calcEmpStats(e, week, jaar);
    bruto+=s.bruto; verlof+=s.verlof; ziekte+=s.ziekte;
    project+=s.project; uitleen+=s.uitleen; inleen+=s.inleen;
  });
  const beschikbaar = Math.max(0, bruto - verlof - ziekte - project - uitleen + inleen);
  return { bruto, verlof, ziekte, project, uitleen, inleen, beschikbaar, aantalEmps: emps.length };
}

function pctClass(pct) {
  if (pct >= 85) return 'pct-green';
  if (pct >= 70) return 'pct-yellow';
  return 'pct-red';
}

// ---- NAVIGATION ----
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + name);
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navLink = document.querySelector(`.nav-item[onclick*="'${name}'"]`);
  if (navLink) navLink.classList.add('active');
  state.view = name;
  renderCurrentView();
}

function renderCurrentView() {
  switch (state.view) {
    case 'dashboard':      renderDashboard(); break;
    case 'teams':          renderTeams(); break;
    case 'medewerkers':    renderMedewerkers(); break;
    case 'beschikbaarheid': renderBeschikbaarheid(); break;
    case 'rooster':        renderRooster(); break;
    case 'uitleen':        renderUitleen(); break;
  }
  const LABELS = { dashboard:'Dashboard', beschikbaarheid:'Beschikbaarheid', rooster:'Werkroosters', uitleen:'Uitleen & Inleen' };
  let bc = LABELS[state.view] || state.view;
  if (state.view === 'teams')      { const t = getTeam(state.selectedTeam); bc = `Teams \u203a ${t?.naam||''}`; }
  if (state.view === 'medewerkers') { const e = getEmp(state.selectedEmp);   bc = `Medewerkers \u203a ${e?.naam||''}`; }
  document.getElementById('breadcrumb').textContent = bc;
}

function selectTeam(teamId) {
  state.selectedTeam = teamId;
  state.view = 'teams';
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-teams').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navLink = document.querySelector(`.nav-item[onclick*="'teams'"]`);
  if (navLink) navLink.classList.add('active');
  renderCurrentView();
}

function selectMedewerker(empId) {
  state.selectedEmp = empId;
  showView('medewerkers');
}

// ---- RENDER DASHBOARD ----
function renderDashboard() {
  const { week, jaar } = state;
  let totBruto=0, totVerlof=0, totZiekte=0, totProject=0, totUitleen=0, totInleen=0, totBeschikbaar=0;

  const teamRows = TEAMS.map(t => {
    const s = calcTeamStats(t.id, week, jaar);
    totBruto+=s.bruto; totVerlof+=s.verlof; totZiekte+=s.ziekte;
    totProject+=s.project; totUitleen+=s.uitleen; totInleen+=s.inleen; totBeschikbaar+=s.beschikbaar;
    const pct = s.bruto > 0 ? +(s.beschikbaar / s.bruto * 100).toFixed(1) : 0;
    return `<tr class="clickable" onclick="showView('teams'); selectTeam('${t.id}')">
      <td>${teamBadge(t.id)}</td>
      <td class="right">${s.bruto}</td>
      <td class="right text-orange">${s.verlof||'—'}</td>
      <td class="right text-red">${s.ziekte||'—'}</td>
      <td class="right text-purple">${s.project||'—'}</td>
      <td class="right text-orange">${s.uitleen||'—'}</td>
      <td class="right text-green">${s.inleen||'—'}</td>
      <td class="right"><strong>${s.beschikbaar}</strong></td>
      <td class="right"><span class="pct ${pctClass(pct)}">${String(pct).replace('.',',')}%</span></td>
    </tr>`;
  }).join('');

  const totPct = totBruto > 0 ? +(totBeschikbaar / totBruto * 100).toFixed(1) : 0;
  const totNiet = totVerlof + totZiekte + totProject + totUitleen - totInleen;

  const uitleenRegs = regsForWeek(week, jaar).filter(r => r.type === 'uitleen');
  const uitleenRows = uitleenRegs.map(r => {
    const e = getEmp(r.empId);
    return `<tr>
      <td>${e?.naam||r.empId}</td>
      <td>${e ? teamBadge(e.team) : '—'}</td>
      <td>${r.naarTeam ? teamBadge(r.naarTeam) : '—'}</td>
      <td class="right">${regTotal(r)}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="4" style="text-align:center;color:var(--os-text-muted);padding:16px">Geen uitleningen deze week</td></tr>';

  const maxBar = Math.max(totVerlof, totProject, totUitleen, totZiekte, 1);

  document.getElementById('view-dashboard').innerHTML = `
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-label">Totale bruto uren</div>
        <div class="kpi-value">${totBruto.toLocaleString('nl')}</div>
        <div class="kpi-sub">${TEAMS.length} teams &middot; ${medewerkers.length} medewerkers</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Beschikbare uren</div>
        <div class="kpi-value kpi-green">${totBeschikbaar.toLocaleString('nl')}</div>
        <div class="kpi-sub">${String(totPct).replace('.',',')}% van bruto</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Niet beschikbaar</div>
        <div class="kpi-value kpi-orange">${totNiet}</div>
        <div class="kpi-sub">Ziekte &middot; Verlof &middot; Project &middot; Uitleen</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Lopende uitleningen</div>
        <div class="kpi-value kpi-blue">${uitleenRegs.length}</div>
        <div class="kpi-sub">medewerkers uitgeleend</div>
      </div>
    </div>

    <div class="section-title">Teamoverzicht &mdash; week ${week}</div>
    <div class="card table-card">
      <div class="card-header-row">
        <div class="card-title">Overzicht per team</div>
        <button class="btn btn-secondary" onclick="exportCSV('dashboard')">&#8595; Exporteer CSV</button>
      </div>
      <table class="data-table">
        <thead><tr>
          <th>Team</th><th class="right">Bruto uren</th><th class="right">Verlof</th>
          <th class="right">Ziekte</th><th class="right">Projectinzet</th>
          <th class="right">Uitleen (&ndash;)</th><th class="right">Inleen (+)</th>
          <th class="right">Beschikbaar</th><th class="right">%</th>
        </tr></thead>
        <tbody>${teamRows}</tbody>
        <tfoot><tr>
          <td><strong>Totaal</strong></td>
          <td class="right"><strong>${totBruto}</strong></td>
          <td class="right"><strong>${totVerlof||'—'}</strong></td>
          <td class="right"><strong>${totZiekte||'—'}</strong></td>
          <td class="right"><strong>${totProject||'—'}</strong></td>
          <td class="right"><strong>${totUitleen||'—'}</strong></td>
          <td class="right"><strong>${totInleen||'—'}</strong></td>
          <td class="right"><strong>${totBeschikbaar}</strong></td>
          <td class="right"><span class="pct ${pctClass(totPct)}">${String(totPct).replace('.',',')}%</span></td>
        </tr></tfoot>
      </table>
    </div>

    <div class="section-title" style="margin-top:32px">Urenverdeling per type</div>
    <div class="chart-row">
      <div class="card chart-card">
        <div class="chart-title">Niet-beschikbare uren &mdash; type</div>
        <div class="bar-chart">
          <div class="bar-item">
            <div class="bar-label">Verlof</div>
            <div class="bar-track"><div class="bar-fill bar-orange" style="width:${Math.round(totVerlof/maxBar*100)}%"></div></div>
            <div class="bar-value">${totVerlof} u</div>
          </div>
          <div class="bar-item">
            <div class="bar-label">Projectinzet</div>
            <div class="bar-track"><div class="bar-fill bar-purple" style="width:${Math.round(totProject/maxBar*100)}%"></div></div>
            <div class="bar-value">${totProject} u</div>
          </div>
          <div class="bar-item">
            <div class="bar-label">Uitleen</div>
            <div class="bar-track"><div class="bar-fill bar-blue" style="width:${Math.round(totUitleen/maxBar*100)}%"></div></div>
            <div class="bar-value">${totUitleen} u</div>
          </div>
          <div class="bar-item">
            <div class="bar-label">Ziekte</div>
            <div class="bar-track"><div class="bar-fill bar-red" style="width:${Math.round(totZiekte/maxBar*100)}%"></div></div>
            <div class="bar-value">${totZiekte} u</div>
          </div>
        </div>
      </div>
      <div class="card chart-card">
        <div class="chart-title">Actieve uitleningen &mdash; week ${week}</div>
        <table class="data-table mini-table">
          <thead><tr><th>Medewerker</th><th>Van team</th><th>Naar team</th><th class="right">Uren</th></tr></thead>
          <tbody>${uitleenRows}</tbody>
        </table>
      </div>
    </div>`;
}

// ---- RENDER TEAMS ----
function renderTeams() {
  const { week, jaar, selectedTeam } = state;
  const team = getTeam(selectedTeam);
  const ts   = calcTeamStats(selectedTeam, week, jaar);
  const emps = medewerkers.filter(e => e.team === selectedTeam);
  const pct  = ts.bruto > 0 ? +(ts.beschikbaar / ts.bruto * 100).toFixed(1) : 0;

  const tabs = TEAMS.map(t =>
    `<button class="btn ${t.id===selectedTeam?'btn-primary':'btn-secondary'}" onclick="selectTeam('${t.id}')">${t.naam}</button>`
  ).join('');

  let totC=0, totV=0, totZ=0, totP=0, totU=0, totI=0, totB=0;
  const empRows = emps.map(e => {
    const s = calcEmpStats(e, week, jaar);
    totC+=e.contract; totV+=s.verlof; totZ+=s.ziekte; totP+=s.project; totU+=s.uitleen; totI+=s.inleen; totB+=s.beschikbaar;
    return `<tr class="clickable" onclick="selectMedewerker('${e.id}')">
      <td><div class="emp-cell"><div class="emp-avatar">${e.init}</div>${e.naam}</div></td>
      <td class="right">${e.contract}</td>
      <td class="right text-orange">${s.verlof||'—'}</td>
      <td class="right text-red">${s.ziekte||'—'}</td>
      <td class="right text-purple">${s.project||'—'}</td>
      <td class="right text-orange">${s.uitleen||'—'}</td>
      <td class="right text-green">${s.inleen||'—'}</td>
      <td class="right"><strong>${s.beschikbaar}</strong></td>
      <td class="right"><button class="btn btn-xs btn-secondary" onclick="event.stopPropagation(); openRegistreerModal('${e.id}')">+ Uren</button></td>
    </tr>`;
  }).join('');

  document.getElementById('view-teams').innerHTML = `
    <div style="display:flex;gap:8px;margin-bottom:20px">${tabs}</div>
    <div class="section-title">Team: ${team.naam}</div>
    <div class="card" style="padding:20px 24px;margin-bottom:24px">
      <div class="team-header-row">
        <div><div class="field-label">Manager</div><div>${team.manager}</div></div>
        <div><div class="field-label">Medewerkers</div><div>${ts.aantalEmps}</div></div>
        <div><div class="field-label">Bruto uren / week</div><div>${ts.bruto}</div></div>
        <div><div class="field-label">Beschikbaar week ${week}</div><div class="kpi-green" style="font-weight:700">${ts.beschikbaar} u (${String(pct).replace('.',',')}%)</div></div>
      </div>
    </div>
    <div class="card table-card">
      <div class="card-header-row">
        <div class="card-title">Medewerkers</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary" onclick="exportCSV('teams')">&#8595; Exporteer CSV</button>
          <button class="btn btn-primary" onclick="showModal('medewerker')">+ Medewerker toevoegen</button>
        </div>
      </div>
      <table class="data-table">
        <thead><tr>
          <th>Naam</th><th class="right">Contract u/week</th>
          <th class="right">Verlof</th><th class="right">Ziekte</th>
          <th class="right">Project</th><th class="right">Uitleen</th>
          <th class="right">Inleen</th><th class="right">Netto beschikbaar</th><th></th>
        </tr></thead>
        <tbody>${empRows}</tbody>
        <tfoot><tr>
          <td><strong>Totaal team ${team.naam}</strong></td>
          <td class="right"><strong>${totC}</strong></td>
          <td class="right"><strong>${totV||'—'}</strong></td>
          <td class="right"><strong>${totZ||'—'}</strong></td>
          <td class="right"><strong>${totP||'—'}</strong></td>
          <td class="right"><strong>${totU||'—'}</strong></td>
          <td class="right"><strong>${totI||'—'}</strong></td>
          <td class="right"><strong>${totB}</strong></td>
          <td></td>
        </tr></tfoot>
      </table>
    </div>`;
}

// ---- RENDER MEDEWERKERS ----
function renderMedewerkers() {
  const { week, jaar, selectedEmp } = state;
  const emp  = getEmp(selectedEmp);
  if (!emp) return;
  const s    = calcEmpStats(emp, week, jaar);
  const team = getTeam(emp.team);
  const regs = registraties.filter(r => r.empId === selectedEmp && r.week === week && r.jaar === jaar);

  const dagBruto = DAG_NAMEN.map(d => emp.schema[d]);
  const typen    = { verlof:[0,0,0,0,0], ziekte:[0,0,0,0,0], project:[0,0,0,0,0], uitleen:[0,0,0,0,0], inleen:[0,0,0,0,0] };
  regs.forEach(r => { if (typen[r.type]) DAG_NAMEN.forEach((d,i) => typen[r.type][i] += r[d]); });
  const netBeschikbaar = DAG_NAMEN.map((_,i) => Math.max(0, dagBruto[i] - typen.verlof[i] - typen.ziekte[i] - typen.project[i] - typen.uitleen[i] + typen.inleen[i]));

  function calRow(label, data, cls) {
    if (data.reduce((a,b)=>a+b,0) === 0) return '';
    return `<tr class="${cls}"><td>${label}</td>${data.map(v=>`<td>${v||'—'}</td>`).join('')}<td class="right">${data.reduce((a,b)=>a+b,0)}</td></tr>`;
  }

  const uitleenReg   = regs.find(r => r.type === 'uitleen');
  const uitleenLabel = uitleenReg?.naarTeam
    ? `<span class="type-dot dot-blue"></span> Uitleen &rarr; ${getTeam(uitleenReg.naarTeam)?.naam||uitleenReg.naarTeam}`
    : `<span class="type-dot dot-blue"></span> Uitleen`;

  const typeBadgeMap = {
    verlof:  '<span class="badge badge-orange-soft">Verlof</span>',
    ziekte:  '<span class="badge badge-red-soft">Ziekte</span>',
    project: '<span class="badge badge-purple-soft">Projectinzet</span>',
    uitleen: '<span class="badge badge-blue-soft">Uitleen</span>',
    inleen:  '<span class="badge" style="background:var(--os-green-light);color:#0D8A5E">Inleen</span>',
  };

  const allRegs = registraties.filter(r => r.empId === selectedEmp).sort((a,b) => b.week - a.week);
  const histRows = allRegs.map(r => {
    const t = getTeam(r.naarTeam || r.vanTeam);
    return `<tr>
      <td>W${r.week} ${r.jaar}</td>
      <td>${typeBadgeMap[r.type]||r.type}</td>
      <td>${regTotal(r)}</td>
      <td>${r.omschr||'—'}</td>
      <td>${t ? teamBadge(t.id) : '—'}</td>
      <td><button class="btn btn-xs btn-danger" onclick="deleteRegistratie(${r.id})">Verwijder</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="6" style="text-align:center;color:var(--os-text-muted);padding:16px">Geen registraties gevonden</td></tr>';

  const empSelector = `<select class="form-select" onchange="selectMedewerker(this.value)" style="font-size:13px;max-width:280px">
    ${medewerkers.map(e => `<option value="${e.id}" ${e.id===selectedEmp?'selected':''}>${e.naam} (${getTeam(e.team)?.naam||e.team})</option>`).join('')}
  </select>`;

  document.getElementById('view-medewerkers').innerHTML = `
    <div style="margin-bottom:16px">${empSelector}</div>
    <div class="employee-detail">
      <div class="card emp-profile-card">
        <div class="emp-profile-header">
          <div class="emp-avatar large">${emp.init}</div>
          <div>
            <div class="emp-name">${emp.naam}</div>
            <div class="emp-meta">Team ${team?.naam||emp.team} &middot; ${emp.rol}</div>
          </div>
          <button class="btn btn-secondary" style="margin-left:auto" onclick="openBrutoModal('${emp.id}')">Bruto uren &amp; rooster</button>
        </div>
        <div class="emp-stats">
          <div class="emp-stat"><div class="field-label">Contract</div><div class="stat-val">${emp.contract} u/week</div></div>
          <div class="emp-stat"><div class="field-label">Werkdagen</div><div class="stat-val">Ma&ndash;Vr</div></div>
          <div class="emp-stat"><div class="field-label">Beschikbaar week ${week}</div><div class="stat-val kpi-green">${s.beschikbaar} u</div></div>
          <div class="emp-stat"><div class="field-label">Niet beschikbaar</div><div class="stat-val kpi-orange">${s.bruto - s.beschikbaar} u</div></div>
        </div>
      </div>

      <div class="week-calendar card">
        <div class="card-header-row">
          <div class="card-title">Week ${week} &mdash; dagweergave</div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary" onclick="exportCSV('medewerker')">&#8595; Exporteer CSV</button>
            <button class="btn btn-primary" onclick="openRegistreerModal('${emp.id}')">+ Uren registreren</button>
          </div>
        </div>
        <table class="cal-table">
          <thead><tr>
            <th>Type</th><th>Ma</th><th>Di</th><th>Wo</th><th>Do</th><th>Vr</th><th class="right">Totaal</th>
          </tr></thead>
          <tbody>
            <tr class="row-bruto">
              <td>Bruto uren</td>
              ${dagBruto.map(v=>`<td>${v}</td>`).join('')}
              <td class="right"><strong>${s.bruto}</strong></td>
            </tr>
            ${calRow('<span class="type-dot dot-orange"></span> Verlof', typen.verlof, 'row-verlof')}
            ${calRow('<span class="type-dot dot-red"></span> Ziekte', typen.ziekte, 'row-ziekte')}
            ${calRow('<span class="type-dot dot-purple"></span> Projectinzet', typen.project, 'row-project')}
            ${typen.uitleen.reduce((a,b)=>a+b,0)>0 ? calRow(uitleenLabel, typen.uitleen, 'row-uitleen') : ''}
            ${calRow('<span class="type-dot dot-green"></span> Inleen', typen.inleen, 'row-inleen')}
            <tr class="row-beschikbaar">
              <td><strong>Netto beschikbaar</strong></td>
              ${netBeschikbaar.map(v=>`<td><strong>${v}</strong></td>`).join('')}
              <td class="right"><strong>${s.beschikbaar}</strong></td>
            </tr>
          </tbody>
        </table>
        <div class="cal-legend">
          <span class="legend-item"><span class="type-dot dot-orange"></span> Verlof</span>
          <span class="legend-item"><span class="type-dot dot-red"></span> Ziekte</span>
          <span class="legend-item"><span class="type-dot dot-purple"></span> Projectinzet</span>
          <span class="legend-item"><span class="type-dot dot-blue"></span> Uitleen</span>
          <span class="legend-item"><span class="type-dot dot-green"></span> Inleen</span>
        </div>
      </div>

      <div class="card history-card">
        <div class="card-title" style="margin-bottom:16px">Registratiehistorie</div>
        <table class="data-table">
          <thead><tr><th>Week</th><th>Type</th><th>Uren</th><th>Omschrijving</th><th>Team</th><th></th></tr></thead>
          <tbody>${histRows}</tbody>
        </table>
      </div>
    </div>`;
}

// ---- RENDER BESCHIKBAARHEID ----
function renderBeschikbaarheid() {
  const { week, jaar, filterTeam, filterType } = state;
  let filtered = regsForWeek(week, jaar);
  if (filterTeam !== 'alle') filtered = filtered.filter(r => { const e = getEmp(r.empId); return e && e.team === filterTeam; });
  if (filterType !== 'alle') filtered = filtered.filter(r => r.type === filterType);

  const typeBadgeMap = {
    verlof:  '<span class="badge badge-orange-soft">Verlof</span>',
    ziekte:  '<span class="badge badge-red-soft">Ziekte</span>',
    project: '<span class="badge badge-purple-soft">Projectinzet</span>',
    uitleen: null,
    inleen:  '<span class="badge" style="background:var(--os-green-light);color:#0D8A5E">Inleen</span>',
  };

  const rows = filtered.map(r => {
    const e = getEmp(r.empId);
    const badge = r.type === 'uitleen'
      ? `<span class="badge badge-blue-soft">Uitleen &rarr; ${getTeam(r.naarTeam)?.naam||r.naarTeam||'?'}</span>`
      : (typeBadgeMap[r.type] || r.type);
    return `<tr>
      <td><div class="emp-cell"><div class="emp-avatar sm">${e?.init||'?'}</div>${e?.naam||r.empId}</div></td>
      <td>${e ? teamBadge(e.team) : '—'}</td>
      <td>${badge}</td>
      <td>W${r.week}</td>
      <td class="right">${r.ma||'—'}</td><td class="right">${r.di||'—'}</td>
      <td class="right">${r.wo||'—'}</td><td class="right">${r.do||'—'}</td>
      <td class="right">${r.vr||'—'}</td>
      <td class="right"><strong>${regTotal(r)}</strong></td>
      <td>${r.omschr||'—'}</td>
      <td><button class="btn btn-xs btn-danger" onclick="deleteRegistratie(${r.id})">Verwijder</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="12" style="text-align:center;color:var(--os-text-muted);padding:20px">Geen registraties gevonden</td></tr>';

  const teamOpts = TEAMS.map(t => `<option value="${t.id}" ${filterTeam===t.id?'selected':''}>${t.naam}</option>`).join('');
  const typeOpts = [['verlof','Verlof'],['ziekte','Ziekte'],['project','Projectinzet'],['uitleen','Uitleen']]
    .map(([v,l]) => `<option value="${v}" ${filterType===v?'selected':''}>${l}</option>`).join('');

  document.getElementById('view-beschikbaarheid').innerHTML = `
    <div class="section-title">Beschikbaarheidsoverzicht &mdash; Week ${week}</div>
    <div class="filter-bar card">
      <div class="filter-item">
        <label class="field-label">Team</label>
        <select class="form-select" id="filter-team" onchange="applyFilter()">
          <option value="alle" ${filterTeam==='alle'?'selected':''}>Alle teams</option>${teamOpts}
        </select>
      </div>
      <div class="filter-item">
        <label class="field-label">Type</label>
        <select class="form-select" id="filter-type" onchange="applyFilter()">
          <option value="alle" ${filterType==='alle'?'selected':''}>Alle types</option>${typeOpts}
        </select>
      </div>
      <button class="btn btn-secondary" onclick="applyFilter()">Toepassen</button>
      <button class="btn btn-secondary" style="margin-left:auto" onclick="exportCSV('beschikbaarheid')">&#8595; Exporteer CSV</button>
    </div>
    <div class="card table-card">
      <table class="data-table">
        <thead><tr>
          <th>Medewerker</th><th>Team</th><th>Type</th><th>Week</th>
          <th class="right">Ma</th><th class="right">Di</th><th class="right">Wo</th>
          <th class="right">Do</th><th class="right">Vr</th>
          <th class="right">Totaal</th><th>Omschrijving</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function applyFilter() {
  state.filterTeam = document.getElementById('filter-team').value;
  state.filterType = document.getElementById('filter-type').value;
  renderBeschikbaarheid();
}

// ---- RENDER ROOSTER ----
function renderRooster() {
  const rows = medewerkers.map(e => {
    const s = e.schema;
    const dagCell = u => u > 0 ? `<td class="center">${u}u</td>` : `<td class="center text-muted">—</td>`;
    return `<tr>
      <td><div class="emp-cell"><div class="emp-avatar sm">${e.init}</div>${e.naam}</div></td>
      <td>${teamBadge(e.team)}</td>
      <td class="right">${e.contract}</td>
      ${dagCell(s.ma)}${dagCell(s.di)}${dagCell(s.wo)}${dagCell(s.do)}${dagCell(s.vr)}${dagCell(s.za)}${dagCell(s.zo)}
      <td>${e.start}</td>
      <td><button class="btn btn-xs btn-secondary" onclick="openBrutoModal('${e.id}')">Bewerk</button></td>
    </tr>`;
  }).join('');

  document.getElementById('view-rooster').innerHTML = `
    <div class="section-title">Werkroosters beheren</div>
    <div class="card table-card">
      <div class="card-header-row">
        <div class="card-title">Werkschema per medewerker</div>
        <div style="display:flex;gap:8px">
          <button class="btn btn-secondary" onclick="exportCSV('rooster')">&#8595; Exporteer CSV</button>
          <button class="btn btn-primary" onclick="openBrutoModal('${medewerkers[0]?.id}')">+ Schema aanpassen</button>
        </div>
      </div>
      <table class="data-table">
        <thead><tr>
          <th>Medewerker</th><th>Team</th><th class="right">Contract u/w</th>
          <th class="center">Ma</th><th class="center">Di</th><th class="center">Wo</th>
          <th class="center">Do</th><th class="center">Vr</th><th class="center">Za</th><th class="center">Zo</th>
          <th>Startdatum</th><th></th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

// ---- RENDER UITLEEN ----
function renderUitleen() {
  const { week, jaar } = state;
  const uitleenRegs = regsForWeek(week, jaar).filter(r => r.type === 'uitleen');
  const totUren = uitleenRegs.reduce((sum, r) => sum + regTotal(r), 0);
  const teamsSet = new Set();
  uitleenRegs.forEach(r => { const e = getEmp(r.empId); if(e) teamsSet.add(e.team); if(r.naarTeam) teamsSet.add(r.naarTeam); });

  const uitleenRows = uitleenRegs.map(r => {
    const e = getEmp(r.empId);
    return `<tr>
      <td><div class="emp-cell"><div class="emp-avatar sm">${e?.init||'?'}</div>${e?.naam||r.empId}</div></td>
      <td>${e ? teamBadge(e.team) : '—'}</td>
      <td>${r.naarTeam ? teamBadge(r.naarTeam) : '—'}</td>
      <td>W${r.week} ${r.jaar}</td>
      <td class="right">${regTotal(r)}</td>
      <td>${r.omschr||'—'}</td>
      <td><span class="status-badge status-active">Actief</span></td>
      <td><button class="btn btn-xs btn-danger" onclick="deleteRegistratie(${r.id})">Verwijder</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="8" style="text-align:center;color:var(--os-text-muted);padding:20px">Geen uitleningen deze week</td></tr>';

  // Inleen grouped by receiving team
  const inleenByTeam = {};
  uitleenRegs.forEach(r => {
    if (!r.naarTeam) return;
    if (!inleenByTeam[r.naarTeam]) inleenByTeam[r.naarTeam] = { emps:[], uren:0, vanTeams:new Set() };
    const e = getEmp(r.empId);
    inleenByTeam[r.naarTeam].emps.push(e?.naam||r.empId);
    inleenByTeam[r.naarTeam].uren += regTotal(r);
    if (e) inleenByTeam[r.naarTeam].vanTeams.add(e.team);
  });

  const inleenRows = Object.entries(inleenByTeam).map(([teamId, data]) => {
    const ts  = calcTeamStats(teamId, week, jaar);
    const eff = ts.bruto > 0 ? +(data.uren / ts.bruto * 100).toFixed(1) : 0;
    return `<tr>
      <td>${teamBadge(teamId)}</td>
      <td>${data.emps.join(', ')}</td>
      <td>${[...data.vanTeams].map(t=>teamBadge(t)).join(' ')}</td>
      <td class="right">${data.uren}</td>
      <td><span class="pct pct-green">+${String(eff).replace('.',',')}% capaciteit</span></td>
    </tr>`;
  }).join('') || '<tr><td colspan="5" style="text-align:center;color:var(--os-text-muted);padding:20px">Geen inleen deze week</td></tr>';

  document.getElementById('view-uitleen').innerHTML = `
    <div class="section-title">Uitleen &amp; Inleen overzicht &mdash; week ${week}</div>
    <div class="uitleen-kpi">
      <div class="kpi-card"><div class="kpi-label">Actieve uitleningen</div><div class="kpi-value kpi-blue">${uitleenRegs.length}</div></div>
      <div class="kpi-card"><div class="kpi-label">Totaal uitgeleende uren (week)</div><div class="kpi-value kpi-orange">${totUren}</div></div>
      <div class="kpi-card"><div class="kpi-label">Betrokken teams</div><div class="kpi-value">${teamsSet.size}</div></div>
    </div>
    <div class="card table-card">
      <div class="card-header-row">
        <div class="card-title">Actieve uitleningen</div>
        <button class="btn btn-secondary" onclick="exportCSV('uitleen')">&#8595; Exporteer CSV</button>
      </div>
      <table class="data-table">
        <thead><tr>
          <th>Medewerker</th><th>Uitlenend team</th><th>Ontvangend team</th>
          <th>Week</th><th class="right">Uren</th><th>Omschrijving</th><th>Status</th><th></th>
        </tr></thead>
        <tbody>${uitleenRows}</tbody>
      </table>
    </div>
    <div class="card table-card" style="margin-top:24px">
      <div class="card-title" style="padding:16px 20px;border-bottom:1px solid var(--os-border)">Inleen per team (week ${week})</div>
      <table class="data-table">
        <thead><tr>
          <th>Ontvangend team</th><th>Ingeleende medewerkers</th><th>Van team</th>
          <th class="right">Uren</th><th>Effect op capaciteit</th>
        </tr></thead>
        <tbody>${inleenRows}</tbody>
      </table>
    </div>`;
}

// ---- MODAL HELPERS ----
function showModal(name) {
  const el = document.getElementById('modal-' + name);
  if (el) el.classList.add('open');
}

function closeModal(name) {
  const el = document.getElementById('modal-' + name);
  if (el) el.classList.remove('open');
}

function openRegistreerModal(empId) {
  const sel = document.getElementById('reg-medewerker');
  if (sel) {
    sel.innerHTML = medewerkers.map(e =>
      `<option value="${e.id}" ${e.id===empId?'selected':''}>${e.naam} (${getTeam(e.team)?.naam||e.team})</option>`
    ).join('');
  }
  const weekInput = document.getElementById('reg-week');
  if (weekInput) weekInput.value = `${state.jaar}-W${String(state.week).padStart(2,'0')}`;
  DAG_NAMEN.forEach(d => { const el = document.getElementById('reg-'+d); if(el) el.value = 0; });
  const om = document.getElementById('reg-omschrijving'); if(om) om.value = '';
  toggleUitleenTeam();
  showModal('registreer');
}

function openBrutoModal(empId) {
  const emp = getEmp(empId);
  if (!emp) return;
  const sel = document.getElementById('bruto-medewerker');
  if (sel) {
    sel.innerHTML = medewerkers.map(e => `<option value="${e.id}" ${e.id===empId?'selected':''}>${e.naam}</option>`).join('');
    sel.value = empId;
  }
  const contEl  = document.getElementById('bruto-contract'); if(contEl)  contEl.value  = emp.contract;
  const startEl = document.getElementById('bruto-start');    if(startEl) startEl.value = emp.start;
  ['ma','di','wo','do','vr','za','zo'].forEach(d => {
    const el = document.getElementById('bruto-'+d); if(el) el.value = emp.schema[d];
  });
  updateBrutoTotaal();
  showModal('brutouren');
}

function toggleUitleenTeam() {
  const typeSelect = document.getElementById('type-select');
  const row        = document.getElementById('uitleen-team-row');
  if (typeSelect && row) row.style.display = typeSelect.value === 'uitleen' ? 'grid' : 'none';
}

function updateBrutoTotaal() {
  const total    = ['ma','di','wo','do','vr','za','zo'].reduce((sum,d) => sum + (parseInt(document.getElementById('bruto-'+d)?.value)||0), 0);
  const contract = parseInt(document.getElementById('bruto-contract')?.value) || 0;
  const infoEl   = document.getElementById('bruto-totaal-info');
  if (infoEl) {
    const ok = total === contract;
    infoEl.innerHTML = `Totaal ingevoerd: <strong>${total} uur/week</strong> &mdash; ${ok ? 'komt overeen met contracturen.' : `<span style="color:var(--os-red)">verschilt van contracturen (${contract} u)</span>`}`;
  }
}

// ---- SAVE ACTIONS ----
function saveRegistratie() {
  const empId   = document.getElementById('reg-medewerker').value;
  const type    = document.getElementById('type-select').value;
  const weekVal = document.getElementById('reg-week').value;          // "2026-W09"
  const [jaarStr, weekStr] = weekVal.split('-W');
  const week    = parseInt(weekStr);
  const jaar    = parseInt(jaarStr);
  const days    = {};
  DAG_NAMEN.forEach(d => { days[d] = parseInt(document.getElementById('reg-'+d).value) || 0; });
  const total = Object.values(days).reduce((a,b)=>a+b,0);
  if (total === 0) { alert('Voer minimaal 1 uur in.'); return; }
  const omschr   = document.getElementById('reg-omschrijving').value;
  const naarTeam = type === 'uitleen' ? document.getElementById('uitleen-naar-team').value : null;

  registraties.push({ id: nextId++, empId, type, week, jaar, ...days, omschr, naarTeam, vanTeam: null });
  closeModal('registreer');
  renderCurrentView();
}

function saveBrutouren() {
  const empId = document.getElementById('bruto-medewerker').value;
  const emp   = getEmp(empId);
  if (!emp) return;
  emp.contract = parseInt(document.getElementById('bruto-contract').value) || emp.contract;
  emp.start    = document.getElementById('bruto-start').value || emp.start;
  ['ma','di','wo','do','vr','za','zo'].forEach(d => { emp.schema[d] = parseInt(document.getElementById('bruto-'+d).value) || 0; });
  closeModal('brutouren');
  renderCurrentView();
}

function saveMedewerker() {
  const voornaam   = document.getElementById('med-voornaam').value.trim();
  const achternaam = document.getElementById('med-achternaam').value.trim();
  if (!voornaam || !achternaam) { alert('Vul voor- en achternaam in.'); return; }
  const team     = document.getElementById('med-team').value;
  const rol      = document.getElementById('med-rol').value;
  const contract = parseInt(document.getElementById('med-contract').value) || 40;
  const start    = document.getElementById('med-start').value;
  const naam     = `${voornaam} ${achternaam}`;
  const init     = (voornaam[0] + achternaam[0]).toUpperCase();
  const id       = init.toLowerCase() + Date.now();
  const dag      = Math.floor(contract / 5);
  medewerkers.push({ id, init, naam, team, contract, rol, start, schema:{ma:dag,di:dag,wo:dag,do:dag,vr:contract-(dag*4),za:0,zo:0} });
  document.getElementById('med-voornaam').value = '';
  document.getElementById('med-achternaam').value = '';
  closeModal('medewerker');
  renderCurrentView();
}

function deleteRegistratie(id) {
  registraties = registraties.filter(r => r.id !== id);
  renderCurrentView();
}

// ---- CSV EXPORT ----
function downloadCSV(filename, rows) {
  const csv = rows.map(r => r.map(cell => {
    const s = String(cell ?? '').replace(/"/g, '""');
    return (s.includes(',') || s.includes('"') || s.includes('\n')) ? `"${s}"` : s;
  }).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}

function exportCSV(type) {
  const { week, jaar } = state;
  if (type === 'dashboard') {
    const rows = [['Team','Manager','Bruto uren','Verlof','Ziekte','Projectinzet','Uitleen','Inleen','Beschikbaar','%'],
      ...TEAMS.map(t => { const s=calcTeamStats(t.id,week,jaar); const pct=s.bruto>0?(s.beschikbaar/s.bruto*100).toFixed(1):0; return [t.naam,t.manager,s.bruto,s.verlof,s.ziekte,s.project,s.uitleen,s.inleen,s.beschikbaar,pct+'%']; })];
    downloadCSV(`teamoverzicht_w${week}_${jaar}.csv`, rows);
  } else if (type === 'teams') {
    const emps = medewerkers.filter(e => e.team === state.selectedTeam);
    const rows = [['Naam','Team','Contract u/w','Verlof','Ziekte','Project','Uitleen','Inleen','Netto beschikbaar'],
      ...emps.map(e => { const s=calcEmpStats(e,week,jaar); return [e.naam,getTeam(e.team)?.naam||e.team,e.contract,s.verlof,s.ziekte,s.project,s.uitleen,s.inleen,s.beschikbaar]; })];
    downloadCSV(`team_${state.selectedTeam}_w${week}_${jaar}.csv`, rows);
  } else if (type === 'medewerker') {
    const emp  = getEmp(state.selectedEmp);
    const regs = registraties.filter(r => r.empId===state.selectedEmp && r.week===week && r.jaar===jaar);
    const rows = [['Medewerker','Type','Ma','Di','Wo','Do','Vr','Totaal','Omschrijving','Naar/Van team'],
      ...regs.map(r => [emp?.naam,r.type,r.ma,r.di,r.wo,r.do,r.vr,regTotal(r),r.omschr,getTeam(r.naarTeam||r.vanTeam)?.naam||''])];
    downloadCSV(`medewerker_${(emp?.naam||'').replace(/\s/g,'_')}_w${week}_${jaar}.csv`, rows);
  } else if (type === 'beschikbaarheid') {
    let filtered = regsForWeek(week, jaar);
    if (state.filterTeam!=='alle') filtered = filtered.filter(r => { const e=getEmp(r.empId); return e&&e.team===state.filterTeam; });
    if (state.filterType!=='alle') filtered = filtered.filter(r => r.type===state.filterType);
    const rows = [['Medewerker','Team','Type','Week','Ma','Di','Wo','Do','Vr','Totaal','Omschrijving','Naar team'],
      ...filtered.map(r => { const e=getEmp(r.empId); return [e?.naam,getTeam(e?.team)?.naam||'',r.type,`W${r.week} ${r.jaar}`,r.ma,r.di,r.wo,r.do,r.vr,regTotal(r),r.omschr,getTeam(r.naarTeam)?.naam||'']; })];
    downloadCSV(`beschikbaarheid_w${week}_${jaar}.csv`, rows);
  } else if (type === 'rooster') {
    const rows = [['Naam','Team','Contract u/w','Ma','Di','Wo','Do','Vr','Za','Zo','Startdatum'],
      ...medewerkers.map(e => { const s=e.schema; return [e.naam,getTeam(e.team)?.naam||e.team,e.contract,s.ma,s.di,s.wo,s.do,s.vr,s.za,s.zo,e.start]; })];
    downloadCSV(`werkroosters_${jaar}.csv`, rows);
  } else if (type === 'uitleen') {
    const regs = regsForWeek(week, jaar).filter(r => r.type==='uitleen');
    const rows = [['Medewerker','Uitlenend team','Ontvangend team','Week','Uren','Omschrijving'],
      ...regs.map(r => { const e=getEmp(r.empId); return [e?.naam,getTeam(e?.team)?.naam||'',getTeam(r.naarTeam)?.naam||'',`W${r.week} ${r.jaar}`,regTotal(r),r.omschr]; })];
    downloadCSV(`uitleen_w${week}_${jaar}.csv`, rows);
  }
}

// ---- KEYBOARD ----
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
});

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
});
