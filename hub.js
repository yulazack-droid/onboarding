import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig, "lgp-onboarding-hub");
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ hd: "scopely.com" });

const els = {
  loginGate: document.getElementById("loginGate"),
  hubShell: document.getElementById("hubShell"),
  signInButton: document.getElementById("signInButton"),
  signOutButton: document.getElementById("signOutButton"),
  loginMessage: document.getElementById("loginMessage"),
  userName: document.getElementById("userName"),
  userEmail: document.getElementById("userEmail"),
  userAvatar: document.getElementById("userAvatar"),
  journeyGrid: document.getElementById("journeyGrid"),
  journeyState: document.getElementById("journeyState"),
  journeyCount: document.getElementById("journeyCount"),
  startJourneyButton: document.getElementById("startJourneyButton"),
  journeyDialog: document.getElementById("journeyDialog"),
  closeJourneyDialog: document.getElementById("closeJourneyDialog"),
  createJourneyForm: document.getElementById("createJourneyForm"),
  createJourneyButton: document.getElementById("createJourneyButton"),
  createJourneyStatus: document.getElementById("createJourneyStatus")
};

let currentUser = null;

function isScopelyUser(user) {
  return Boolean(user?.email && user.email.toLowerCase().endsWith("@scopely.com"));
}

function setLoginMessage(message, isError = false) {
  els.loginMessage.textContent = message;
  els.loginMessage.classList.toggle("error", isError);
}

function showGate(message = "") {
  els.loginGate.hidden = false;
  els.hubShell.hidden = true;
  setLoginMessage(message);
}

function showHub(user) {
  els.loginGate.hidden = true;
  els.hubShell.hidden = false;
  // Pilot mode: every authenticated Scopely user may view the full Hub UI.
  // The Create Journey button remains informational until Sprint 2.
  els.startJourneyButton.hidden = false;
  els.userName.textContent = user.displayName || "Scopely user";
  els.userEmail.textContent = user.email || "";
  if (user.photoURL) {
    els.userAvatar.src = user.photoURL;
    els.userAvatar.alt = `${user.displayName || "User"} profile photo`;
    els.userAvatar.hidden = false;
  } else {
    els.userAvatar.hidden = true;
  }
}

function formatDate(value) {
  if (!value) return "Start date not set";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "Start date not set";
  return `Started ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)}`;
}

function initials(name = "Journey") {
  return name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || "").join("") || "J";
}

function journeyLink(workspaceId) {
  const fixedMaryId = "9dc23f8e-8b42-4a75-b7d2-91b3f1df46ad";
  return workspaceId === fixedMaryId ? "index.html" : `index.html?workspace=${encodeURIComponent(workspaceId)}`;
}

function materializeTimeline(templateData, startDate) {
  const data = structuredClone(templateData);
  const origin = new Date(`${startDate}T00:00:00`);
  data.weeks = (data.weeks || []).map((week, index) => {
    const start = new Date(origin);
    start.setDate(origin.getDate() + index * 7);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { ...week, start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10), dates: `Week ${index + 1}` };
  });
  return data;
}

function renderJourneys(journeys) {
  els.journeyGrid.innerHTML = "";
  els.journeyCount.textContent = String(journeys.length);

  if (!journeys.length) {
    els.journeyState.textContent = "No onboarding journeys are available yet.";
    els.journeyState.hidden = false;
    els.journeyGrid.hidden = true;
    return;
  }

  journeys.forEach(journey => {
    const card = document.createElement("a");
    card.className = "journey-card";
    card.href = journeyLink(journey.id);
    card.innerHTML = `
      <div class="journey-top">
        <span class="person-initials">${initials(journey.employeeName)}</span>
        <span class="active-badge">${journey.status || "Active"}</span>
      </div>
      <h3>${escapeHtml(journey.employeeName || "Unnamed employee")}</h3>
      <p class="journey-role">${escapeHtml(journey.roleTitle || journey.template || "Onboarding journey")}</p>
      <div class="journey-meta">
        <span>${escapeHtml(formatDate(journey.startDate))}</span>
        <span class="open-label">Open Journey →</span>
      </div>`;
    els.journeyGrid.appendChild(card);
  });

  els.journeyState.hidden = true;
  els.journeyGrid.hidden = false;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>'"]/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[char]);
}

async function loadJourneys() {
  els.journeyState.textContent = "Loading journeys…";
  els.journeyState.classList.remove("error");
  els.journeyState.hidden = false;
  els.journeyGrid.hidden = true;

  try {
    let snapshot;
    try {
      snapshot = await getDocs(query(collection(db, "workspaces"), orderBy("startDate", "desc")));
    } catch (indexOrFieldError) {
      console.warn("Falling back to an unordered workspace query", indexOrFieldError);
      snapshot = await getDocs(collection(db, "workspaces"));
    }
    const journeys = snapshot.docs.map(docSnapshot => ({ id: docSnapshot.id, ...docSnapshot.data() }));
    journeys.sort((a, b) => String(b.startDate || "").localeCompare(String(a.startDate || "")));
    renderJourneys(journeys);
  } catch (error) {
    console.error("Unable to load onboarding journeys", error);
    els.journeyCount.textContent = "0";
    els.journeyState.textContent = error?.code === "permission-denied"
      ? "Your account does not currently have permission to view pilot Journeys."
      : "Journeys could not be loaded. Please refresh and try again.";
    els.journeyState.classList.add("error");
  }
}

async function handleSignIn() {
  els.signInButton.disabled = true;
  setLoginMessage("Opening Google sign-in…");
  try {
    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);
    if (!isScopelyUser(result.user)) {
      await signOut(auth);
      throw new Error("Please use your Scopely Google account.");
    }
  } catch (error) {
    console.error("Hub sign-in failed", error);
    const message = error?.code === "auth/popup-closed-by-user"
      ? "The sign-in window was closed before completion."
      : error?.code === "auth/popup-blocked"
        ? "The browser blocked the sign-in window. Allow pop-ups and try again."
        : error?.message || "Sign-in failed.";
    setLoginMessage(message, true);
  } finally {
    els.signInButton.disabled = false;
  }
}

els.signInButton.addEventListener("click", handleSignIn);
els.signOutButton.addEventListener("click", async () => {
  els.signOutButton.disabled = true;
  try { await signOut(auth); } finally { els.signOutButton.disabled = false; }
});
els.startJourneyButton.addEventListener("click", () => els.journeyDialog.showModal());
els.closeJourneyDialog.addEventListener("click", () => els.journeyDialog.close());
els.createJourneyForm.addEventListener("submit", async event => {
  event.preventDefault();
  const form = new FormData(els.createJourneyForm);
  const employee = { name: form.get("employeeName").trim(), email: form.get("employeeEmail").trim().toLowerCase() };
  const manager = { name: form.get("managerName").trim(), email: form.get("managerEmail").trim().toLowerCase() };
  els.createJourneyButton.disabled = true;
  els.createJourneyStatus.textContent = "Creating Journey…";
  try {
    const templateId = form.get("templateId");
    const snapshot = await getDoc(doc(db, "templates", templateId));
    if (!snapshot.exists()) throw new Error("This template has not been seeded yet.");
    const template = snapshot.data();
    const ref = await addDoc(collection(db, "workspaces"), {
      employeeName: employee.name, employee, managerName: manager.name, manager,
      roleTitle: template.name, template: template.name, templateId, templateVersion: template.version,
      startDate: form.get("startDate"), status: "Active", editors: [...new Set([employee.email, manager.email])],
      ownerUid: currentUser.uid, ownerEmail: currentUser.email || "", schemaVersion: 3,
      createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
      createdBy: { uid: currentUser.uid, email: currentUser.email || "" },
      workspaceData: materializeTimeline(template.templateData, form.get("startDate"))
    });
    window.location.assign(journeyLink(ref.id));
  } catch (error) {
    console.error("Create Journey failed", error);
    els.createJourneyStatus.textContent = error?.message || "Journey creation failed.";
    els.createJourneyStatus.classList.add("error");
    els.createJourneyButton.disabled = false;
  }
});

onAuthStateChanged(auth, async user => {
  if (!user) {
    showGate();
    return;
  }
  if (!isScopelyUser(user)) {
    await signOut(auth);
    showGate("Please use your Scopely Google account.");
    return;
  }
  currentUser = user;
  showHub(user);
  await loadJourneys();
});
