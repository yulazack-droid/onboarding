import {
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { firebaseConfig, maryWorkspaceId } from "./firebase-config.js";

const ADMIN_EMAIL = "yula.zack@scopely.com";
const TEMPLATE_ID = "ai-transformation-lead";
const DATA_ANALYST_TEMPLATE_ID = "data-analyst";
const app = initializeApp(firebaseConfig, "lgp-template-seed");
const auth = getAuth(app);
const db = getFirestore(app);
const signInButton = document.getElementById("signInButton");
const seedButton = document.getElementById("seedButton");
const seedDataAnalystButton = document.getElementById("seedDataAnalystButton");
const signOutButton = document.getElementById("signOutButton");
const status = document.getElementById("status");
const appShell = document.getElementById("appShell");
const loginGate = document.getElementById("loginGate");

function isAdmin(user) {
  return (user?.email || "").toLowerCase() === ADMIN_EMAIL;
}

function setStatus(message, isError = false) {
  status.textContent = message;
  status.classList.toggle("error", isError);
}

async function seedTemplate(user) {
  seedButton.disabled = true;
  try {
    const templateRef = doc(db, "templates", TEMPLATE_ID);
    if ((await getDoc(templateRef)).exists()) {
      throw new Error("The AI Transformation Lead template already exists. It was not changed.");
    }

    const marySnapshot = await getDoc(doc(db, "workspaces", maryWorkspaceId));
    if (!marySnapshot.exists() || !marySnapshot.data().workspaceData) {
      throw new Error("Mary's Journey could not be read, so no template was created.");
    }

    await setDoc(templateRef, {
      templateId: TEMPLATE_ID,
      name: "AI Transformation Lead",
      description: "Discovery, stakeholder alignment, practical delivery and a sustainable AI roadmap.",
      category: "AI / Transformation",
      durationLabel: "90 Days",
      version: 1,
      status: "Active",
      owner: { uid: user.uid, email: user.email },
      sourceJourneyId: maryWorkspaceId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      templateData: marySnapshot.data().workspaceData
    });
    setStatus("Template created successfully. Mary's Journey was not changed.");
  } catch (error) {
    console.error("Template seed failed", error);
    setStatus(error?.message || "Template creation failed.", true);
    seedButton.disabled = false;
  }
}

function dataAnalystTemplateData() {
  const weeks = [
    ["30", "Week 1 · Access and orientation", "Secure warehouse, BI, repository and documentation access; understand data governance and the portfolio.", ["Request SQL warehouse, BI, repository and documentation access", "Review data governance and key game systems"]],
    ["30", "Week 2 · Business context", "Learn game loops, player segments, LiveOps cadence and the KPIs used to run the portfolio.", ["Review product loops, player segments and LiveOps cadence", "Map revenue, retention and engagement KPI definitions"]],
    ["30", "Week 3 · Data landscape", "Understand sources, pipelines, semantic layers, dashboards, quality ownership and known limitations.", ["Map core sources, pipelines and semantic layers", "Document data quality gaps and owners"]],
    ["30", "Week 4 · Stakeholder routines", "Establish working relationships with Analytics, Product, Economy, Monetization and Data Engineering.", ["Meet priority stakeholders", "Agree a recurring analytics working cadence"]],
    ["30", "Week 5 · First analysis", "Validate an existing dashboard or answer a scoped business question.", ["Validate one existing dashboard", "Deliver one scoped analysis with clear assumptions"]],
    ["60", "Week 6 · Insight backlog", "Turn questions and data gaps into a prioritized analysis backlog.", ["Document unanswered business questions", "Prioritize the analysis backlog with stakeholders"]],
    ["60", "Week 7 · KPI deep dive", "Build practical understanding of monetization, retention and engagement signals.", ["Analyse KPI movement and drivers", "Identify data limitations affecting interpretation"]],
    ["60", "Week 8 · Decision support", "Produce an insight that supports a product, LiveOps or economy decision.", ["Partner on a decision-ready analysis", "Communicate findings and recommended next steps"]],
    ["60", "Week 9 · Quality improvement", "Define one practical improvement to data quality, documentation or dashboard reliability.", ["Propose a data quality or documentation improvement", "Align ownership and delivery plan"]],
    ["90", "Week 10 · Independent delivery", "Complete an analysis independently and socialize the result.", ["Deliver an end-to-end analysis", "Present insight and implications to stakeholders"]],
    ["90", "Week 11 · Operating model", "Strengthen stakeholder routines and clarify intake, prioritization and review practices.", ["Define analytics intake and prioritization habits", "Review stakeholder feedback"]],
    ["90", "Week 12 · Roadmap", "Create a credible short-term roadmap for analysis, dashboards and data gaps.", ["Prioritize the next six-month analytics roadmap", "Align roadmap assumptions"]],
    ["90", "Week 13 · Reflection and next steps", "Consolidate learning, outcomes and the ongoing analytics operating model.", ["Document onboarding outcomes and lessons", "Confirm next-quarter priorities"]]
  ].map(([phase, title, focus, actions], index) => ({ phase, title, dates: `Week ${index + 1}`, start: "", end: "", focus, outcomes: [], actions: actions.map(text => ({ text, done: false })), notes: "", marySatisfaction: 0, yulaSatisfaction: 0, reflection: "" }));
  return { activeTab: "overview", activeWeek: 0, weeklyAgenda: "", manualTasks: {}, weeks, people: [], initiatives: [], resources: [], success30: [], success60: [], success90: [], deliverables30: [], deliverables60: [], deliverables90: [], roadmapNow: "", roadmapNext: "", roadmapLater: "" };
}

async function seedDataAnalystTemplate(user) {
  seedDataAnalystButton.disabled = true;
  try {
    const ref = doc(db, "templates", DATA_ANALYST_TEMPLATE_ID);
    if ((await getDoc(ref)).exists()) throw new Error("The Data Analyst template already exists. It was not changed.");
    await setDoc(ref, { templateId: DATA_ANALYST_TEMPLATE_ID, name: "Data Analyst", description: "Business context, data access, dashboards, analytical workflows and stakeholder partnership.", category: "Analytics", durationLabel: "90 Days", version: 1, status: "Active", owner: { uid: user.uid, email: user.email }, createdAt: serverTimestamp(), updatedAt: serverTimestamp(), templateData: dataAnalystTemplateData() });
    setStatus("Data Analyst template created successfully.");
  } catch (error) {
    console.error("Data Analyst template seed failed", error);
    setStatus(error?.message || "Data Analyst template creation failed.", true);
    seedDataAnalystButton.disabled = false;
  }
}

signInButton.addEventListener("click", async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ hd: "scopely.com" });
    await signInWithPopup(auth, provider);
  } catch (error) {
    setStatus(error?.message || "Sign-in failed.", true);
  }
});

signOutButton.addEventListener("click", () => signOut(auth));
seedButton.addEventListener("click", () => seedTemplate(auth.currentUser));
seedDataAnalystButton.addEventListener("click", () => seedDataAnalystTemplate(auth.currentUser));

onAuthStateChanged(auth, user => {
  const allowed = isAdmin(user);
  loginGate.hidden = allowed;
  appShell.hidden = !allowed;
  if (!user) setStatus("Sign in with Yula's Scopely account to continue.");
  else if (!allowed) setStatus("This page is available only to the template administrator.", true);
  else setStatus("Ready to create Template v1 from Mary's current Journey.");
});
