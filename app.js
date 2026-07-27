import { firebaseConfig, workspaceId } from "./firebase-config.js";

const LOCAL_KEY = "ai-transformation-onboarding-v1";
const firebaseEnabled = !Object.values(firebaseConfig).some(v => String(v).includes("PASTE_"));

const defaultState = {
  tasks: [
    { phase: "Days 1–30", title: "Learn, connect and assess", items: [
      { text: "Meet leaders across Product, Analytics, Economy, Production, Engineering, Community and VIP", done: false },
      { text: "Map key workflows, recurring pain points and manual work", done: false },
      { text: "Assess current AI tools, usage patterns and adoption barriers", done: false },
      { text: "Create the initial AI opportunity backlog", done: false }
    ]},
    { phase: "Days 31–60", title: "Prioritize, validate and design", items: [
      { text: "Deep-dive into the highest-value workflows", done: false },
      { text: "Validate and prioritize the opportunity backlog", done: false },
      { text: "Select and scope the first AI optimization", done: false },
      { text: "Define success metrics and an implementation plan", done: false }
    ]},
    { phase: "Days 61–90", title: "Deliver and build the roadmap", items: [
      { text: "Deliver the first practical AI solution or optimization", done: false },
      { text: "Measure impact and document learnings", done: false },
      { text: "Complete a prioritized six-month backlog", done: false },
      { text: "Draft a high-level roadmap and repeatable operating model", done: false }
    ]}
  ],
  stakeholders: [
    { team: "Product", name: "", role: "", status: "Not started", date: "", notes: "" },
    { team: "Analytics", name: "", role: "", status: "Not started", date: "", notes: "" },
    { team: "Economy", name: "", role: "", status: "Not started", date: "", notes: "" },
    { team: "Production", name: "", role: "", status: "Not started", date: "", notes: "" },
    { team: "Engineering", name: "", role: "", status: "Not started", date: "", notes: "" },
    { team: "Community", name: "", role: "", status: "Not started", date: "", notes: "" },
    { team: "VIP", name: "", role: "", status: "Not started", date: "", notes: "" }
  ],
  opportunities: [],
  quickWins: [],
  checkinGoingWell: "",
  checkinBlocked: "",
  checkinSupport: "",
  roadmapNow: "",
  roadmapNext: "",
  roadmapLater: ""
};

let state = structuredClone(defaultState);
let firebaseApi = null;
let unsubscribe = null;
let saveTimer = null;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function loadLocal() {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) state = { ...structuredClone(defaultState), ...JSON.parse(saved) };
  } catch (error) {
    console.warn("Could not load local data", error);
  }
}

function saveLocal() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  $("#saveStatus").textContent = "Saved locally";
}

async function initFirebase() {
  if (!firebaseEnabled) {
    $("#cloudStatus").textContent = "Local mode";
    $("#loginBtn").classList.add("hidden");
    return;
  }

  const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
  const authModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
  const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");

  const app = appModule.initializeApp(firebaseConfig);
  const auth = authModule.getAuth(app);
  const db = firestoreModule.getFirestore(app);
  const provider = new authModule.GoogleAuthProvider();
  const docRef = firestoreModule.doc(db, "workspaces", workspaceId);

  firebaseApi = { authModule, firestoreModule, auth, db, provider, docRef };

  $("#loginBtn").addEventListener("click", () => authModule.signInWithPopup(auth, provider));
  $("#logoutBtn").addEventListener("click", () => authModule.signOut(auth));

  authModule.onAuthStateChanged(auth, async user => {
    if (unsubscribe) { unsubscribe(); unsubscribe = null; }

    if (!user) {
      $("#cloudStatus").textContent = "Sign in required";
      $("#loginBtn").classList.remove("hidden");
      $("#logoutBtn").classList.add("hidden");
      return;
    }

    $("#loginBtn").classList.add("hidden");
    $("#logoutBtn").classList.remove("hidden");
    $("#cloudStatus").textContent = `Connected as ${user.email}`;

    unsubscribe = firestoreModule.onSnapshot(docRef, snapshot => {
      if (snapshot.exists()) {
        state = { ...structuredClone(defaultState), ...snapshot.data() };
        localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
        renderAll();
      } else {
        saveCloudNow();
      }
    }, error => {
      console.error(error);
      $("#cloudStatus").textContent = "Cloud access error";
    });
  });
}

function scheduleSave() {
  saveLocal();
  if (!firebaseApi?.auth.currentUser) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCloudNow, 500);
}

async function saveCloudNow() {
  if (!firebaseApi?.auth.currentUser) return;
  $("#saveStatus").textContent = "Saving to cloud…";
  try {
    await firebaseApi.firestoreModule.setDoc(
      firebaseApi.docRef,
      { ...state, updatedAt: firebaseApi.firestoreModule.serverTimestamp() },
      { merge: true }
    );
    $("#saveStatus").textContent = "Saved to Firebase";
  } catch (error) {
    console.error(error);
    $("#saveStatus").textContent = "Cloud save failed";
  }
}

function renderPlan() {
  const container = $("#planContainer");
  container.innerHTML = "";
  state.tasks.forEach((phase, phaseIndex) => {
    const article = document.createElement("article");
    article.className = "phase";
    article.innerHTML = `<p class="eyebrow">${phase.phase}</p><h3>${phase.title}</h3>`;
    phase.items.forEach((item, itemIndex) => {
      const label = document.createElement("label");
      label.className = "task";
      label.innerHTML = `<input type="checkbox" ${item.done ? "checked" : ""}><span>${item.text}</span>`;
      label.querySelector("input").addEventListener("change", event => {
        state.tasks[phaseIndex].items[itemIndex].done = event.target.checked;
        updateProgress();
        scheduleSave();
      });
      article.appendChild(label);
    });
    container.appendChild(article);
  });
}

function inputCell(value, onChange, type = "text") {
  const input = document.createElement("input");
  input.type = type;
  input.value = value || "";
  input.addEventListener("input", e => { onChange(e.target.value); scheduleSave(); });
  const td = document.createElement("td");
  td.appendChild(input);
  return td;
}

function selectCell(value, options, onChange) {
  const select = document.createElement("select");
  options.forEach(option => {
    const el = document.createElement("option");
    el.value = option; el.textContent = option; el.selected = option === value;
    select.appendChild(el);
  });
  select.addEventListener("change", e => { onChange(e.target.value); scheduleSave(); });
  const td = document.createElement("td");
  td.appendChild(select);
  return td;
}

function deleteCell(collection, index, renderFn) {
  const td = document.createElement("td");
  const button = document.createElement("button");
  button.className = "icon-button";
  button.textContent = "×";
  button.addEventListener("click", () => {
    state[collection].splice(index, 1);
    renderFn();
    updateProgress();
    scheduleSave();
  });
  td.appendChild(button);
  return td;
}

function renderStakeholders() {
  const body = $("#stakeholdersBody");
  body.innerHTML = "";
  state.stakeholders.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.append(
      inputCell(row.team, v => row.team = v),
      inputCell(row.name, v => row.name = v),
      inputCell(row.role, v => row.role = v),
      selectCell(row.status, ["Not started", "Scheduled", "Completed"], v => { row.status = v; updateProgress(); }),
      inputCell(row.date, v => row.date = v, "date"),
      inputCell(row.notes, v => row.notes = v),
      deleteCell("stakeholders", i, renderStakeholders)
    );
    body.appendChild(tr);
  });
}

function renderOpportunities() {
  const body = $("#opportunitiesBody");
  body.innerHTML = "";
  state.opportunities.forEach((row, i) => {
    const tr = document.createElement("tr");
    tr.append(
      inputCell(row.title, v => row.title = v),
      inputCell(row.team, v => row.team = v),
      selectCell(row.impact, ["Low", "Medium", "High"], v => row.impact = v),
      selectCell(row.effort, ["Low", "Medium", "High"], v => row.effort = v),
      selectCell(row.priority, ["Low", "Medium", "High"], v => row.priority = v),
      selectCell(row.status, ["Discovery", "Validated", "Planned", "In progress", "Done"], v => { row.status = v; updateProgress(); }),
      inputCell(row.owner, v => row.owner = v),
      deleteCell("opportunities", i, renderOpportunities)
    );
    body.appendChild(tr);
  });
}

function renderQuickWins() {
  const container = $("#quickWinsContainer");
  container.innerHTML = "";
  state.quickWins.forEach((row, i) => {
    const div = document.createElement("div");
    div.className = "quick-win";
    div.innerHTML = `
      <input placeholder="Initiative" value="${escapeHtml(row.title || "")}">
      <select>
        ${["Planned","In progress","Done"].map(x => `<option ${x === row.status ? "selected" : ""}>${x}</option>`).join("")}
      </select>
      <button class="icon-button">×</button>`;
    const [title, status, del] = div.children;
    title.addEventListener("input", e => { row.title = e.target.value; scheduleSave(); });
    status.addEventListener("change", e => { row.status = e.target.value; updateProgress(); scheduleSave(); });
    del.addEventListener("click", () => { state.quickWins.splice(i, 1); renderQuickWins(); updateProgress(); scheduleSave(); });
    container.appendChild(div);
  });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
}

function bindStaticFields() {
  $$("[data-field]").forEach(field => {
    const key = field.dataset.field;
    field.value = state[key] || "";
    field.oninput = event => { state[key] = event.target.value; scheduleSave(); };
  });
}

function updateProgress() {
  const taskItems = state.tasks.flatMap(p => p.items);
  const completedTasks = taskItems.filter(x => x.done).length;
  const completedStakeholders = state.stakeholders.filter(x => x.status === "Completed").length;
  const doneWins = state.quickWins.filter(x => x.status === "Done").length;

  const total = taskItems.length + Math.max(state.stakeholders.length, 1) + Math.max(state.quickWins.length, 1);
  const done = completedTasks + completedStakeholders + doneWins;
  const percent = Math.min(100, Math.round((done / total) * 100));

  $("#overallProgress").textContent = `${percent}%`;
  $("#overallProgressBar").style.width = `${percent}%`;
}

function updateDayCounter() {
  const start = new Date("2026-08-18T00:00:00");
  const today = new Date();
  today.setHours(0,0,0,0);
  const day = Math.floor((today - start) / 86400000) + 1;
  $("#dayCounter").textContent = day < 1 ? "Before start" : day <= 90 ? `Day ${day} of 90` : "90-day period complete";
}

function addHandlers() {
  $$("[data-add]").forEach(button => {
    button.addEventListener("click", () => {
      const type = button.dataset.add;
      if (type === "stakeholders") {
        state.stakeholders.push({ team: "", name: "", role: "", status: "Not started", date: "", notes: "" });
        renderStakeholders();
      }
      if (type === "opportunities") {
        state.opportunities.push({ title: "", team: "", impact: "Medium", effort: "Medium", priority: "Medium", status: "Discovery", owner: "" });
        renderOpportunities();
      }
      if (type === "quickWins") {
        state.quickWins.push({ title: "", status: "Planned" });
        renderQuickWins();
      }
      updateProgress();
      scheduleSave();
    });
  });
}

function renderAll() {
  renderPlan();
  renderStakeholders();
  renderOpportunities();
  renderQuickWins();
  bindStaticFields();
  updateProgress();
  updateDayCounter();
}

loadLocal();
renderAll();
addHandlers();
initFirebase().catch(error => {
  console.error(error);
  $("#cloudStatus").textContent = "Firebase setup error";
});
