// ============================================================
// Rooster & Beschikbaarheid — navigatie & interactiviteit
// ============================================================

const breadcrumbs = {
  dashboard: 'Dashboard',
  teams: 'Teams › Alpha',
  medewerkers: 'Medewerkers › Jan de Vries',
  beschikbaarheid: 'Beschikbaarheid',
  rooster: 'Werkroosters',
  uitleen: 'Uitleen & Inleen',
};

function showView(name) {
  // hide all views
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  // show target
  const target = document.getElementById('view-' + name);
  if (target) target.classList.add('active');

  // update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navLink = document.querySelector(`.nav-item[onclick*="${name}"]`);
  if (navLink) navLink.classList.add('active');

  // update breadcrumb
  document.getElementById('breadcrumb').textContent = breadcrumbs[name] || name;
}

function selectTeam(teamId) {
  // In a real app this would load team data; here it's static
  document.getElementById('breadcrumb').textContent = 'Teams › ' + teamId.charAt(0).toUpperCase() + teamId.slice(1);
}

function selectMedewerker(id) {
  document.getElementById('breadcrumb').textContent = 'Medewerkers › Jan de Vries';
}

// Week navigation (display only)
let currentWeek = 9;
const weekDates = {
  8: 'Week 8 \u2014 17 feb \u2013 21 feb 2026',
  9: 'Week 9 \u2014 24 feb \u2013 28 feb 2026',
  10: 'Week 10 \u2014 3 mrt \u2013 7 mrt 2026',
  11: 'Week 11 \u2014 10 mrt \u2013 14 mrt 2026',
};

function changeWeek(delta) {
  currentWeek = Math.max(1, Math.min(52, currentWeek + delta));
  const label = weekDates[currentWeek] || `Week ${currentWeek} \u2014 2026`;
  document.getElementById('week-label').innerHTML = label;
}

// Modal helpers
function showModal(name) {
  const el = document.getElementById('modal-' + name);
  if (el) el.classList.add('open');
}

function closeModal(name) {
  const el = document.getElementById('modal-' + name);
  if (el) el.classList.remove('open');
}

// Show/hide uitleen team selector based on type
function toggleUitleenTeam(el) {
  const typeSelect = document.getElementById('type-select');
  const row = document.getElementById('uitleen-team-row');
  if (typeSelect && row) {
    row.style.display = typeSelect.value === 'uitleen' ? 'grid' : 'none';
  }
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open'));
  }
});
