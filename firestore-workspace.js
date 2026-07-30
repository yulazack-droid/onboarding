import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { app } from "./firebase-auth.js";
import { initialWorkspaceMetadata, maryWorkspaceId } from "./firebase-config.js";

const db = getFirestore(app);
const requestedWorkspaceId = new URLSearchParams(window.location.search).get("workspace")?.trim();
const templatePreviewId = new URLSearchParams(window.location.search).get("template")?.trim();
const isTemplatePreview = Boolean(templatePreviewId && !requestedWorkspaceId);
const workspaceId = requestedWorkspaceId || maryWorkspaceId;
const isMaryJourney = workspaceId === maryWorkspaceId && !isTemplatePreview;
const defaultMetadata = isMaryJourney ? initialWorkspaceMetadata : {
  employeeName: "Onboarding Journey",
  roleTitle: "Role Journey",
  managerName: "Not assigned",
  startDate: "",
  status: "Draft"
};
const workspaceRef = doc(db, "workspaces", workspaceId);
const employeeName = document.getElementById("employeeName");
const roleManager = document.getElementById("roleManager");
const startDateLabel = document.getElementById("startDateLabel");
const saveStatus = document.getElementById("saveStatus");
const accessBanner = document.getElementById("accessBanner");

let activeUser = null;
let unsubscribeSnapshot = null;
let saveTimer = null;
let applyingRemoteState = false;
let lastUploadedUpdatedAt = null;
let canEdit = false;

function setAccessMode(editable, message) {
  canEdit = Boolean(editable);
  window.workspaceApp?.setReadOnly?.(!canEdit);
  if (accessBanner) {
    accessBanner.hidden = false;
    accessBanner.textContent = message;
    accessBanner.classList.toggle("viewer", !canEdit);
  }
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

function renderMetadata(metadata) {
  const data = { ...defaultMetadata, ...(metadata || {}) };
  employeeName.textContent = data.employeeName;
  roleManager.textContent = `${data.roleTitle} · Manager: ${data.managerName}`;
  startDateLabel.textContent = formatDate(data.startDate);
  document.title = `${data.employeeName} | First 90 Days`;
  const employee = data.employeeName || "Employee";
  const manager = data.managerName || "Manager";
  const text = (id, value) => { const element = document.getElementById(id); if (element) element.textContent = value; };
  text("welcomeName", `Welcome, ${employee}`);
  [30, 60, 90].forEach(day => {
    text(`employeeReflection${day}Label`, `${employee}'s ${day}-day reflection`);
    text(`managerAssessment${day}Label`, `${manager}'s ${day}-day assessment`);
  });
  if (data.roleMission) text("roleMissionTitle", data.roleMission);
  if (data.roleMissionDescription) text("roleMissionDescription", data.roleMissionDescription);
  if (!isMaryJourney) {
    const phaseTitles = [
      ["Foundation and role immersion", "Build context, access, relationships and the first working rhythm."],
      ["Role-specific application", "Turn early learning into practical work, partnership and measurable progress."],
      ["Independent delivery and path forward", "Deliver, learn and establish the priorities for the next period."]
    ];
    document.querySelectorAll(".phase-hero").forEach((hero, index) => {
      const [title, description] = phaseTitles[index] || [];
      const heading = hero.querySelector("h2");
      const copy = hero.querySelector("p:not(.eyebrow)");
      if (heading) heading.textContent = title;
      if (copy) copy.textContent = description;
    });
    const frameworkLabel = document.querySelector(".framework .eyebrow");
    if (frameworkLabel) frameworkLabel.textContent = "Opportunity exploration framework";
    const initiativesHeading = document.querySelector("#initiatives h2");
    if (initiativesHeading) initiativesHeading.textContent = "Opportunities and projects";
  }
  window.journeyProfile = { employeeName: employee, managerName: manager };
  window.workspaceApp?.render?.();
}

function setCloudStatus(message, isError = false) {
  if (!saveStatus) return;
  saveStatus.textContent = message;
  saveStatus.classList.toggle("cloud-error", isError);
}

function appReady() {
  return Boolean(window.workspaceApp?.getState && window.workspaceApp?.applyState);
}

async function waitForApp() {
  for (let i = 0; i < 100; i += 1) {
    if (appReady()) return;
    await new Promise(resolve => setTimeout(resolve, 30));
  }
  throw new Error("Workspace application did not initialize");
}

function metadataFields(data = {}) {
  const {
    workspaceData,
    createdAt,
    updatedAt,
    ...metadata
  } = data;
  return metadata;
}

function previewDateRange(index) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + index * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const iso = date => date.toISOString().slice(0, 10);
  return { start: iso(start), end: iso(end), dates: `Week ${index + 1}` };
}

function templateWorkspaceData(template) {
  const weeks = (template.weeks || []).map((week, index) => ({
    phase: index < 5 ? "30" : index < 9 ? "60" : "90",
    title: `Week ${index + 1} · ${week.title}`,
    ...previewDateRange(index),
    focus: week.focus,
    outcomes: week.outcomes?.length ? week.outcomes : [`Complete the expected ${week.title} milestones.`],
    actions: (week.activities || []).map(text => ({ text, done: false })),
    notes: "", marySatisfaction: 0, yulaSatisfaction: 0, reflection: ""
  }));
  const deliverables = phase => template.phaseDeliverables?.[phase] || [];
  const success = phase => [{ text: template.phaseSuccessCriteria?.[phase] || "Complete the role-specific phase criteria.", mary: false, yula: false }];
  return { schemaVersion: 4, activeTab: "overview", activeWeek: 0, weeklyAgenda: "", maryReflection30: "", yulaAssessment30: "", maryReflection60: "", yulaAssessment60: "", maryReflection90: "", yulaAssessment90: "", roadmapNow: "", roadmapNext: "", roadmapLater: "", manualTasks: {}, weeks, deliverables30: deliverables("30"), success30: success("30"), deliverables60: deliverables("60"), success60: success("60"), deliverables90: deliverables("90"), success90: success("90"), people: [], initiatives: (template.initiativesOrLearningAreas || []).map(title => ({ title, team: "", problemType: "Other", estimatedTime: "1–2 weeks", scope: "Single workflow", type: "Project", impact: "Medium", priority: "Medium", status: "Idea", notes: "Suggested from the role template" })), resources: (template.suggestedResources || []).map(name => ({ name, description: `Suggested ${template.templateName} resource`, link: "" })) };
}

async function loadTemplatePreview() {
  await waitForApp();
  const response = await fetch(`templates/${encodeURIComponent(templatePreviewId)}.json`);
  if (!response.ok) throw new Error("Template not found");
  const template = await response.json();
  document.body.classList.add("template-preview-mode");
  const assign = document.getElementById("assignTemplateButton");
  if (assign) { assign.href = `assign.html?template=${encodeURIComponent(templatePreviewId)}`; assign.hidden = false; }
  renderMetadata({ employeeName: "Role template", roleTitle: template.templateName, managerName: "Not assigned", startDate: "", roleMission: template.roleMission, roleMissionDescription: template.description });
  setAccessMode(false, "Template preview · no employee is assigned yet");
  applyingRemoteState = true;
  try { window.workspaceApp.applyState(templateWorkspaceData(template), { persistLocal: false, statusText: "Template preview" }); }
  finally { applyingRemoteState = false; }
  setCloudStatus("Template preview · nothing is saved");
}

async function uploadFullWorkspace(user, reason = "save") {
  if (!user || !appReady() || applyingRemoteState || !canEdit) return;
  const workspaceData = window.workspaceApp.getState();
  delete workspaceData.activeTab;
  delete workspaceData.activeWeek;
  setCloudStatus(reason === "migration" ? "Uploading existing workspace…" : "Saving to cloud…");
  // Editors update only Journey content. Identity and access metadata must not
  // be overwritten by whichever editor saved most recently.
  await setDoc(workspaceRef, {
    workspaceData,
    updatedAt: serverTimestamp()
  }, { merge: true });
  lastUploadedUpdatedAt = workspaceData.updatedAt || null;
  setCloudStatus("All changes saved to cloud");
}

function scheduleCloudSave() {
  if (!activeUser || applyingRemoteState || !canEdit) return;
  clearTimeout(saveTimer);
  setCloudStatus("Saving to cloud…");
  saveTimer = setTimeout(async () => {
    try {
      await uploadFullWorkspace(activeUser);
    } catch (error) {
      console.error("Firestore save failed", error);
      setCloudStatus(error?.code === "permission-denied" ? "Cloud save blocked by Firestore rules" : "Cloud save failed · local backup kept", true);
    }
  }, 650);
}

async function loadWorkspace(user) {
  await waitForApp();
  setCloudStatus("Connecting to cloud…");
  const snapshot = await getDoc(workspaceRef);

  if (!snapshot.exists()) {
    const error = new Error("Journey not found");
    error.code = "journey-not-found";
    throw error;
  }

  const cloud = snapshot.data();
  const userEmail = (user.email || "").toLowerCase();
  const editors = Array.isArray(cloud.editors)
    ? cloud.editors.map(email => String(email).toLowerCase())
    : [];
  const editable = editors.includes(userEmail);
  setAccessMode(editable, editable ? "Editor access" : "View-only access");
  renderMetadata(metadataFields(cloud));
  if (cloud.workspaceData) {
    applyingRemoteState = true;
    try {
      window.workspaceApp.applyState(cloud.workspaceData, { persistLocal: true, statusText: "Workspace loaded from cloud" });
      lastUploadedUpdatedAt = cloud.workspaceData.updatedAt || null;
    } finally {
      applyingRemoteState = false;
    }
    setCloudStatus("Workspace loaded from cloud");
  } else {
    await uploadFullWorkspace(user, "migration");
  }
}

function startRealtimeSync() {
  unsubscribeSnapshot?.();
  unsubscribeSnapshot = onSnapshot(workspaceRef, snapshot => {
    if (!snapshot.exists() || !appReady()) return;
    const cloud = snapshot.data();
    renderMetadata(metadataFields(cloud));
    const remote = cloud.workspaceData;
    if (!remote || applyingRemoteState) return;
    if (remote.updatedAt && remote.updatedAt === lastUploadedUpdatedAt) return;

    applyingRemoteState = true;
    try {
      window.workspaceApp.applyState(remote, { persistLocal: true, statusText: "Synced from cloud" });
      lastUploadedUpdatedAt = remote.updatedAt || null;
      setCloudStatus("Synced from cloud");
    } finally {
      applyingRemoteState = false;
    }
  }, error => {
    console.error("Firestore realtime sync failed", error);
    setCloudStatus("Realtime sync unavailable · local backup kept", true);
  });
}

window.addEventListener("workspace-local-changed", scheduleCloudSave);
renderMetadata(defaultMetadata);

window.addEventListener("workspace-auth-changed", async event => {
  const user = event.detail?.accessGranted ? event.detail.user : null;
  activeUser = user;
  clearTimeout(saveTimer);
  unsubscribeSnapshot?.();
  unsubscribeSnapshot = null;

  if (!user) {
    canEdit = false;
    window.workspaceApp?.setReadOnly?.(true);
    if (accessBanner) accessBanner.hidden = true;
    renderMetadata(defaultMetadata);
    setCloudStatus("Sign in to access the workspace");
    return;
  }

  if (isTemplatePreview) {
    try {
      await loadTemplatePreview();
    } catch (error) {
      console.error("Template preview failed", error);
      setCloudStatus("Template preview could not be loaded", true);
    }
    return;
  }

  try {
    await loadWorkspace(user);
    startRealtimeSync();
  } catch (error) {
    console.error("Firestore workspace connection failed", error);
    const message = error?.code === "journey-not-found"
      ? "Journey not found"
      : error?.code === "permission-denied"
      ? "Cloud blocked by Firestore rules"
      : "Cloud unavailable · local backup kept";
    setCloudStatus(message, true);
  }
});

export { db, workspaceRef };
