
import { firebaseConfig, workspaceId } from "./firebase-config.js";

const LOCAL_KEY = "mary-fisher-first-90-days-v5-final";
const START_DATE = new Date("2026-08-11T00:00:00");
const firebaseEnabled = !Object.values(firebaseConfig).some(v => String(v).includes("PASTE_"));

const meetingPurposes = [
  "Introduction",
  "Business context",
  "Workflow understanding",
  "Tool walkthrough",
  "KPI review",
  "Process mapping",
  "AI opportunity discovery",
  "Roadmap alignment",
  "Follow-up"
];

const defaultState = {
  activeTab: "overview",
  activeWeek: 0,
  nextCheckinDate: "",
  nextCheckinTopics: "",
  shrSubsetStatus: "Recurring",
  maryReflection30: "",
  yulaAssessment30: "",
  maryReflection60: "",
  yulaAssessment60: "",
  maryReflection90: "",
  yulaAssessment90: "",
  roadmapNow: "",
  roadmapNext: "",
  roadmapLater: "",
  barcelonaNotes: "",
  maryNotes: "",
  yulaNotes: "",

  weeklyTasks: [
    { text: "Confirm access requests and remove any blockers", done: false },
    { text: "Review the coming week's onboarding priorities with Yula", done: false },
    { text: "Prepare questions for the next stakeholder and game-team sessions", done: false },
    { text: "Capture key observations and open questions", done: false }
  ],

  weeks30: [
    {
      title: "Week 1 · Foundation and enablement",
      dates: "Aug 11–17",
      focus: "Become operational, understand the basic organizational landscape, and prepare the stakeholder and learning plan.",
      outcomes: [
        "All required access requests submitted and tracked",
        "Basic understanding of the studio, portfolio, business units and leadership structure",
        "Introductory meetings from Week 2 onward scheduled",
        "Weekly meetings established with Yula and Shronger, Director Gen AI"
      ],
      actions: [
        { text: "Secure access to ChatGPT Enterprise and Claude", done: false },
        { text: "Secure access to Jira, Confluence, GitHub, Slack and shared drives", done: false },
        { text: "Secure access to Looker and relevant business systems", done: false },
        { text: "Identify the relevant dashboards and internal systems for the first games", done: false },
        { text: "Review the studio structure, portfolio, business units and leadership structure", done: false },
        { text: "Schedule stakeholder introductions beginning in Week 2", done: false },
        { text: "Set a weekly 1:1 with Yula", done: false },
        { text: "Set a weekly sync with Shronger, Director Gen AI", done: false }
      ],
      notes: "",
      marySatisfaction: "",
      yulaSatisfaction: "",
      weekReflection: ""
    },
    {
      title: "Week 2 · Initial immersion and guided exploration",
      dates: "Aug 18–24",
      focus: "Start meeting selected stakeholders, learn how the first game teams operate, and explore the available tools and dashboards.",
      outcomes: [
        "Initial stakeholder conversations completed",
        "First game-team routines and decision flows observed",
        "Core dashboards and business systems explored",
        "Initial questions and learning gaps documented"
      ],
      actions: [
        { text: "Join selected game-team daily or recurring syncs as an observer", done: false },
        { text: "Meet the first prioritized stakeholders added to the People tracker", done: false },
        { text: "Explore Looker dashboards for the first games", done: false },
        { text: "Review the main operational and business systems used by those games", done: false },
        { text: "Learn the basic business metrics used by each relevant function", done: false },
        { text: "Document unclear processes, terminology and areas requiring follow-up", done: false }
      ],
      notes: "",
      marySatisfaction: "",
      yulaSatisfaction: "",
      weekReflection: ""
    },
    {
      title: "Week 3 · Broader immersion and Barcelona preparation",
      dates: "Aug 25–31",
      focus: "Broaden the learning across teams, continue stakeholder meetings, and build the Barcelona agenda together with Yula.",
      outcomes: [
        "Broader exposure to game and functional routines",
        "A clearer map of tools, dashboards and business measures",
        "Barcelona meeting objectives and schedule prepared",
        "Early patterns and exploration themes documented without premature prioritization"
      ],
      actions: [
        { text: "Continue selected game-team dailies and functional syncs", done: false },
        { text: "Continue prioritized stakeholder introductions", done: false },
        { text: "Map which tools and dashboards are used by each team or game", done: false },
        { text: "Document the basic business metrics relevant to Product, Analytics, Economy, Production, Community and VIP", done: false },
        { text: "Build the Barcelona agenda and meeting schedule with Yula", done: false },
        { text: "Prepare context and questions for Barcelona introductions", done: false }
      ],
      notes: "",
      marySatisfaction: "",
      yulaSatisfaction: "",
      weekReflection: ""
    },
    {
      title: "Week 4 · Barcelona immersion and first synthesis",
      dates: "Sep 1–9",
      focus: "Use the Barcelona visit for high-value introductions, then synthesize the first month of learning into a structured baseline.",
      outcomes: [
        "Barcelona introductions completed and follow-ups captured",
        "First-month organizational and workflow understanding summarized",
        "Initial list of manual-effort, human-error and capacity-gap themes created",
        "Initial AI opportunity backlog ready for validation during Days 31–60"
      ],
      actions: [
        { text: "Complete the Barcelona meeting agenda and capture key takeaways", done: false },
        { text: "Follow up on introductions and open questions from the visit", done: false },
        { text: "Summarize the organization, workflows, tools, dashboards and business metrics learned during the first month", done: false },
        { text: "Start mapping high-manual-effort processes", done: false },
        { text: "Start mapping processes exposed to frequent human error", done: false },
        { text: "Start mapping areas where limited capacity could be supported by automation", done: false },
        { text: "Create the initial structured AI opportunity backlog", done: false }
      ],
      notes: ""
    }
  ],

  deliverables30: [
    "Access and tool-readiness tracker",
    "Organizational, portfolio and leadership overview",
    "Stakeholder map and meeting plan",
    "Initial map of dashboards, systems and business metrics",
    "First structured AI opportunity backlog",
    "Barcelona agenda, notes and follow-up actions"
  ],

  success30: [
    { text: "Mary has all critical access required to work effectively", mary: false, yula: false },
    { text: "Mary understands the studio structure, portfolio and core business units at a practical level", mary: false, yula: false },
    { text: "Mary has begun building relationships with the priority stakeholders", mary: false, yula: false },
    { text: "Mary understands the basic metrics, dashboards and systems used by the first game teams", mary: false, yula: false },
    { text: "An initial opportunity backlog and discovery baseline exist", mary: false, yula: false }
  ],

  objectives60: [
    { text: "Create a consistent way to map AI-tool usage and workflow maturity across the portfolio", done: false },
    { text: "Establish recurring routines with the most relevant stakeholders", done: false },
    { text: "Map manual, time-consuming work that could be automated", done: false },
    { text: "Map processes with high human-error exposure or repeated rework", done: false },
    { text: "Map capacity gaps where automation could support teams", done: false },
    { text: "Validate and prioritize the opportunity backlog", done: false },
    { text: "Select and scope the first small-to-medium optimization", done: false }
  ],

  deliverables60: [
    "Portfolio-level tool-usage and AI-maturity mapping approach",
    "Established stakeholder routines and working cadence",
    "Validated opportunity backlog",
    "Impact-versus-effort prioritization",
    "Defined first solution scope, owner, dependencies and success measures",
    "Initial delivery and adoption plan"
  ],

  success60: [
    { text: "A repeatable portfolio discovery and mapping approach is in use", mary: false, yula: false },
    { text: "Recurring routines exist with the right stakeholders", mary: false, yula: false },
    { text: "The highest-value manual effort, human-error and capacity-gap themes are documented", mary: false, yula: false },
    { text: "The opportunity backlog is validated and prioritized", mary: false, yula: false },
    { text: "The first optimization is selected, scoped and ready for delivery", mary: false, yula: false }
  ],

  objectives90: [
    { text: "Deliver the first practical AI optimization or validated pilot", done: false },
    { text: "Measure initial business value, user feedback and adoption", done: false },
    { text: "Document lessons learned and adjust the delivery approach", done: false },
    { text: "Complete a prioritized six-month backlog", done: false },
    { text: "Build and align a high-level roadmap covering delivery and organizational adoption", done: false },
    { text: "Define a repeatable intake, prioritization, delivery and knowledge-sharing process", done: false }
  ],

  deliverables90: [
    "First delivered AI optimization or validated pilot",
    "Impact, feedback and lessons-learned summary",
    "Prioritized six-month backlog",
    "High-level roadmap for solutions, adoption and culture",
    "Draft operating model for future AI initiatives",
    "Knowledge-sharing and enablement cadence"
  ],

  success90: [
    { text: "A practical AI optimization or validated pilot has been delivered", mary: false, yula: false },
    { text: "Initial value, feedback and adoption have been measured", mary: false, yula: false },
    { text: "The six-month backlog is prioritized and credible", mary: false, yula: false },
    { text: "The high-level roadmap is aligned with the relevant leaders", mary: false, yula: false },
    { text: "A repeatable working model for continued AI transformation is defined", mary: false, yula: false }
  ],

  people: [
    {
      name: "Shronger",
      role: "Director, Gen AI",
      studio: "Central / Gen AI",
      purpose: "Roadmap alignment",
      status: "Recurring",
      followUp: "Weekly",
      takeaways: ""
    }
  ],

  barcelonaObjectives: [
    { text: "Build relationships with priority Barcelona-based stakeholders", done: false },
    { text: "Understand their business context, responsibilities and current ways of working", done: false },
    { text: "Gather context that will improve portfolio-level discovery after the visit", done: false }
  ],
  barcelonaPrep: [
    { text: "Agree the priority people and groups with Yula", done: false },
    { text: "Define the purpose and expected outcome of each meeting", done: false },
    { text: "Prepare context, questions and relevant background", done: false },
    { text: "Leave time for synthesis and follow-up planning", done: false }
  ],
  barcelonaMeetings: [],

  opportunities: []
};

let state = structuredClone(defaultState);
let firebaseApi = null;
let unsubscribe = null;
let saveTimer = null;

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function deepMerge(base, saved) {
  if (Array.isArray(base)) return Array.isArray(saved) ? saved : base;
  if (base && typeof base === "object") {
    const result = { ...base };
    Object.keys(saved || {}).forEach(key => {
      result[key] = key in base ? deepMerge(base[key], saved[key]) : saved[key];
    });
    return result;
  }
  return saved === undefined ? base : saved;
}

function loadLocal() {
  try {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) state = deepMerge(structuredClone(defaultState), JSON.parse(saved));
  } catch (error) {
    console.warn("Could not load local data", error);
  }
}

function saveLocal() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  $("#saveStatus").textContent = "Saved locally";
}

function getOnboardingDay() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.floor((today - START_DATE) / 86400000) + 1;
}

function getCurrentWeekIndex() {
  const day = getOnboardingDay();
  if (day < 1) return 0;
  if (day <= 7) return 0;
  if (day <= 14) return 1;
  if (day <= 21) return 2;
  if (day <= 30) return 3;
  return 3;
}

function syncActiveWeekToDate() {
  const day = getOnboardingDay();
  if (day >= 1 && day <= 30) {
    const currentWeek = getCurrentWeekIndex();
    if (state.lastAutoWeek !== currentWeek) {
      state.activeWeek = currentWeek;
      state.lastAutoWeek = currentWeek;
      saveLocal();
    }
  }
}

function scheduleSave() {
  saveLocal();
  if (!firebaseApi?.auth.currentUser) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCloudNow, 500);
}

async function initFirebase() {
  if (!firebaseEnabled) return;

  const appModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js");
  const authModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js");
  const firestoreModule = await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");

  const app = appModule.initializeApp(firebaseConfig);
  const auth = authModule.getAuth(app);
  const db = firestoreModule.getFirestore(app);
  const provider = new authModule.GoogleAuthProvider();
  const docRef = firestoreModule.doc(db, "workspaces", workspaceId);

  firebaseApi = { authModule, firestoreModule, auth, db, provider, docRef };

  $("#signInBtn").classList.remove("hidden");
  $("#signInBtn").onclick = () => authModule.signInWithPopup(auth, provider);
  $("#signOutBtn").onclick = () => authModule.signOut(auth);

  authModule.onAuthStateChanged(auth, user => {
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    if (!user) {
      $("#signInBtn").classList.remove("hidden");
      $("#signOutBtn").classList.add("hidden");
      $("#saveStatus").textContent = "Sign in for shared saving";
      return;
    }

    $("#signInBtn").classList.add("hidden");
    $("#signOutBtn").classList.remove("hidden");
    $("#saveStatus").textContent = `Connected: ${user.email}`;

    unsubscribe = firestoreModule.onSnapshot(docRef, snapshot => {
      if (snapshot.exists()) {
        state = deepMerge(structuredClone(defaultState), snapshot.data());
        localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
        renderAll();
      } else {
        saveCloudNow();
      }
    }, error => {
      console.error(error);
      $("#saveStatus").textContent = "Cloud access error";
    });
  });
}

async function saveCloudNow() {
  if (!firebaseApi?.auth.currentUser) return;
  $("#saveStatus").textContent = "Saving to Firebase…";
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

function bindTabs() {
  $$(".tab").forEach(button => {
    button.onclick = () => {
      state.activeTab = button.dataset.tab;
      renderTabs();
      scheduleSave();
    };
  });

  $$(".week-tab").forEach(button => {
    button.onclick = () => {
      state.activeWeek = Number(button.dataset.week);
      renderWeekDetail();
      scheduleSave();
    };
  });
}

function renderTabs() {
  $$(".tab").forEach(button => button.classList.toggle("active", button.dataset.tab === state.activeTab));
  $$(".panel").forEach(panel => panel.classList.toggle("active", panel.id === state.activeTab));
}

function bindStaticFields() {
  $$("[data-field]").forEach(field => {
    const key = field.dataset.field;
    field.value = state[key] || "";
    field.oninput = event => {
      state[key] = event.target.value;
      scheduleSave();
    };
  });
}

function renderWeeklyTasks() {
  const root = $("#weeklyTasks");
  root.innerHTML = "";

  const currentWeekIndex = getCurrentWeekIndex();
  const currentWeek = state.weeks30[currentWeekIndex];
  const title = $("#overviewWeekTitle");
  if (title) title.textContent = `Week ${currentWeekIndex + 1} key activities · ${currentWeek.dates}`;

  const linkedTasks = [];

  // Incomplete work from prior weeks is surfaced first and stays linked to its original task.
  for (let weekIndex = 0; weekIndex < currentWeekIndex; weekIndex += 1) {
    state.weeks30[weekIndex].actions.forEach((action, actionIndex) => {
      if (!action.done) {
        linkedTasks.push({
          kind: "carryover",
          weekIndex,
          actionIndex,
          label: `Carried over from Week ${weekIndex + 1}`,
          text: action.text,
          done: action.done
        });
      }
    });
  }

  currentWeek.actions.forEach((action, actionIndex) => {
    linkedTasks.push({
      kind: "current",
      weekIndex: currentWeekIndex,
      actionIndex,
      label: "Current week",
      text: action.text,
      done: action.done
    });
  });

  linkedTasks.forEach(task => {
    const row = document.createElement("label");
    row.className = `weekly-task linked-week-task ${task.kind}`;
    row.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <span><small>${task.label}</small>${task.text}</span>
    `;
    row.querySelector("input").onchange = event => {
      state.weeks30[task.weekIndex].actions[task.actionIndex].done = event.target.checked;
      renderWeeklyTasks();
      renderWeekDetail();
      updateSummary();
      scheduleSave();
    };
    root.appendChild(row);
  });

  state.weeklyTasks.forEach((task, index) => {
    const row = document.createElement("div");
    row.className = "weekly-task custom-week-task";
    row.innerHTML = `
      <input type="checkbox" ${task.done ? "checked" : ""}>
      <input type="text" value="${escapeHtml(task.text)}" aria-label="Extra weekly task">
      <button title="Delete">×</button>
    `;

    const [checkbox, input, button] = row.children;
    checkbox.onchange = event => {
      task.done = event.target.checked;
      updateSummary();
      scheduleSave();
    };
    input.oninput = event => {
      task.text = event.target.value;
      scheduleSave();
    };
    button.onclick = () => {
      state.weeklyTasks.splice(index, 1);
      renderWeeklyTasks();
      updateSummary();
      scheduleSave();
    };
    root.appendChild(row);
  });
}

function renderWeekDetail() {
  $$(".week-tab").forEach(button =>
    button.classList.toggle("active", Number(button.dataset.week) === state.activeWeek)
  );

  const week = state.weeks30[state.activeWeek];
  const root = $("#weekDetail");
  const carryovers = [];

  for (let weekIndex = 0; weekIndex < state.activeWeek; weekIndex += 1) {
    state.weeks30[weekIndex].actions.forEach((action, actionIndex) => {
      if (!action.done) {
        carryovers.push({
          weekIndex,
          actionIndex,
          source: `Week ${weekIndex + 1}`,
          text: action.text
        });
      }
    });
  }

  const carryoverHtml = carryovers.length ? `
    <div class="carryover-box">
      <div class="section-label">Automatically carried over</div>
      <p class="carryover-note">Incomplete items from earlier weeks remain here until completed.</p>
      ${carryovers.map(item => `
        <label class="action-row carryover-row">
          <input type="checkbox" data-carry-week="${item.weekIndex}" data-carry-action="${item.actionIndex}">
          <span><strong>${item.source}:</strong> ${item.text}</span>
        </label>
      `).join("")}
    </div>
  ` : "";

  root.innerHTML = `
    <article class="week-main">
      <p class="eyebrow">${week.dates}</p>
      <h2>${week.title}</h2>
      <p>${week.focus}</p>
      <div class="section-label">Expected weekly outcomes</div>
      <ul class="display-list">${week.outcomes.map(item => `<li>${item}</li>`).join("")}</ul>
      <div class="section-label">Week notes</div>
      <textarea id="weekNotes">${escapeHtml(week.notes)}</textarea>
    </article>

    <article class="week-actions">
      ${carryoverHtml}
      <p class="eyebrow">Week ${state.activeWeek + 1} activities</p>
      ${week.actions.map((action, index) => `
        <label class="action-row">
          <input type="checkbox" data-week-action="${index}" ${action.done ? "checked" : ""}>
          <span>${action.text}</span>
        </label>
      `).join("")}
    </article>

    <article class="week-satisfaction">
      <div>
        <p class="eyebrow">How did the week go?</p>
        <h3>End-of-week satisfaction</h3>
      </div>
      <div class="satisfaction-fields">
        <div>
          <label>Mary</label>
          <select id="maryWeekSatisfaction">
            <option value="">Select</option>
            <option value="1" ${week.marySatisfaction === "1" ? "selected" : ""}>1 · Very difficult</option>
            <option value="2" ${week.marySatisfaction === "2" ? "selected" : ""}>2</option>
            <option value="3" ${week.marySatisfaction === "3" ? "selected" : ""}>3 · Mixed</option>
            <option value="4" ${week.marySatisfaction === "4" ? "selected" : ""}>4</option>
            <option value="5" ${week.marySatisfaction === "5" ? "selected" : ""}>5 · Excellent</option>
          </select>
        </div>
        <div>
          <label>Yula</label>
          <select id="yulaWeekSatisfaction">
            <option value="">Select</option>
            <option value="1" ${week.yulaSatisfaction === "1" ? "selected" : ""}>1 · Needs attention</option>
            <option value="2" ${week.yulaSatisfaction === "2" ? "selected" : ""}>2</option>
            <option value="3" ${week.yulaSatisfaction === "3" ? "selected" : ""}>3 · On track</option>
            <option value="4" ${week.yulaSatisfaction === "4" ? "selected" : ""}>4</option>
            <option value="5" ${week.yulaSatisfaction === "5" ? "selected" : ""}>5 · Excellent</option>
          </select>
        </div>
        <div class="week-reflection-field">
          <label>What worked, what was challenging, and what should change next week?</label>
          <textarea id="weekReflection">${escapeHtml(week.weekReflection || "")}</textarea>
        </div>
      </div>
    </article>
  `;

  root.querySelector("#weekNotes").oninput = event => {
    week.notes = event.target.value;
    scheduleSave();
  };

  root.querySelector("#maryWeekSatisfaction").onchange = event => {
    week.marySatisfaction = event.target.value;
    scheduleSave();
  };
  root.querySelector("#yulaWeekSatisfaction").onchange = event => {
    week.yulaSatisfaction = event.target.value;
    scheduleSave();
  };
  root.querySelector("#weekReflection").oninput = event => {
    week.weekReflection = event.target.value;
    scheduleSave();
  };

  root.querySelectorAll("[data-week-action]").forEach(checkbox => {
    checkbox.onchange = event => {
      week.actions[Number(event.target.dataset.weekAction)].done = event.target.checked;
      updateSummary();
      scheduleSave();
    };
  });

  root.querySelectorAll("[data-carry-week]").forEach(checkbox => {
    checkbox.onchange = event => {
      const sourceWeek = Number(event.target.dataset.carryWeek);
      const sourceAction = Number(event.target.dataset.carryAction);
      state.weeks30[sourceWeek].actions[sourceAction].done = event.target.checked;
      renderWeekDetail();
      updateSummary();
      scheduleSave();
    };
  });
}

function renderDisplayList(rootSelector, values) {
  $(rootSelector).innerHTML = values.map(value => `<li>${value}</li>`).join("");
}

function renderCheckList(rootSelector, values) {
  const root = $(rootSelector);
  root.innerHTML = "";

  values.forEach((item, index) => {
    const row = document.createElement("label");
    row.className = "action-row";
    row.innerHTML = `
      <input type="checkbox" ${item.done ? "checked" : ""}>
      <span>${item.text}</span>
    `;
    row.querySelector("input").onchange = event => {
      values[index].done = event.target.checked;
      updateSummary();
      scheduleSave();
    };
    root.appendChild(row);
  });
}

function renderSuccessReview(rootSelector, collectionName) {
  const root = $(rootSelector);
  root.innerHTML = "";

  state[collectionName].forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "success-row";
    row.innerHTML = `
      <div class="criteria">${item.text}</div>
      <label class="success-check">Mary <input type="checkbox" data-person="mary" ${item.mary ? "checked" : ""}></label>
      <label class="success-check">Yula <input type="checkbox" data-person="yula" ${item.yula ? "checked" : ""}></label>
    `;

    row.querySelectorAll("input").forEach(input => {
      input.onchange = event => {
        state[collectionName][index][event.target.dataset.person] = event.target.checked;
        updateSummary();
        scheduleSave();
      };
    });

    root.appendChild(row);
  });
}

function createInputCell(value, onChange, type = "text") {
  const td = document.createElement("td");
  const input = document.createElement("input");
  input.type = type;
  input.value = value || "";
  input.oninput = event => {
    onChange(event.target.value);
    scheduleSave();
  };
  td.appendChild(input);
  return td;
}

function createTextAreaCell(value, onChange) {
  const td = document.createElement("td");
  const textarea = document.createElement("textarea");
  textarea.value = value || "";
  textarea.oninput = event => {
    onChange(event.target.value);
    scheduleSave();
  };
  td.appendChild(textarea);
  return td;
}

function createSelectCell(value, options, onChange) {
  const td = document.createElement("td");
  const select = document.createElement("select");

  options.forEach(option => {
    const element = document.createElement("option");
    element.value = option;
    element.textContent = option;
    element.selected = option === value;
    select.appendChild(element);
  });

  select.onchange = event => {
    onChange(event.target.value);
    updateSummary();
    scheduleSave();
  };

  td.appendChild(select);
  return td;
}

function createDeleteCell(collectionName, index, renderFunction) {
  const td = document.createElement("td");
  const button = document.createElement("button");
  button.className = "icon-button";
  button.textContent = "×";
  button.title = "Delete";
  button.onclick = () => {
    state[collectionName].splice(index, 1);
    renderFunction();
    updateSummary();
    scheduleSave();
  };
  td.appendChild(button);
  return td;
}

function renderPeople() {
  const body = $("#peopleBody");
  body.innerHTML = "";

  state.people.forEach((person, index) => {
    const tr = document.createElement("tr");
    tr.append(
      createInputCell(person.name, value => person.name = value),
      createInputCell(person.role, value => person.role = value),
      createInputCell(person.studio, value => person.studio = value),
      createSelectCell(person.purpose, meetingPurposes, value => person.purpose = value),
      createSelectCell(person.status, ["Not scheduled", "Scheduled", "Completed", "Recurring"], value => person.status = value),
      createSelectCell(person.followUp, ["No", "Recommended", "Required", "Weekly", "Monthly"], value => person.followUp = value),
      createTextAreaCell(person.takeaways, value => person.takeaways = value),
      createDeleteCell("people", index, renderPeople)
    );
    body.appendChild(tr);
  });
}

function renderEditableList(rootSelector, collectionName) {
  const root = $(rootSelector);
  root.innerHTML = "";

  state[collectionName].forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "editable-item";
    row.innerHTML = `
      <input type="checkbox" ${item.done ? "checked" : ""}>
      <input type="text" value="${escapeHtml(item.text)}">
      <button class="icon-button">×</button>
    `;

    const [checkbox, input, button] = row.children;

    checkbox.onchange = event => {
      item.done = event.target.checked;
      updateSummary();
      scheduleSave();
    };

    input.oninput = event => {
      item.text = event.target.value;
      scheduleSave();
    };

    button.onclick = () => {
      state[collectionName].splice(index, 1);
      renderEditableList(rootSelector, collectionName);
      updateSummary();
      scheduleSave();
    };

    root.appendChild(row);
  });
}

function renderBarcelonaMeetings() {
  const body = $("#barcelonaBody");
  body.innerHTML = "";

  state.barcelonaMeetings.forEach((meeting, index) => {
    const tr = document.createElement("tr");
    tr.append(
      createInputCell(meeting.date, value => meeting.date = value, "date"),
      createInputCell(meeting.time, value => meeting.time = value, "time"),
      createInputCell(meeting.person, value => meeting.person = value),
      createInputCell(meeting.objective, value => meeting.objective = value),
      createInputCell(meeting.location, value => meeting.location = value),
      createTextAreaCell(meeting.preparation, value => meeting.preparation = value),
      createDeleteCell("barcelonaMeetings", index, renderBarcelonaMeetings)
    );
    body.appendChild(tr);
  });
}

function renderOpportunities() {
  const body = $("#opportunitiesBody");
  body.innerHTML = "";

  state.opportunities.forEach((opportunity, index) => {
    const tr = document.createElement("tr");
    tr.append(
      createInputCell(opportunity.title, value => opportunity.title = value),
      createInputCell(opportunity.team, value => opportunity.team = value),
      createSelectCell(
        opportunity.problemType,
        ["Manual effort", "Human error", "Capacity gap", "Knowledge access", "Other"],
        value => opportunity.problemType = value
      ),
      createSelectCell(
        opportunity.estimatedTime,
        ["< 1 week", "1–2 weeks", "3–4 weeks", "1–2 months", "3+ months"],
        value => opportunity.estimatedTime = value
      ),
      createSelectCell(
        opportunity.scope,
        ["Single workflow", "Single team", "Multiple teams", "Studio-wide", "Portfolio-wide"],
        value => opportunity.scope = value
      ),
      createSelectCell(
        opportunity.initiativeType,
        ["Quick Win", "Project"],
        value => opportunity.initiativeType = value
      ),
      createSelectCell(opportunity.impact, ["Low", "Medium", "High"], value => opportunity.impact = value),
      createSelectCell(opportunity.priority, ["Low", "Medium", "High"], value => opportunity.priority = value),
      createSelectCell(
        opportunity.status,
        ["Discovery", "Validating", "Planned", "In progress", "Delivered"],
        value => opportunity.status = value
      ),
      createTextAreaCell(opportunity.notes, value => opportunity.notes = value),
      createDeleteCell("opportunities", index, renderOpportunities)
    );
    body.appendChild(tr);
  });
}


function bindAddButtons() {
  $("#addWeeklyTaskBtn").onclick = () => {
    state.weeklyTasks.push({ text: "", done: false });
    renderWeeklyTasks();
    scheduleSave();
  };

  $("#addPersonBtn").onclick = () => {
    state.people.push({
      name: "",
      role: "",
      studio: "",
      purpose: "Introduction",
      status: "Not scheduled",
      followUp: "No",
      takeaways: ""
    });
    renderPeople();
    scheduleSave();
  };

  $("#addBarcelonaMeetingBtn").onclick = () => {
    state.barcelonaMeetings.push({
      date: "2026-09-06",
      time: "",
      person: "",
      objective: "",
      location: "",
      preparation: ""
    });
    renderBarcelonaMeetings();
    scheduleSave();
  };

  $("#addOpportunityBtn").onclick = () => {
    state.opportunities.push({
      title: "",
      team: "",
      problemType: "Manual effort",
      estimatedTime: "1–2 weeks",
      scope: "Single workflow",
      initiativeType: "Quick Win",
      impact: "Medium",
      priority: "Medium",
      status: "Discovery",
      notes: ""
    });
    renderOpportunities();
    updateSummary();
    scheduleSave();
  };
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function weightedInitiativeProgress(status) {
  return ({
    "Discovery": 0,
    "Validating": 0.25,
    "Planned": 0.4,
    "In progress": 0.7,
    "Delivered": 1
  })[status] || 0;
}

function setCategoryProgress(name, percentage) {
  const value = clampPercent(percentage);
  $(`#${name}Progress`).textContent = `${value}%`;
  $(`#${name}ProgressBar`).style.width = `${value}%`;
}

function updateSummary() {
  const allWeekActions = state.weeks30.flatMap(week => week.actions);
  const completed = items => items.filter(item => item.done).length;
  const ratio = (done, total) => total ? (done / total) * 100 : 0;

  // Learning: fixed onboarding activities related to access, organization,
  // business metrics, tools, dashboards and systems. Free-form rows never add progress.
  const learningPattern = /access|tool|dashboard|system|studio structure|portfolio|business unit|leadership|business metric|looker|review the studio|map which tools/i;
  const learningItems = allWeekActions.filter(item => learningPattern.test(item.text));
  const learningPercent = ratio(completed(learningItems), learningItems.length);

  // Relationships: fixed meeting/sync activities plus real completed or recurring
  // people records. Merely typing a name or scheduling a meeting adds no completion.
  const relationshipPattern = /meet|meeting|stakeholder|daily|dailies|sync|introduction|barcelona agenda|follow up on introductions/i;
  const fixedRelationshipItems = allWeekActions.filter(item => relationshipPattern.test(item.text));
  const namedPeople = state.people.filter(person => String(person.name || "").trim());
  const peopleCompleted = namedPeople.filter(person => ["Completed", "Recurring"].includes(person.status)).length;
  const fixedRelationshipDone = completed(fixedRelationshipItems);
  const relationshipDenominator = fixedRelationshipItems.length + namedPeople.length;
  const relationshipPercent = ratio(fixedRelationshipDone + peopleCompleted, relationshipDenominator);

  // Discovery: fixed mapping and prioritization activities plus initiatives that
  // have advanced beyond the initial Discovery state. Adding a blank row gives 0.
  const discoveryPattern = /document|map|mapping|manual|human error|capacity|opportunity|backlog|explore|questions|patterns|synthesi|priorit/i;
  const discoveryWeekItems = allWeekActions.filter(item => discoveryPattern.test(item.text));
  const discoveryFixedItems = [...discoveryWeekItems, ...state.objectives60];
  const initiativeRows = state.opportunities.filter(item => String(item.title || "").trim());
  const initiativeDiscoveryScore = initiativeRows.reduce((sum, item) => sum + weightedInitiativeProgress(item.status), 0);
  const discoveryDenominator = discoveryFixedItems.length + initiativeRows.length;
  const discoveryPercent = ratio(completed(discoveryFixedItems) + initiativeDiscoveryScore, discoveryDenominator);

  // Delivery: 90-day execution activities and actual initiative advancement.
  // In-progress work receives partial credit; Delivered receives full credit.
  const initiativeDeliveryScore = initiativeRows.reduce((sum, item) => {
    if (item.status === "In progress") return sum + 0.5;
    if (item.status === "Delivered") return sum + 1;
    return sum;
  }, 0);
  const deliveryDenominator = state.objectives90.length + initiativeRows.length;
  const deliveryPercent = ratio(completed(state.objectives90) + initiativeDeliveryScore, deliveryDenominator);

  setCategoryProgress("learning", learningPercent);
  setCategoryProgress("relationships", relationshipPercent);
  setCategoryProgress("discovery", discoveryPercent);
  setCategoryProgress("delivery", deliveryPercent);

  // Overall progress is the balanced average of the four meaningful categories.
  // It no longer changes merely because a person or initiative row was created.
  const percentage = clampPercent((learningPercent + relationshipPercent + discoveryPercent + deliveryPercent) / 4);
  const peopleMet = state.people.filter(person => ["Completed", "Recurring"].includes(person.status)).length;
  const deliveredOpportunities = state.opportunities.filter(item => item.status === "Delivered").length;

  $("#overallProgress").textContent = `${percentage}%`;
  $("#overallProgressBar").style.width = `${percentage}%`;
  $("#peopleMetCount").textContent = peopleMet;
  $("#opportunityCount").textContent = state.opportunities.filter(item => String(item.title || "").trim()).length;
  $("#initiativesDelivered").textContent = deliveredOpportunities;

  const day = getOnboardingDay();

  let phase = "Pre-onboarding";
  if (day >= 1 && day <= 30) phase = "30 Days";
  else if (day <= 60 && day > 30) phase = "60 Days";
  else if (day <= 90 && day > 60) phase = "90 Days";
  else if (day > 90) phase = "Quarter complete";

  $("#currentPhase").textContent = phase;
  $("#phaseBadge").textContent = phase;
  $("#dayCounter").textContent =
    day < 1 ? "Before start" :
    day <= 90 ? `Day ${day} of 90` :
    "90-day period complete";
}

function renderAll() {
  renderTabs();
  renderWeeklyTasks();
  renderWeekDetail();
  renderDisplayList("#deliverables30", state.deliverables30);
  renderSuccessReview("#success30", "success30");

  renderCheckList("#objectives60", state.objectives60);
  renderDisplayList("#deliverables60", state.deliverables60);
  renderSuccessReview("#success60", "success60");

  renderCheckList("#objectives90", state.objectives90);
  renderDisplayList("#deliverables90", state.deliverables90);
  renderSuccessReview("#success90", "success90");

  renderPeople();
  renderEditableList("#barcelonaObjectives", "barcelonaObjectives");
  renderEditableList("#barcelonaPrep", "barcelonaPrep");
  renderBarcelonaMeetings();
  renderOpportunities();
  bindStaticFields();
  updateSummary();
}

loadLocal();
syncActiveWeekToDate();
bindTabs();
bindAddButtons();
renderAll();

initFirebase().catch(error => {
  console.error(error);
  $("#saveStatus").textContent = "Firebase setup error";
});
