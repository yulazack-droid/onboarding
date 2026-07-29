import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { app, auth } from "./firebase-auth.js";
import { initialWorkspaceMetadata, workspaceId } from "./firebase-config.js";

const db = getFirestore(app);
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

function isMary(user) {
  return (user?.email || "").toLowerCase() === "mary.tikva@scopely.com";
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(date);
}

function renderMetadata(metadata) {
  const data = { ...initialWorkspaceMetadata, ...(metadata || {}) };
  employeeName.textContent = data.employeeName;
  roleManager.textContent = `${data.roleTitle} · Manager: ${data.managerName}`;
  startDateLabel.textContent = formatDate(data.startDate);
  document.title = `${data.employeeName} | First 90 Days`;
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

async function uploadFullWorkspace(user, reason = "save") {
  if (!user || !appReady() || applyingRemoteState || !canEdit) return;
  const workspaceData = window.workspaceApp.getState();
  delete workspaceData.activeTab;
  delete workspaceData.activeWeek;
  setCloudStatus(reason === "migration" ? "Uploading existing workspace…" : "Saving to cloud…");
  await setDoc(workspaceRef, {
    ...initialWorkspaceMetadata,
    ownerUid: user.uid,
    ownerEmail: user.email || "",
    schemaVersion: 2,
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

async function loadOrCreateWorkspace(user) {
  await waitForApp();
  setCloudStatus("Connecting to cloud…");
  const snapshot = await getDoc(workspaceRef);

  if (!snapshot.exists()) {
    const workspaceData = window.workspaceApp.getState();
    await setDoc(workspaceRef, {
      ...initialWorkspaceMetadata,
      ownerUid: user.uid,
      ownerEmail: user.email || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      schemaVersion: 2,
      workspaceData
    });
    lastUploadedUpdatedAt = workspaceData.updatedAt || null;
    setAccessMode(true, "Editor access · your changes are saved to the shared workspace");
    renderMetadata(initialWorkspaceMetadata);
    setCloudStatus("Workspace uploaded to cloud");
    return;
  }

  const cloud = snapshot.data();
  const editable = user.uid === cloud.ownerUid || isMary(user);
  setAccessMode(editable, editable ? "Editor access · your changes are saved to the shared workspace" : "View-only access — You can explore this workspace, but only Yula Zack and Mary Fisher can make changes.");
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
renderMetadata(initialWorkspaceMetadata);

onAuthStateChanged(auth, async user => {
  activeUser = user;
  clearTimeout(saveTimer);
  unsubscribeSnapshot?.();
  unsubscribeSnapshot = null;

  if (!user) {
    canEdit = false;
    window.workspaceApp?.setReadOnly?.(true);
    if (accessBanner) accessBanner.hidden = true;
    renderMetadata(initialWorkspaceMetadata);
    setCloudStatus("Saved locally · sign in for cloud");
    return;
  }

  try {
    await loadOrCreateWorkspace(user);
    startRealtimeSync();
  } catch (error) {
    console.error("Firestore workspace connection failed", error);
    const message = error?.code === "permission-denied"
      ? "Cloud blocked by Firestore rules"
      : "Cloud unavailable · local backup kept";
    setCloudStatus(message, true);
  }
});

export { db, workspaceRef };
