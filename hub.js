import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { collection, getDocs, getFirestore, orderBy, query } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig, "lgp-onboarding-hub");
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ hd: "scopely.com" });

const els = {
  loginGate: document.getElementById("loginGate"), hubShell: document.getElementById("hubShell"),
  signInButton: document.getElementById("signInButton"), signOutButton: document.getElementById("signOutButton"),
  loginMessage: document.getElementById("loginMessage"), userName: document.getElementById("userName"),
  userEmail: document.getElementById("userEmail"), userAvatar: document.getElementById("userAvatar"),
  journeyGrid: document.getElementById("journeyGrid"), journeyState: document.getElementById("journeyState"),
  journeyCount: document.getElementById("journeyCount"), startJourneyButton: document.getElementById("startJourneyButton")
};

const isScopelyUser = user => Boolean(user?.email && user.email.toLowerCase().endsWith("@scopely.com"));
const escapeHtml = value => String(value ?? "").replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
const initials = (name = "Journey") => name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase() || "").join("") || "J";
const journeyLink = id => id === "9dc23f8e-8b42-4a75-b7d2-91b3f1df46ad" ? "index.html" : `index.html?workspace=${encodeURIComponent(id)}`;

function setLoginMessage(message, isError = false) { els.loginMessage.textContent = message; els.loginMessage.classList.toggle("error", isError); }
function showGate(message = "") { els.loginGate.hidden = false; els.hubShell.hidden = true; setLoginMessage(message); }
function showHub(user) {
  els.loginGate.hidden = true; els.hubShell.hidden = false;
  els.userName.textContent = user.displayName || "Scopely user"; els.userEmail.textContent = user.email || "";
  if (user.photoURL) { els.userAvatar.src = user.photoURL; els.userAvatar.alt = `${user.displayName || "User"} profile photo`; els.userAvatar.hidden = false; } else els.userAvatar.hidden = true;
}
function formatDate(value) { if (!value) return "Start date not set"; const date = new Date(`${value}T00:00:00`); return Number.isNaN(date.getTime()) ? "Start date not set" : `Started ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)}`; }
function renderJourneys(journeys) {
  els.journeyGrid.innerHTML = ""; els.journeyCount.textContent = String(journeys.length);
  if (!journeys.length) { els.journeyState.textContent = "No onboarding journeys are available yet."; els.journeyState.hidden = false; els.journeyGrid.hidden = true; return; }
  journeys.forEach(journey => {
    const card = document.createElement("a"); card.className = "journey-card"; card.href = journeyLink(journey.id);
    card.innerHTML = `<div class="journey-top"><span class="person-initials">${initials(journey.employeeName)}</span><span class="active-badge">${escapeHtml(journey.status || "Active")}</span></div><h3>${escapeHtml(journey.employeeName || "Unnamed employee")}</h3><p class="journey-role">${escapeHtml(journey.roleTitle || journey.template || "Onboarding journey")}</p><div class="journey-meta"><span>${escapeHtml(formatDate(journey.startDate))}</span><span class="open-label">Open Journey →</span></div>`;
    els.journeyGrid.appendChild(card);
  });
  els.journeyState.hidden = true; els.journeyGrid.hidden = false;
}
async function loadJourneys() {
  els.journeyState.textContent = "Loading journeys…"; els.journeyState.classList.remove("error"); els.journeyState.hidden = false; els.journeyGrid.hidden = true;
  try {
    let snapshot; try { snapshot = await getDocs(query(collection(db, "workspaces"), orderBy("startDate", "desc"))); } catch { snapshot = await getDocs(collection(db, "workspaces")); }
    const journeys = snapshot.docs.map(item => ({ id: item.id, ...item.data() })).sort((a, b) => String(b.startDate || "").localeCompare(String(a.startDate || "")));
    renderJourneys(journeys);
  } catch (error) { console.error("Unable to load Journeys", error); els.journeyCount.textContent = "0"; els.journeyState.textContent = error?.code === "permission-denied" ? "Your account does not have permission to view pilot Journeys." : "Journeys could not be loaded. Please refresh and try again."; els.journeyState.classList.add("error"); }
}
async function handleSignIn() { els.signInButton.disabled = true; setLoginMessage("Opening Google sign-in…"); try { await setPersistence(auth, browserLocalPersistence); const result = await signInWithPopup(auth, provider); if (!isScopelyUser(result.user)) { await signOut(auth); throw new Error("Please use your Scopely Google account."); } } catch (error) { setLoginMessage(error?.message || "Sign-in failed.", true); } finally { els.signInButton.disabled = false; } }

els.signInButton.addEventListener("click", handleSignIn);
els.signOutButton.addEventListener("click", () => signOut(auth));
els.startJourneyButton.addEventListener("click", () => document.getElementById("templatesTitle")?.scrollIntoView({ behavior: "smooth", block: "start" }));
onAuthStateChanged(auth, async user => { if (!user) return showGate(); if (!isScopelyUser(user)) { await signOut(auth); return showGate("Please use your Scopely Google account."); } showHub(user); await loadJourneys(); });
