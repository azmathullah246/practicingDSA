document.addEventListener("DOMContentLoaded", function() {
  const menuBtn = document.getElementById("menuButton");
  const sidebar = document.getElementById("sidebar");

  if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", function(e) {
      e.stopPropagation();
      sidebar.classList.toggle("open");
    });
  }

  // Close sidebar when clicking outside
  document.addEventListener("click", function(e) {
    if (sidebar && sidebar.classList.contains("open")) {
      if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
        sidebar.classList.remove("open");
      }
    }
  });
});
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

let toastTimer;

// ---- Toast ----
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
}

// ---- Data Toast Clicks ----
$$("[data-toast]").forEach((element) => {
  element.addEventListener("click", () => {
    showToast(element.dataset.toast);
  });
});

// ---- Mark All Alerts ----
$("#reviewAll")?.addEventListener("click", () => {
  $$(".alert-item").forEach((item) => {
    item.style.opacity = "0.45";
    item.style.pointerEvents = "none";
  });
  const count = $(".alert-count");
  if (count) count.textContent = "0 open";
  showToast("All alerts marked as reviewed");
});

// ---- Search ----
const searchInput = $("#searchInput");
if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    const searchable = $$(".project-row, .activity-item, .milestone-item, .alert-item");
    let visible = 0;
    searchable.forEach((item) => {
      const searchText = (item.dataset.search || item.textContent).toLowerCase();
      const matches = !query || searchText.includes(query);
      item.style.display = matches ? "" : "none";
      if (matches) visible++;
    });
    const emptySearch = $("#emptySearch");
    if (emptySearch) {
      emptySearch.classList.toggle("show", query.length > 0 && visible === 0);
    }
  });
}

// ====================================================================
//  PROJECT DATA â SAMPLE PROJECTS WITH STATUSES
// ====================================================================

const projectData = {
  projects: [
    { id: 1, name: "Metro Rail Expansion", sector: "Transport & Logistics", location: "Delhi", status: "at-risk", progress: 65, budget: 4500, spent: 4950, delay: 24 },
    { id: 2, name: "National Highway Upgrade", sector: "Road Transport", location: "Maharashtra", status: "delayed", progress: 45, budget: 5000, spent: 6100, delay: 45 },
    { id: 3, name: "Water Supply Project", sector: "Water & Sanitation", location: "Gujarat", status: "on-track", progress: 75, budget: 2000, spent: 1850, delay: 0 },
    { id: 4, name: "Bridge Development", sector: "Transport & Logistics", location: "Bihar", status: "on-track", progress: 55, budget: 3000, spent: 2900, delay: 0 },
    { id: 5, name: "Eastern Dedicated Freight Corridor", sector: "Railway", location: "Uttar Pradesh", status: "at-risk", progress: 80, budget: 12000, spent: 13800, delay: 18 },
    { id: 6, name: "Smart City Phase 1", sector: "Smart Cities", location: "Karnataka", status: "completed", progress: 100, budget: 8000, spent: 7800, delay: 0 },
    { id: 7, name: "Rural Road Connectivity", sector: "Road Transport", location: "Madhya Pradesh", status: "paused", progress: 30, budget: 1500, spent: 600, delay: 60 }
  ],
  tasks: [
    { id: 1, title: "Submit revised cost estimate", project: "Metro Rail Expansion", status: "Due today", type: "at-risk" },
    { id: 2, title: "Review contractor delay report", project: "National Highway Upgrade", status: "Overdue", type: "delayed-status" },
    { id: 3, title: "Verify physical progress update", project: "Water Supply Project", status: "In progress", type: "on-track" }
  ],
  milestones: [
    { id: 1, title: "Metro Rail â Civil Works Phase II", date: "18 Sep 2026", status: "At Risk" },
    { id: 2, title: "National Highway â Land Acquisition", date: "25 Sep 2026", status: "Delayed" },
    { id: 3, title: "Water Supply â Pipeline Testing", date: "30 Sep 2026", status: "On Track" }
  ]
};

// ---- Compute metrics dynamically ----
function computeMetrics() {
  const projects = projectData.projects;
  const total = projects.length;
  const onTrack = projects.filter(p => p.status === "on-track").length;
  const atRisk = projects.filter(p => p.status === "at-risk").length;
  const delayed = projects.filter(p => p.status === "delayed").length;
  const completed = projects.filter(p => p.status === "completed").length;
  const paused = projects.filter(p => p.status === "paused").length;

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const totalDelay = projects.reduce((sum, p) => sum + p.delay, 0);
  const avgProgress = total ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / total) : 0;

  return { total, onTrack, atRisk, delayed, completed, paused, totalBudget, totalSpent, totalDelay, avgProgress };
}

// ====================================================================
//  AI ASSISTANT
// ====================================================================

function callSentinelAI(userQuestion) {
  const aiResponse = document.getElementById("aiResponse");
  if (!aiResponse) return;
  aiResponse.innerHTML = '<span class="loading">ð Analyzing portfolio & risk models...</span>';
  setTimeout(() => {
    const q = userQuestion.toLowerCase();
    let analysis = "";
    if (q.includes("cost") || q.includes("overrun") || q.includes("budget")) {
      analysis = "Portfolio cost escalation analysis indicates an aggregate revised cost of â¹42.78 Lakh Crore against an original estimate of â¹37.13 Lakh Crore. Primary drivers include land acquisition bottlenecks and material price inflation in National Highway and Metro sectors. Immediate financial audit recommended for projects with >15% variance.";
    } else if (q.includes("delay") || q.includes("time") || q.includes("schedule")) {
      analysis = "Schedule drift analysis highlights 98 active projects experiencing critical time overruns. The National Highway Upgrade (Maharashtra) and Metro Rail Expansion (Delhi) account for the highest schedule slippage due to clearance delays. Recommended milestone acceleration protocols.";
    } else if (q.includes("intervention") || q.includes("risk") || q.includes("action") || q.includes("attention")) {
      analysis = "Proactive intervention required for 3 high-priority projects: National Highway Upgrade (High Risk), Metro Rail Expansion (Watch), and Eastern Dedicated Freight Corridor. Escalating milestone reviews this week will mitigate further slippage.";
    } else {
      const metrics = computeMetrics();
      analysis = `Analyzed ${metrics.total} active monitored projects. Found ${metrics.atRisk + metrics.delayed} projects requiring administrative oversight. Predictive risk scoring suggests reinforcing contractor accountability and monthly API synchronization with executing ministries.`;
    }
    aiResponse.innerHTML = `<strong>ð Sentinel AI Intelligence Report:</strong><p>${analysis}</p>`;
  }, 600);
}

// ====================================================================
//  UPDATE ALL PANELS WITH REAL DATA
// ====================================================================

function updateAllPanels() {
  const metrics = computeMetrics();

  // --- 1. Dashboard Summary Cards ---
  const totalEl = document.getElementById("totalProjectsCount");
  if (totalEl) totalEl.textContent = metrics.total;
  const onTrackEl = document.getElementById("onTrackCount");
  if (onTrackEl) onTrackEl.textContent = metrics.onTrack;
  const atRiskEl = document.getElementById("atRiskCount");
  if (atRiskEl) atRiskEl.textContent = metrics.atRisk;
  const delayedEl = document.getElementById("delayedCount");
  if (delayedEl) delayedEl.textContent = metrics.delayed;

  const util = metrics.totalBudget > 0 ? Math.round((metrics.totalSpent / metrics.totalBudget) * 100) : 0;
  const budgetEl = document.getElementById("budgetUtil");
  if (budgetEl) budgetEl.textContent = util + "%";

  // --- 2. Donut & Legend ---
  const total = metrics.total;
  const onTrack = metrics.onTrack;
  const atRisk = metrics.atRisk;
  const delayed = metrics.delayed;
  const completed = metrics.completed;
  const paused = metrics.paused;

  const pOn = total ? Math.round((onTrack / total) * 100) : 0;
  const pAt = total ? Math.round((atRisk / total) * 100) : 0;
  const pDel = total ? Math.round((delayed / total) * 100) : 0;
  const pComplete = total ? Math.round((completed / total) * 100) : 0;
  const pPaused = total ? Math.round((paused / total) * 100) : 0;
  const pNot = Math.max(0, 100 - pOn - pAt - pDel - pComplete - pPaused);

  const legendOn = document.getElementById("legend-ontrack");
  if (legendOn) legendOn.textContent = `${pOn}% (${onTrack})`;
  const legendAt = document.getElementById("legend-atrisk");
  if (legendAt) legendAt.textContent = `${pAt}% (${atRisk})`;
  const legendDel = document.getElementById("legend-delayed");
  if (legendDel) legendDel.textContent = `${pDel}% (${delayed})`;
  const legendNot = document.getElementById("legend-notstarted");
  if (legendNot) legendNot.textContent = `${pNot}% (0)`;

  const donut = document.querySelector('.donut-chart');
  if (donut) {
    const other = 100 - pOn - pAt - pDel;
    const c1 = pOn;
    const c2 = c1 + pAt;
    const c3 = c2 + pDel;
    donut.style.background = `conic-gradient(var(--green) 0 ${c1}%, var(--yellow) ${c1}% ${c2}%, var(--red) ${c2}% ${c3}%, #cbd1dc ${c3}% 100%)`;
  }
  const donutTotal = document.getElementById("donut-total");
  if (donutTotal) donutTotal.textContent = total;

  // --- 3. Projects Panel Summary ---
  const projTotal = document.getElementById("projTotal");
  if (projTotal) projTotal.textContent = metrics.total;
  const projHigh = document.getElementById("projHighRisk");
  if (projHigh) projHigh.textContent = metrics.atRisk + metrics.delayed;
  const projDel = document.getElementById("projDelayed");
  if (projDel) projDel.textContent = metrics.delayed;
  const projComplete = document.getElementById("projCompleted");
  if (projComplete) projComplete.textContent = metrics.completed;
  const projPaused = document.getElementById("projPaused");
  if (projPaused) projPaused.textContent = metrics.paused;

  // --- 4. Milestones Panel ---
  const msTotal = projectData.milestones.length;
  const msCompleted = projectData.milestones.filter(m => m.status === "On Track" || m.status === "Completed").length; // approximate
  const msDue = projectData.milestones.filter(m => new Date(m.date) > new Date()).length; // due this month simplified
  const msOverdue = projectData.milestones.filter(m => new Date(m.date) < new Date() && m.status !== "Completed").length;

  const msTotalEl = document.getElementById("msTotal");
  if (msTotalEl) msTotalEl.textContent = msTotal;
  const msCompletedEl = document.getElementById("msCompleted");
  if (msCompletedEl) msCompletedEl.textContent = msCompleted;
  const msDueEl = document.getElementById("msDue");
  if (msDueEl) msDueEl.textContent = msDue;
  const msOverdueEl = document.getElementById("msOverdue");
  if (msOverdueEl) msOverdueEl.textContent = msOverdue;

  // Render priority milestones list
  const milestoneContainer = document.getElementById("milestoneListContainer");
  if (milestoneContainer) {
    milestoneContainer.innerHTML = '';
    projectData.milestones.forEach(m => {
      const row = document.createElement('div');
      row.className = 'data-row';
      const statusClass = m.status.toLowerCase().replace(' ', '-');
      row.innerHTML = `<strong>${m.title}</strong><span>Due ${m.date}</span><span class="status ${statusClass}">${m.status}</span>`;
      milestoneContainer.appendChild(row);
    });
  }

  // --- 5. Tasks Panel ---
  const tasks = projectData.tasks;
  const taskCount = tasks.length;
  const taskCountEl = document.getElementById("taskCount");
  if (taskCountEl) taskCountEl.textContent = `${taskCount} pending`;

  const taskContainer = document.getElementById("taskListContainer");
  if (taskContainer) {
    taskContainer.innerHTML = '';
    tasks.forEach(t => {
      const row = document.createElement('div');
      row.className = 'data-row';
      const statusClass = t.type || 'on-track';
      row.innerHTML = `<strong>${t.title}</strong><span>${t.project}</span><span class="status ${statusClass}">${t.status}</span>`;
      taskContainer.appendChild(row);
    });
  }

  // --- 6. Budget Panel ---
  const approved = metrics.totalBudget;
  const expenditure = metrics.totalSpent;
  const overrun = Math.max(0, expenditure - approved);
  const budgetApproved = document.getElementById("budgetApproved");
  if (budgetApproved) budgetApproved.textContent = `â¹${approved.toFixed(2)} Cr`;
  const budgetExp = document.getElementById("budgetExpenditure");
  if (budgetExp) budgetExp.textContent = `â¹${expenditure.toFixed(2)} Cr`;
  const budgetOver = document.getElementById("budgetOverrun");
  if (budgetOver) budgetOver.textContent = `â¹${overrun.toFixed(2)} Cr`;

  // Budget watchlist â projects with cost variance > 10%
  const watchlist = document.getElementById("budgetWatchlist");
  if (watchlist) {
    watchlist.innerHTML = '';
    const highVariance = projectData.projects.filter(p => ((p.spent / p.budget - 1) * 100) > 10);
    if (highVariance.length === 0) {
      watchlist.innerHTML = '<div class="data-row"><span style="color:var(--muted);">No projects above threshold</span></div>';
    } else {
      highVariance.forEach(p => {
        const variance = ((p.spent / p.budget - 1) * 100).toFixed(1);
        const row = document.createElement('div');
        row.className = 'data-row';
        row.innerHTML = `<strong>${p.name}</strong><span>Cost variance: ${variance}%</span><span class="status delayed-status">High</span>`;
        watchlist.appendChild(row);
      });
    }
  }

  // --- 7. Alerts Panel ---
  const alertContainer = document.getElementById("alertListContainer");
  if (alertContainer) {
    alertContainer.innerHTML = '';
    // Generate alerts dynamically from projects
    const alerts = [];
    const delayedProjects = projectData.projects.filter(p => p.status === 'delayed');
    if (delayedProjects.length > 0) {
      alerts.push({ level: 'high', text: `${delayedProjects.length} project${delayedProjects.length > 1 ? 's are' : ' is'} delayed`, detail: 'Action required' });
    }
    const riskProjects = projectData.projects.filter(p => p.status === 'at-risk');
    if (riskProjects.length > 0) {
      alerts.push({ level: 'medium', text: `${riskProjects.length} project${riskProjects.length > 1 ? 's are' : ' is'} at risk`, detail: 'Immediate attention needed' });
    }
    const overdueMilestones = projectData.milestones.filter(m => m.status === 'Delayed' || m.status === 'At Risk');
    if (overdueMilestones.length > 0) {
      alerts.push({ level: 'medium', text: `${overdueMilestones.length} milestone${overdueMilestones.length > 1 ? 's are' : ' is'} overdue`, detail: 'Check and update' });
    }
    // Add a default if no alerts
    if (alerts.length === 0) {
      alerts.push({ level: 'low', text: 'All projects are on track', detail: 'No action needed' });
    }
    alerts.forEach(a => {
      const row = document.createElement('div');
      row.className = 'data-row';
      let statusClass = 'on-track';
      if (a.level === 'high') statusClass = 'delayed-status';
      else if (a.level === 'medium') statusClass = 'at-risk';
      else statusClass = 'on-track';
      row.innerHTML = `<strong>${a.text}</strong><span>${a.detail}</span><span class="status ${statusClass}">${a.level}</span>`;
      alertContainer.appendChild(row);
    });
  }

  // --- 8. AI Insights â Recommended interventions (already static in HTML, but we can update if needed) ---
  // We'll leave it static for now.
}

// ====================================================================
//  CRUD: RENDER PROJECT LIST, ADD/REMOVE
// ====================================================================

function renderProjectList() {
  const container = document.getElementById("projectListContainer");
  if (!container) return;
  // Keep the heading, clear rest
  let heading = container.querySelector('h2');
  if (!heading) {
    heading = document.createElement('h2');
    heading.textContent = 'All Projects';
    container.prepend(heading);
  }
  // Remove old rows (keep heading)
  container.querySelectorAll('.project-row').forEach(r => r.remove());

  if (projectData.projects.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = '<p>No projects found. Click "Add project" to begin monitoring.</p>';
    container.appendChild(empty);
    return;
  }

  projectData.projects.forEach(p => {
    const risk = calculateRiskLevel(p);
    const row = document.createElement('div');
    row.className = 'project-row';
    row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-top:1px solid var(--line);';
    row.innerHTML = `
      <div style="flex:1; cursor:pointer;" data-id="${p.id}">
        <strong>${p.name}</strong>
        <p style="margin-top:4px;color:var(--muted);font-size:12px;">${p.sector} Â· ${p.location} | Progress: ${p.progress}% | â¹${p.spent}Cr/â¹${p.budget}Cr</p>
        <div class="progress-bar"><div class="progress-fill" style="width:${p.progress}%"></div></div>
      </div>
      <div style="display:flex;align-items:center;gap:12px;">
        <span class="status ${p.status}">${p.status.replace('-',' ')}</span>
        <span class="risk-badge ${risk}">${risk}</span>
        <button class="delete-proj" data-id="${p.id}" style="background:#ef5c66;color:#fff;border:0;border-radius:6px;padding:4px 8px;cursor:pointer;font-size:12px;">Remove</button>
      </div>
    `;
    row.querySelector('[data-id]').addEventListener('click', () => showProjectDetails(p));
    row.querySelector('.delete-proj').addEventListener('click', (e) => {
      e.stopPropagation();
      removeProject(p.id);
    });
    container.appendChild(row);
  });
}

function calculateRiskLevel(project) {
  const costOverrun = ((project.spent / project.budget) - 1) * 100;
  if (costOverrun > 25 || project.delay > 30) return "critical";
  if (costOverrun > 10 || project.delay > 15) return "high";
  if (costOverrun > 0 || project.delay > 0) return "medium";
  return "low";
}

function showProjectDetails(project) {
  const costOverrun = ((project.spent / project.budget) - 1) * 100;
  const html = `
    <strong>Project:</strong> ${project.name}<br>
    <strong>Sector:</strong> ${project.sector} (${project.location})<br>
    <strong>Status:</strong> ${project.status.toUpperCase()}<br>
    <strong>Physical Progress:</strong> ${project.progress}%<br>
    <strong>Approved Budget:</strong> â¹${project.budget} Cr<br>
    <strong>Expenditure:</strong> â¹${project.spent} Cr (${costOverrun >= 0 ? '+' : ''}${costOverrun.toFixed(1)}% variance)<br>
    <strong>Schedule Delay:</strong> ${project.delay} days<br>
    <hr style="margin:12px 0;border:0;border-top:1px solid #d8e0e8;">
    <span style="color:#4f7df3;font-weight:600;">â¨ AI Recommendation:</span> Continuous monitoring active. Ensure milestone verification by end of month.
  `;
  openModal("Project Intelligence Dossier", html);
}

function removeProject(id) {
  projectData.projects = projectData.projects.filter(p => p.id !== id);
  renderProjectList();
  updateAllPanels();
  updateCharts();
  showToast("ðï¸ Project removed from monitoring portfolio");
}

// ====================================================================
//  MODAL HELPERS
// ====================================================================

const modal = document.getElementById("appModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");

function openModal(title, htmlContent) {
  if (modalTitle) modalTitle.textContent = title;
  if (modalMessage) modalMessage.innerHTML = htmlContent;
  if (modal) { modal.classList.add("open"); modal.setAttribute("aria-hidden", "false"); }
}

function closeModal() {
  if (modal) { modal.classList.remove("open"); modal.setAttribute("aria-hidden", "true"); }
}

document.getElementById("closeModal")?.addEventListener("click", closeModal);
modal?.addEventListener("click", e => { if (e.target === modal) closeModal(); });

// ====================================================================
//  SETUP ADD MODALS (CRUD) + RECEIPT BUTTON
// ====================================================================

function setupAddModals() {
  // Add Project
  const addProjBtn = document.getElementById("addProjectButton");
  if (addProjBtn) {
    addProjBtn.addEventListener("click", () => {
      openModal("Add New Infrastructure Project", `
        <form id="addProjectForm" style="display:flex;flex-direction:column;gap:12px;margin-top:10px;">
          <div><label>Project Name</label><input type="text" id="newProjName" required placeholder="e.g. Coastal Expressway"></div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><label>Sector</label><input type="text" id="newProjSector" required placeholder="Transport & Logistics"></div>
            <div><label>Location</label><input type="text" id="newProjLoc" required placeholder="Tamil Nadu"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><label>Budget (â¹ Cr)</label><input type="number" id="newProjBudget" required placeholder="4500"></div>
            <div><label>Spent (â¹ Cr)</label><input type="number" id="newProjSpent" required placeholder="1200"></div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
            <div><label>Status</label><select id="newProjStatus"><option value="on-track">On Track</option><option value="at-risk">At Risk</option><option value="delayed">Delayed</option><option value="completed">Completed</option><option value="paused">Paused</option></select></div>
            <div><label>Progress (%)</label><input type="number" id="newProjProgress" required min="0" max="100" placeholder="25"></div>
          </div>
          <button type="submit" style="margin-top:10px;padding:12px;background:var(--blue);color:#fff;border:0;border-radius:8px;font-weight:600;cursor:pointer;">Save Project</button>
        </form>
      `);
      document.getElementById("addProjectForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const newProj = {
          id: Date.now(),
          name: document.getElementById("newProjName").value,
          sector: document.getElementById("newProjSector").value,
          location: document.getElementById("newProjLoc").value,
          status: document.getElementById("newProjStatus").value,
          progress: parseInt(document.getElementById("newProjProgress").value) || 0,
          budget: parseFloat(document.getElementById("newProjBudget").value) || 1000,
          spent: parseFloat(document.getElementById("newProjSpent").value) || 0,
          delay: document.getElementById("newProjStatus").value === "delayed" ? 30 : 0
        };
        projectData.projects.unshift(newProj);
        renderProjectList();
        updateAllPanels();
        updateCharts();
        closeModal();
        showToast("â New project registered successfully");
      });
    });
  }

  // Add Task
  const addTaskBtn = document.getElementById("addTaskButton");
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", () => {
      openModal("Add New Task", `
        <form id="addTaskForm" style="display:flex;flex-direction:column;gap:12px;margin-top:10px;">
          <div><label>Task Description</label><input type="text" id="newTaskTitle" required placeholder="e.g. Verify environmental clearance"></div>
          <div><label>Associated Project</label><input type="text" id="newTaskProject" required placeholder="Metro Rail Expansion"></div>
          <button type="submit" style="margin-top:10px;padding:12px;background:var(--blue);color:#fff;border:0;border-radius:8px;font-weight:600;cursor:pointer;">Create Task</button>
        </form>
      `);
      document.getElementById("addTaskForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("newTaskTitle").value;
        const proj = document.getElementById("newTaskProject").value;
        const tasksContainer = document.getElementById("taskListContainer");
        if (tasksContainer) {
          const row = document.createElement('div');
          row.className = 'data-row';
          row.innerHTML = `<strong>${title}</strong><span>${proj}</span><span class="status on-track">New</span>`;
          tasksContainer.appendChild(row);
          // update count
          const count = document.getElementById("taskCount");
          if (count) count.textContent = `${document.querySelectorAll('#taskListContainer .data-row').length} pending`;
        }
        closeModal();
        showToast("â Task added successfully");
      });
    });
  }

  // Add Milestone
  const addMilestoneBtn = document.getElementById("addMilestoneButton");
  if (addMilestoneBtn) {
    addMilestoneBtn.addEventListener("click", () => {
      openModal("Add Milestone", `
        <form id="addMilestoneForm" style="display:flex;flex-direction:column;gap:12px;margin-top:10px;">
          <div><label>Milestone Title</label><input type="text" id="newMsTitle" required placeholder="Tunnel Boring Completion"></div>
          <div><label>Target Date</label><input type="text" id="newMsDate" required placeholder="30 Oct 2026"></div>
          <button type="submit" style="margin-top:10px;padding:12px;background:var(--blue);color:#fff;border:0;border-radius:8px;font-weight:600;cursor:pointer;">Add Milestone</button>
        </form>
      `);
      document.getElementById("addMilestoneForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("newMsTitle").value;
        const date = document.getElementById("newMsDate").value;
        const msContainer = document.getElementById("milestoneListContainer");
        if (msContainer) {
          const row = document.createElement('div');
          row.className = 'data-row';
          row.innerHTML = `<strong>${title}</strong><span>Due ${date}</span><span class="status on-track">On Track</span>`;
          msContainer.appendChild(row);
          // update counts
          const total = document.getElementById("msTotal");
          if (total) total.textContent = msContainer.querySelectorAll('.data-row').length;
        }
        closeModal();
        showToast("â Milestone added successfully");
      });
    });
  }

  // Generate Report
  document.getElementById("generateReportButton")?.addEventListener("click", () => {
    const output = document.getElementById("reportOutput");
    if (output) {
      output.innerHTML = `<strong>ð Executive Summary Generated:</strong><p>Portfolio Health: Stable with localized risks in 7.2% of monitored assets. Aggregate expenditure stands at â¹20.36 Lakh Crore.</p>`;
      output.classList.add("visible");
      showToast("ð Report successfully compiled");
    }
  });

  // ----- Performance Receipt Button -----
  const receiptBtn = document.getElementById("generateReceiptButton");
  if (receiptBtn) {
    receiptBtn.addEventListener("click", generateReceipt);
  }
}

// ====================================================================
//  PERFORMANCE RECEIPT GENERATOR
// ====================================================================

function generateReceipt() {
  const metrics = computeMetrics();
  const projects = projectData.projects;
  let receiptHTML = `
    <style>
      .receipt { font-family: 'Courier New', monospace; padding: 20px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
      .receipt h2 { text-align: center; color: #1e293b; border-bottom: 2px dashed #4f7df3; padding-bottom: 10px; }
      .receipt table { width: 100%; border-collapse: collapse; margin: 16px 0; }
      .receipt td { padding: 6px 8px; border-bottom: 1px solid #e2e8f0; }
      .receipt .label { font-weight: 600; color: #475569; }
      .receipt .value { text-align: right; font-weight: 500; }
      .receipt .highlight { background: #eef2ff; }
      .receipt .total-row { font-weight: 700; border-top: 2px solid #4f7df3; }
    </style>
    <div class="receipt">
      <h2>ð Portfolio Performance Receipt</h2>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      <table>
        <tr><td class="label">Total Projects</td><td class="value">${metrics.total}</td></tr>
        <tr><td class="label">On Track</td><td class="value">${metrics.onTrack}</td></tr>
        <tr><td class="label">At Risk</td><td class="value">${metrics.atRisk}</td></tr>
        <tr><td class="label">Delayed</td><td class="value">${metrics.delayed}</td></tr>
        <tr><td class="label">Completed</td><td class="value">${metrics.completed}</td></tr>
        <tr><td class="label">Paused</td><td class="value">${metrics.paused}</td></tr>
        <tr class="highlight"><td class="label">Total Approved Budget</td><td class="value">â¹${metrics.totalBudget.toFixed(2)} Cr</td></tr>
        <tr class="highlight"><td class="label">Total Expenditure</td><td class="value">â¹${metrics.totalSpent.toFixed(2)} Cr</td></tr>
        <tr class="highlight"><td class="label">Budget Utilization</td><td class="value">${metrics.totalBudget > 0 ? Math.round((metrics.totalSpent/metrics.totalBudget)*100) : 0}%</td></tr>
        <tr><td class="label">Total Delay (days)</td><td class="value">${metrics.totalDelay}</td></tr>
        <tr><td class="label">Average Progress</td><td class="value">${metrics.avgProgress}%</td></tr>
        <tr class="total-row"><td class="label">Overall Health</td><td class="value">${metrics.atRisk + metrics.delayed > metrics.onTrack ? 'â ï¸ Needs Attention' : 'â Stable'}</td></tr>
      </table>
      <div style="margin-top: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
        <span>Sentinel Â· Infrastructure Monitoring</span>
      </div>
    </div>
  `;
  openModal("ð Performance Receipt", receiptHTML);
}

// ====================================================================
//  NAVIGATION
// ====================================================================

const navItems = document.querySelectorAll(".nav-item");
const panels = document.querySelectorAll(".panel");

function showPanel(panelId) {
  panels.forEach(p => p.classList.remove("active-panel"));
  navItems.forEach(link => link.classList.toggle("active", link.dataset.panel === panelId));
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add("active-panel");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    showPanel(item.dataset.panel);
  });
});

// ---- Widget click navigation ----
document.querySelectorAll("[data-panel]").forEach(el => {
  el.addEventListener("click", function(e) {
    if (e.target.closest('button')) return;
    showPanel(this.dataset.panel);
  });
});

document.querySelectorAll("[data-open-panel]").forEach(el => {
  el.addEventListener("click", () => showPanel(el.dataset.openPanel));
});

// ====================================================================
//  CHARTS
// ====================================================================

let chartInstance1 = null;
let chartInstance2 = null;

function updateCharts() {
  const statusCtx = document.getElementById('statusChart');
  if (statusCtx) {
    if (chartInstance1) chartInstance1.destroy();
    const onTrack = projectData.projects.filter(p => p.status === "on-track").length;
    const atRisk = projectData.projects.filter(p => p.status === "at-risk").length;
    const delayed = projectData.projects.filter(p => p.status === "delayed").length;
    const completed = projectData.projects.filter(p => p.status === "completed").length;
    const paused = projectData.projects.filter(p => p.status === "paused").length;
    chartInstance1 = new Chart(statusCtx.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['On Track', 'At Risk', 'Delayed', 'Completed', 'Paused'],
        datasets: [{ data: [onTrack || 1, atRisk || 1, delayed || 1, completed || 1, paused || 1], backgroundColor: ['#34c471', '#f5b342', '#e8666e', '#4f7df3', '#94a3b8'], borderColor: '#fff', borderWidth: 2 }]
      },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }
  const costCtx = document.getElementById('costChart');
  if (costCtx) {
    if (chartInstance2) chartInstance2.destroy();
    chartInstance2 = new Chart(costCtx.getContext('2d'), {
      type: 'bar',
      data: {
        labels: projectData.projects.map(p => p.name.split(' ')[0]),
        datasets: [{
          label: 'Cost Overrun %',
          data: projectData.projects.map(p => ((p.spent / p.budget - 1) * 100).toFixed(1)),
          backgroundColor: projectData.projects.map(p => {
            const o = (p.spent / p.budget - 1) * 100;
            return o > 20 ? '#e8666e' : o > 10 ? '#f5b342' : '#34c471';
          }),
          borderRadius: 5
        }]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { callback: v => v + '%' } } } }
    });
  }
}

// ====================================================================
//  OTHER FEATURES
// ====================================================================

// Notification popover
document.getElementById("notificationButton")?.addEventListener("click", (e) => {
  e.stopPropagation();
  document.getElementById("notificationPopover")?.classList.toggle("show");
});
document.addEventListener("click", (e) => {
  if (!e.target.closest("#notificationPopover") && !e.target.closest("#notificationButton")) {
    document.getElementById("notificationPopover")?.classList.remove("show");
  }
});

document.getElementById("calendarButton")?.addEventListener("click", () => showToast("Calendar opened"));
document.getElementById("helpButton")?.addEventListener("click", () => showToast("Help center opened"));
document.getElementById("dismissBanner")?.addEventListener("click", () => document.getElementById("statusBanner")?.remove());

// Budget period selector
const periodSelect = document.getElementById("periodSelect");
if (periodSelect) {
  const periods = {
    month: { total: "â¹ 24.50 Cr", spent: "â¹ 16.60 Cr", remaining: "â¹ 7.90 Cr", width: "68%" },
    quarter: { total: "â¹ 68.20 Cr", spent: "â¹ 41.58 Cr", remaining: "â¹ 26.62 Cr", width: "61%" },
    year: { total: "â¹ 112.00 Cr", spent: "â¹ 73.92 Cr", remaining: "â¹ 38.08 Cr", width: "66%" }
  };
  periodSelect.addEventListener("change", (e) => {
    const v = periods[e.target.value];
    if (v) {
      document.getElementById("totalBudget").textContent = v.total;
      document.getElementById("spentBudget").textContent = v.spent;
      document.getElementById("remainingBudget").textContent = v.remaining;
      document.getElementById("budgetBar").style.width = v.width;
      showToast(`Budget updated for ${e.target.options[e.target.selectedIndex].text.toLowerCase()}`);
    }
  });
}

// AI Question
document.getElementById("askAiButton")?.addEventListener("click", () => {
  const q = document.getElementById("aiQuestion")?.value.trim() || "";
  callSentinelAI(q || "Which projects need immediate intervention?");
});
document.getElementById("aiQuestion")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("askAiButton")?.click();
});

// Report buttons
document.querySelectorAll("[data-report]").forEach(btn => {
  btn.addEventListener("click", () => {
    const output = document.getElementById("reportOutput");
    if (output) {
      output.innerHTML = `<strong>ð ${btn.dataset.report}</strong><p>Report generated successfully.</p>`;
      output.classList.add("visible");
      showToast(`ð ${btn.dataset.report} opened`);
    }
  });
});

// ====================================================================
//  INITIALIZATION
// ====================================================================

document.addEventListener("DOMContentLoaded", () => {
  updateAllPanels();
  renderProjectList();
  setupAddModals();
  updateCharts();
  showToast("ð¡ï¸ Sentinel initialized successfully");
});