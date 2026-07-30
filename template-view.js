import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const id = new URLSearchParams(location.search).get("template");
const app = initializeApp(firebaseConfig, "lgp-template-view");
const auth = getAuth(app);
const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? "").replace(/[&<>]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char]);

async function load() {
  if (!id) throw new Error("Choose a template from the Hub.");
  const response = await fetch(`templates/${encodeURIComponent(id)}.json`);
  if (!response.ok) throw new Error("This template is not available yet.");
  const template = await response.json();
  document.title = `${template.templateName} | LGP Onboarding Hub`;
  $("#name").textContent = template.templateName;
  $("#description").textContent = template.description;
  $("#duration").textContent = `${template.durationDays} days`;
  $("#category").textContent = template.category;
  $("#mission").textContent = template.roleMission || "A clear, role-specific 90-day onboarding format.";
  $("#operatingModel").innerHTML = (template.operatingModel || ["Learn the role context and build trusted partnerships.", "Deliver meaningful early value and establish sustainable working rhythms."]).map(item => `<li>${esc(item)}</li>`).join("");
  const list = (selector, items) => $(selector).innerHTML = (items || []).map(item => `<li>${esc(item)}</li>`).join("");
  list("#principles", template.journeyPrinciples);
  list("#stakeholders", template.stakeholderCategories);
  list("#resources", template.suggestedResources);
  list("#learningAreas", template.initiativesOrLearningAreas);
  const weeks = template.weeks || [];
  $("#weekCount").textContent = `${weeks.length} weeks`;
  $("#timeline").innerHTML = weeks.map((week, index) => { const outcomes = week.outcomes?.length ? week.outcomes : [`Complete the expected ${week.title || `Week ${index + 1}`} milestones.`]; return `<article class="week"><p class="eyebrow">Week ${index + 1}</p><h3>${esc(week.title || week[0])}</h3><p>${esc(week.focus || week[1])}</p><p class="week-label">Expected outcomes</p><ul>${outcomes.map(outcome => `<li>${esc(outcome)}</li>`).join("")}</ul><p class="week-label">Key activities</p><ul>${(week.activities || []).map(activity => `<li>${esc(activity)}</li>`).join("")}</ul></article>`; }).join("");
  $("#phaseDetails").innerHTML = ["30", "60", "90"].map(day => `<article><p class="eyebrow">Days ${day === "30" ? "1–30" : day === "60" ? "31–60" : "61–90"}</p><h3>Deliverables</h3><ul>${(template.phaseDeliverables?.[day] || []).map(item => `<li>${esc(item)}</li>`).join("")}</ul><h3>Success criteria</h3><p>${esc(template.phaseSuccessCriteria?.[day] || "")}</p></article>`).join("");
  $("#useTemplate").onclick = () => location.assign(`assign.html?template=${encodeURIComponent(id)}`);
}

$("#signIn").onclick = async () => { const provider = new GoogleAuthProvider(); provider.setCustomParameters({ hd: "scopely.com" }); await signInWithPopup(auth, provider); };
onAuthStateChanged(auth, async user => { if (!user || !user.email?.toLowerCase().endsWith("@scopely.com")) return; $("#gate").hidden = true; $("#app").hidden = false; try { await load(); } catch (error) { $("#message").textContent = error.message; } });
