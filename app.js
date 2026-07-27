
import { firebaseConfig, workspaceId } from "./firebase-config.js";

const LOCAL_KEY = "mary-first-90-days-v1-final";
const START_DATE = new Date("2026-08-11T00:00:00");
const firebaseEnabled = !Object.values(firebaseConfig).some(v => String(v).includes("PASTE_"));

const meetingPurposes = ["Introduction","Business context","Workflow understanding","Tool walkthrough","KPI review","Process mapping","AI opportunity discovery","Roadmap alignment","Follow-up"];
const priorityWeights = { Critical: 4, High: 3, Medium: 2, Low: 1 };

const defaultState = {
  activeTab:"overview", activeWeek:0, weeklyAgenda:"",
  maryReflection30:"",yulaAssessment30:"",maryReflection60:"",yulaAssessment60:"",maryReflection90:"",yulaAssessment90:"",
  roadmapNow:"",roadmapNext:"",roadmapLater:"",barcelonaNotes:"",maryNotes:"",yulaNotes:"",
  weeklyTasks:[
    {text:"Review the current week's onboarding priorities",done:false},
    {text:"Complete the key activities shown for the current week",done:false},
    {text:"Capture questions, observations and blockers",done:false},
    {text:"Prepare the weekly 1:1 agenda",done:false}
  ],
  weeks:[
    {title:"Week 1 · Foundation and enablement",dates:"Aug 11–17",focus:"Become operational, understand the basic organizational landscape, and prepare the learning and stakeholder plan.",
     outcomes:["All required access requests submitted and tracked","Basic understanding of the studio, portfolio, business units and leadership structure","Stakeholder meetings from Week 2 onward scheduled","Weekly meetings established with Yula and Shronger"],
     actions:[
      {text:"Secure access to ChatGPT Enterprise and Claude",done:false,category:"learning"},
      {text:"Secure access to Jira, Confluence, GitHub, Slack and shared drives",done:false,category:"learning"},
      {text:"Secure access to Looker and relevant business systems",done:false,category:"learning"},
      {text:"Identify the relevant dashboards and internal systems for the first games",done:false,category:"learning"},
      {text:"Review the studio structure, portfolio, business units and leadership structure",done:false,category:"learning"},
      {text:"Schedule stakeholder introductions beginning in Week 2",done:false,category:"relationships"},
      {text:"Set a weekly 1:1 with Yula",done:false,category:"relationships"},
      {text:"Set a weekly sync with Shronger, Director Gen AI",done:false,category:"relationships"}],
     notes:"",marySatisfaction:0,yulaSatisfaction:0,reflection:""},
    {title:"Week 2 · Initial immersion and guided exploration",dates:"Aug 18–24",focus:"Start meeting selected stakeholders, learn how the first game teams operate, and explore available tools and dashboards.",
     outcomes:["Initial stakeholder conversations completed","First game-team routines and decision flows observed","Core dashboards and business systems explored","Initial questions and learning gaps documented"],
     actions:[
      {text:"Join selected game-team daily or recurring syncs as an observer",done:false,category:"learning"},
      {text:"Meet the first prioritized stakeholders in the People tracker",done:false,category:"relationships"},
      {text:"Explore Looker dashboards for the first games",done:false,category:"learning"},
      {text:"Review the main operational and business systems used by those games",done:false,category:"learning"},
      {text:"Learn the basic business metrics used by each relevant function",done:false,category:"learning"},
      {text:"Document unclear processes, terminology and areas requiring follow-up",done:false,category:"discovery"}],
     notes:"",marySatisfaction:0,yulaSatisfaction:0,reflection:""},
    {title:"Week 3 · Broader immersion and Barcelona preparation",dates:"Aug 25–31",focus:"Broaden learning across teams, continue stakeholder meetings, and build the Barcelona agenda together with Yula.",
     outcomes:["Broader exposure to game and functional routines","A clearer map of tools, dashboards and business measures","Barcelona objectives and schedule prepared","Early exploration themes documented without premature prioritization"],
     actions:[
      {text:"Continue selected game-team dailies and functional syncs",done:false,category:"learning"},
      {text:"Continue prioritized stakeholder introductions",done:false,category:"relationships"},
      {text:"Map which tools and dashboards are used by each team or game",done:false,category:"learning"},
      {text:"Document basic business metrics relevant to Product, Analytics, Economy, Production, Community and VIP",done:false,category:"learning"},
      {text:"Build the Barcelona agenda and meeting schedule with Yula",done:false,category:"relationships"},
      {text:"Prepare context and questions for Barcelona introductions",done:false,category:"relationships"}],
     notes:"",marySatisfaction:0,yulaSatisfaction:0,reflection:""},
    {title:"Week 4 · Barcelona immersion and first synthesis",dates:"Sep 1–9",focus:"Use the Barcelona visit for high-value introductions, then synthesize the first month into a structured baseline.",
     outcomes:["Barcelona introductions completed and follow-ups captured","First-month organizational and workflow understanding summarized","Initial manual-effort, human-error and capacity-gap themes created","Initial AI opportunity backlog ready for validation"],
     actions:[
      {text:"Complete the Barcelona agenda and capture key takeaways",done:false,category:"relationships"},
      {text:"Follow up on introductions and open questions from the visit",done:false,category:"relationships"},
      {text:"Summarize the organization, workflows, tools, dashboards and business metrics learned",done:false,category:"learning"},
      {text:"Start mapping high-manual-effort processes",done:false,category:"discovery"},
      {text:"Start mapping processes exposed to frequent human error",done:false,category:"discovery"},
      {text:"Start mapping areas where limited capacity could be supported by automation",done:false,category:"discovery"},
      {text:"Create the initial structured AI opportunity backlog",done:false,category:"discovery"}],
     notes:"",marySatisfaction:0,yulaSatisfaction:0,reflection:""}
  ],
  deliverables30:["Access and tool-readiness tracker","Organizational, portfolio and leadership overview","Stakeholder map and meeting plan","Initial map of dashboards, systems and business metrics","First structured AI opportunity backlog","Barcelona agenda, notes and follow-up actions"],
  success30:[
    {text:"Mary has all critical access required to work effectively",mary:false,yula:false},
    {text:"Mary understands the studio structure, portfolio and core business units at a practical level",mary:false,yula:false},
    {text:"Mary has begun building relationships with priority stakeholders",mary:false,yula:false},
    {text:"Mary understands the basic metrics, dashboards and systems used by the first game teams",mary:false,yula:false},
    {text:"An initial opportunity backlog and discovery baseline exist",mary:false,yula:false}
  ],
  objectives60:[
    {text:"Create a consistent way to map AI-tool usage and workflow maturity across the portfolio",done:false,category:"discovery"},
    {text:"Establish recurring routines with the most relevant stakeholders",done:false,category:"relationships"},
    {text:"Map manual, time-consuming work that could be automated",done:false,category:"discovery"},
    {text:"Map processes with high human-error exposure or repeated rework",done:false,category:"discovery"},
    {text:"Map capacity gaps where automation could support teams",done:false,category:"discovery"},
    {text:"Validate and prioritize the opportunity backlog",done:false,category:"discovery"},
    {text:"Select and scope the first small-to-medium optimization",done:false,category:"delivery"}],
  deliverables60:["Portfolio-level tool-usage and AI-maturity mapping approach","Established stakeholder routines and working cadence","Validated opportunity backlog","Impact-versus-effort prioritization","Defined first solution scope, owner, dependencies and success measures","Initial delivery and adoption plan"],
  success60:[
    {text:"A repeatable portfolio discovery and mapping approach is in use",mary:false,yula:false},
    {text:"Recurring routines exist with the right stakeholders",mary:false,yula:false},
    {text:"The highest-value manual effort, human-error and capacity-gap themes are documented",mary:false,yula:false},
    {text:"The opportunity backlog is validated and prioritized",mary:false,yula:false},
    {text:"The first optimization is selected, scoped and ready for delivery",mary:false,yula:false}],
  objectives90:[
    {text:"Deliver the first practical AI optimization or validated pilot",done:false,category:"delivery"},
    {text:"Measure initial business value, user feedback and adoption",done:false,category:"delivery"},
    {text:"Document lessons learned and adjust the delivery approach",done:false,category:"delivery"},
    {text:"Complete a prioritized six-month backlog",done:false,category:"discovery"},
    {text:"Build and align a high-level roadmap covering delivery and organizational adoption",done:false,category:"delivery"},
    {text:"Define a repeatable intake, prioritization, delivery and knowledge-sharing process",done:false,category:"delivery"}],
  deliverables90:["First delivered AI optimization or validated pilot","Impact, feedback and lessons-learned summary","Prioritized six-month backlog","High-level roadmap for solutions, adoption and culture","Draft operating model for future AI initiatives","Knowledge-sharing and enablement cadence"],
  success90:[
    {text:"A practical AI optimization or validated pilot has been delivered",mary:false,yula:false},
    {text:"Initial value, feedback and adoption have been measured",mary:false,yula:false},
    {text:"The six-month backlog is prioritized and credible",mary:false,yula:false},
    {text:"The high-level roadmap is aligned with relevant leaders",mary:false,yula:false},
    {text:"A repeatable working model for continued AI transformation is defined",mary:false,yula:false}],
  people:[
    {name:"Yula Zack",role:"Manager",studio:"Studio",priority:"Critical",purpose:"Roadmap alignment",status:"Recurring",followUp:"Weekly",relationship:false,takeaways:""},
    {name:"Shronger",role:"Director, Gen AI",studio:"Central / Gen AI",priority:"Critical",purpose:"Roadmap alignment",status:"Recurring",followUp:"Weekly",relationship:false,takeaways:""}],
  barcelonaObjectives:[
    {text:"Build relationships with priority Barcelona-based stakeholders",done:false},
    {text:"Understand their business context, responsibilities and current ways of working",done:false},
    {text:"Gather context that will improve portfolio-level discovery after the visit",done:false}],
  barcelonaPrep:[
    {text:"Agree the priority people and groups with Yula",done:false},
    {text:"Define the purpose and expected outcome of each meeting",done:false},
    {text:"Prepare context, questions and relevant background",done:false},
    {text:"Leave time for synthesis and follow-up planning",done:false}],
  barcelonaMeetings:[],
  initiatives:[]
};

let state=structuredClone(defaultState),firebaseApi=null,unsubscribe=null,saveTimer=null;
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
function deepMerge(base,saved){if(Array.isArray(base))return Array.isArray(saved)?saved:base;if(base&&typeof base==="object"){const r={...base};Object.keys(saved||{}).forEach(k=>r[k]=k in base?deepMerge(base[k],saved[k]):saved[k]);return r}return saved===undefined?base:saved}
function loadLocal(){try{const s=localStorage.getItem(LOCAL_KEY);if(s)state=deepMerge(structuredClone(defaultState),JSON.parse(s))}catch(e){}}
function saveLocal(){localStorage.setItem(LOCAL_KEY,JSON.stringify(state));$("#saveStatus").textContent="Saved locally"}
function scheduleSave(){saveLocal();if(!firebaseApi?.auth.currentUser)return;clearTimeout(saveTimer);saveTimer=setTimeout(saveCloudNow,500)}
async function initFirebase(){if(!firebaseEnabled)return;const appM=await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),authM=await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js"),fsM=await import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js");const app=appM.initializeApp(firebaseConfig),auth=authM.getAuth(app),db=fsM.getFirestore(app),provider=new authM.GoogleAuthProvider(),docRef=fsM.doc(db,"workspaces",workspaceId);firebaseApi={authM,fsM,auth,db,provider,docRef};$("#signInBtn").classList.remove("hidden");$("#signInBtn").onclick=()=>authM.signInWithPopup(auth,provider);$("#signOutBtn").onclick=()=>authM.signOut(auth);authM.onAuthStateChanged(auth,user=>{if(unsubscribe){unsubscribe();unsubscribe=null}if(!user){$("#signInBtn").classList.remove("hidden");$("#signOutBtn").classList.add("hidden");$("#saveStatus").textContent="Sign in for shared saving";return}$("#signInBtn").classList.add("hidden");$("#signOutBtn").classList.remove("hidden");$("#saveStatus").textContent=`Connected: ${user.email}`;unsubscribe=fsM.onSnapshot(docRef,snap=>{if(snap.exists()){state=deepMerge(structuredClone(defaultState),snap.data());localStorage.setItem(LOCAL_KEY,JSON.stringify(state));renderAll()}else saveCloudNow()})})}
async function saveCloudNow(){if(!firebaseApi?.auth.currentUser)return;$("#saveStatus").textContent="Saving to Firebase…";await firebaseApi.fsM.setDoc(firebaseApi.docRef,{...state,updatedAt:firebaseApi.fsM.serverTimestamp()},{merge:true});$("#saveStatus").textContent="Saved to Firebase"}
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
function currentDay(){const t=new Date();t.setHours(0,0,0,0);return Math.floor((t-START_DATE)/86400000)+1}
function currentWeekIndex(){const d=currentDay();return d<1?0:Math.min(3,Math.floor((d-1)/7))}
function bindNav(){$$(".tab").forEach(b=>b.onclick=()=>{state.activeTab=b.dataset.tab;renderTabs();scheduleSave()});$$(".week-tab").forEach(b=>b.onclick=()=>{state.activeWeek=+b.dataset.week;renderWeek();scheduleSave()})}
function renderTabs(){$$(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===state.activeTab));$$(".panel").forEach(p=>p.classList.toggle("active",p.id===state.activeTab))}
function bindFields(){$$("[data-field]").forEach(f=>{const k=f.dataset.field;f.value=state[k]||"";f.oninput=e=>{state[k]=e.target.value;scheduleSave()}})}
function renderWeekly(){const idx=currentWeekIndex();$("#currentWeekTitle").textContent=state.weeks[idx].title;const root=$("#weeklyTasks");root.innerHTML="";const carry=[];for(let w=0;w<idx;w++)state.weeks[w].actions.forEach((a,i)=>{if(!a.done)carry.push({w,i,a})});const current=state.weeks[idx].actions.map((a,i)=>({w:idx,i,a}));[...carry,...current].forEach(({w,i,a})=>{const r=document.createElement("div");r.className="weekly-task";r.innerHTML=`<input type="checkbox" ${a.done?"checked":""}><input value="${esc(a.text)}"><button>×</button>`;const [cb,inp,del]=r.children;cb.onchange=e=>{state.weeks[w].actions[i].done=e.target.checked;updateProgress();renderWeekly();scheduleSave()};inp.oninput=e=>{state.weeks[w].actions[i].text=e.target.value;scheduleSave()};del.onclick=()=>{state.weeks[w].actions.splice(i,1);renderWeekly();updateProgress();scheduleSave()};root.appendChild(r)});state.weeklyTasks.forEach((a,i)=>{const r=document.createElement("div");r.className="weekly-task";r.innerHTML=`<input type="checkbox" ${a.done?"checked":""}><input value="${esc(a.text)}"><button>×</button>`;const[cb,inp,del]=r.children;cb.onchange=e=>{a.done=e.target.checked;updateProgress();scheduleSave()};inp.oninput=e=>{a.text=e.target.value;scheduleSave()};del.onclick=()=>{state.weeklyTasks.splice(i,1);renderWeekly();scheduleSave()};root.appendChild(r)})}
function ratingBlock(label,value,key){return `<div><label>${label}</label><div class="rating">${[1,2,3,4,5].map(n=>`<button data-rate="${key}" data-value="${n}" class="${value===n?"active":""}">${n}</button>`).join("")}</div></div>`}
function renderWeek(){const w=state.weeks[state.activeWeek];$$(".week-tab").forEach(b=>b.classList.toggle("active",+b.dataset.week===state.activeWeek));const root=$("#weekDetail");const carry=[];for(let x=0;x<state.activeWeek;x++)state.weeks[x].actions.forEach((a,i)=>{if(!a.done)carry.push({week:x,index:i,text:a.text})});root.innerHTML=`<div class="week-layout"><article class="week-summary"><p class="eyebrow">${w.dates}</p><h2>${w.title}</h2><p>${w.focus}</p><div class="section-label">Expected outcomes</div><ul class="standard-list">${w.outcomes.map(x=>`<li>${x}</li>`).join("")}</ul><div class="section-label">Week notes</div><textarea id="weekNotes">${esc(w.notes)}</textarea></article><article class="week-actions">${carry.length?`<div class="carryover"><strong>Automatically carried over</strong>${carry.map(c=>`<label class="task-row"><input type="checkbox" data-carry="${c.week}:${c.index}"><span>${c.text}</span></label>`).join("")}</div>`:""}<p class="eyebrow">Key activities</p>${w.actions.map((a,i)=>`<label class="task-row"><input type="checkbox" data-action="${i}" ${a.done?"checked":""}><span>${a.text}</span></label>`).join("")}</article></div><div class="week-reflection">${ratingBlock("Mary's satisfaction",w.marySatisfaction,"mary")}${ratingBlock("Yula's assessment",w.yulaSatisfaction,"yula")}<div><label>How did the week go?</label><textarea id="weekReflection" placeholder="What worked, what was challenging, and what should change next week?">${esc(w.reflection)}</textarea></div></div>`;$("#weekNotes").oninput=e=>{w.notes=e.target.value;scheduleSave()};$("#weekReflection").oninput=e=>{w.reflection=e.target.value;scheduleSave()};root.querySelectorAll("[data-action]").forEach(c=>c.onchange=e=>{w.actions[+e.target.dataset.action].done=e.target.checked;updateProgress();renderWeekly();scheduleSave()});root.querySelectorAll("[data-carry]").forEach(c=>c.onchange=e=>{const[a,b]=e.target.dataset.carry.split(":").map(Number);state.weeks[a].actions[b].done=e.target.checked;renderWeek();renderWeekly();updateProgress();scheduleSave()});root.querySelectorAll("[data-rate]").forEach(b=>b.onclick=()=>{if(b.dataset.rate==="mary")w.marySatisfaction=+b.dataset.value;else w.yulaSatisfaction=+b.dataset.value;renderWeek();scheduleSave()})}
function renderList(sel,arr){$(sel).innerHTML=arr.map(x=>`<li>${x}</li>`).join("")}
function renderCheckList(sel,arr){const r=$(sel);r.innerHTML="";arr.forEach((x,i)=>{const l=document.createElement("label");l.className="task-row";l.innerHTML=`<input type="checkbox" ${x.done?"checked":""}><span>${x.text}</span>`;l.querySelector("input").onchange=e=>{x.done=e.target.checked;updateProgress();scheduleSave()};r.appendChild(l)})}
function renderSuccess(sel,key){const r=$(sel);r.innerHTML="";state[key].forEach((x,i)=>{const d=document.createElement("div");d.className="success-row";d.innerHTML=`<span>${x.text}</span><label>Mary <input type="checkbox" data-who="mary" ${x.mary?"checked":""}></label><label>Yula <input type="checkbox" data-who="yula" ${x.yula?"checked":""}></label>`;d.querySelectorAll("input").forEach(c=>c.onchange=e=>{state[key][i][e.target.dataset.who]=e.target.checked;updateProgress();scheduleSave()});r.appendChild(d)})}
function inputCell(v,fn,type="text"){const td=document.createElement("td"),i=document.createElement("input");i.type=type;i.value=v||"";i.oninput=e=>{fn(e.target.value);scheduleSave()};td.appendChild(i);return td}
function selectCell(v,opts,fn){const td=document.createElement("td"),s=document.createElement("select");opts.forEach(o=>{const p=document.createElement("option");p.value=o;p.textContent=o;p.selected=o===v;s.appendChild(p)});s.onchange=e=>{fn(e.target.value);updateProgress();scheduleSave()};td.appendChild(s);return td}
function areaCell(v,fn){const td=document.createElement("td"),a=document.createElement("textarea");a.value=v||"";a.oninput=e=>{fn(e.target.value);scheduleSave()};td.appendChild(a);return td}
function deleteCell(coll,i,render){const td=document.createElement("td"),b=document.createElement("button");b.className="icon-button";b.textContent="×";b.onclick=()=>{state[coll].splice(i,1);render();updateProgress();scheduleSave()};td.appendChild(b);return td}
function checkCell(v,fn){const td=document.createElement("td"),c=document.createElement("input");c.type="checkbox";c.checked=!!v;c.onchange=e=>{fn(e.target.checked);updateProgress();scheduleSave()};td.appendChild(c);return td}
function renderPeople(){const b=$("#peopleBody");b.innerHTML="";state.people.forEach((p,i)=>{const tr=document.createElement("tr");tr.append(inputCell(p.name,v=>p.name=v),inputCell(p.role,v=>p.role=v),inputCell(p.studio,v=>p.studio=v),selectCell(p.priority,["Critical","High","Medium","Low"],v=>p.priority=v),selectCell(p.purpose,meetingPurposes,v=>p.purpose=v),selectCell(p.status,["Not scheduled","Scheduled","Completed","Recurring"],v=>p.status=v),selectCell(p.followUp,["No","Recommended","Required","Completed","Weekly","Monthly"],v=>p.followUp=v),checkCell(p.relationship,v=>p.relationship=v),areaCell(p.takeaways,v=>p.takeaways=v),deleteCell("people",i,renderPeople));b.appendChild(tr)})}
function renderEditable(sel,key){const r=$(sel);r.innerHTML="";state[key].forEach((x,i)=>{const l=document.createElement("label");l.className="task-row";l.innerHTML=`<input type="checkbox" ${x.done?"checked":""}><span>${x.text}</span>`;l.querySelector("input").onchange=e=>{x.done=e.target.checked;updateProgress();scheduleSave()};r.appendChild(l)})}
function renderBarcelona(){const b=$("#barcelonaBody");b.innerHTML="";state.barcelonaMeetings.forEach((m,i)=>{const tr=document.createElement("tr");tr.append(inputCell(m.date,v=>m.date=v,"date"),inputCell(m.time,v=>m.time=v,"time"),inputCell(m.person,v=>m.person=v),inputCell(m.objective,v=>m.objective=v),inputCell(m.location,v=>m.location=v),areaCell(m.preparation,v=>m.preparation=v),deleteCell("barcelonaMeetings",i,renderBarcelona));b.appendChild(tr)})}
function renderInitiatives(){const b=$("#initiativesBody");b.innerHTML="";state.initiatives.forEach((x,i)=>{const tr=document.createElement("tr");tr.append(inputCell(x.title,v=>x.title=v),inputCell(x.team,v=>x.team=v),selectCell(x.problemType,["Manual effort","Human error","Capacity gap","Knowledge access","Other"],v=>x.problemType=v),selectCell(x.estimatedTime,["< 1 week","1–2 weeks","3–4 weeks","1–2 months","3+ months"],v=>x.estimatedTime=v),selectCell(x.scope,["Single workflow","Single team","Multiple teams","Studio-wide","Portfolio-wide"],v=>x.scope=v),selectCell(x.type,["Quick Win","Project"],v=>x.type=v),selectCell(x.impact,["Low","Medium","High"],v=>x.impact=v),selectCell(x.priority,["Low","Medium","High"],v=>x.priority=v),selectCell(x.status,["Discovery","Validating","Planned","In progress","Delivered"],v=>x.status=v),areaCell(x.notes,v=>x.notes=v),deleteCell("initiatives",i,renderInitiatives));b.appendChild(tr)})}
function bindAdds(){$("#addWeeklyTaskBtn").onclick=()=>{state.weeklyTasks.push({text:"",done:false});renderWeekly();scheduleSave()};$("#addPersonBtn").onclick=()=>{state.people.push({name:"",role:"",studio:"",priority:"Medium",purpose:"Introduction",status:"Not scheduled",followUp:"No",relationship:false,takeaways:""});renderPeople();scheduleSave()};$("#addBarcelonaMeetingBtn").onclick=()=>{state.barcelonaMeetings.push({date:"2026-09-06",time:"",person:"",objective:"",location:"",preparation:""});renderBarcelona();scheduleSave()};$("#addInitiativeBtn").onclick=()=>{state.initiatives.push({title:"",team:"",problemType:"Manual effort",estimatedTime:"1–2 weeks",scope:"Single workflow",type:"Quick Win",impact:"Medium",priority:"Medium",status:"Discovery",notes:""});renderInitiatives();scheduleSave()}}
function pct(done,total){return total?Math.round(done/total*100):0}
function weightedStakeholderProgress(){const total=state.people.reduce((s,p)=>s+(priorityWeights[p.priority]||1),0);const complete=state.people.reduce((s,p)=>s+((["Completed","Recurring"].includes(p.status)&&p.relationship)?(priorityWeights[p.priority]||1):0),0);const relationshipPart=total?complete/total:0;const recurringTargets=state.people.filter(p=>["Weekly","Monthly"].includes(p.followUp));const recurringDone=recurringTargets.filter(p=>p.status==="Recurring").length;const cadencePart=recurringTargets.length?recurringDone/recurringTargets.length:0;return Math.round((relationshipPart*.8+cadencePart*.2)*100)}
function updateProgress(){const allWeek=state.weeks.flatMap(w=>w.actions),learning=allWeek.filter(x=>x.category==="learning"),discoveryBase=allWeek.filter(x=>x.category==="discovery"),deliveryBase=[...state.objectives60,...state.objectives90].filter(x=>x.category==="delivery");const learnPct=pct(learning.filter(x=>x.done).length,learning.length);const relPct=weightedStakeholderProgress();const initiativeDiscovery=state.initiatives.map(x=>x.status==="Delivered"?1:x.status==="In progress"?.8:x.status==="Planned"?.6:x.status==="Validating"?.4:x.status==="Discovery"?.1:0);const discoveryDone=discoveryBase.filter(x=>x.done).length+state.objectives60.filter(x=>x.category==="discovery"&&x.done).length+state.objectives90.filter(x=>x.category==="discovery"&&x.done).length+initiativeDiscovery.reduce((a,b)=>a+b,0);const discoveryTotal=discoveryBase.length+state.objectives60.filter(x=>x.category==="discovery").length+state.objectives90.filter(x=>x.category==="discovery").length+Math.max(state.initiatives.length,1);const discPct=Math.round(discoveryDone/discoveryTotal*100);const delivered=state.initiatives.filter(x=>x.status==="Delivered").length;const inProgress=state.initiatives.filter(x=>x.status==="In progress").length*.5;const deliveryDone=deliveryBase.filter(x=>x.done).length+delivered+inProgress;const deliveryTotal=deliveryBase.length+Math.max(state.initiatives.length,1);const delPct=Math.round(deliveryDone/deliveryTotal*100);const overall=Math.round((learnPct+relPct+discPct+delPct)/4);[["learning",learnPct],["relationships",relPct],["discovery",discPct],["delivery",delPct]].forEach(([k,v])=>{$(`#${k}Value`).textContent=`${v}%`;$(`#${k}Bar`).style.width=`${v}%`});$("#overallProgress").textContent=`${overall}%`;const d=currentDay();let phase="Pre-onboarding";if(d>=1&&d<=30)phase="30 Days";else if(d<=60&&d>30)phase="60 Days";else if(d<=90&&d>60)phase="90 Days";else if(d>90)phase="Quarter complete";$("#currentPhase").textContent=phase;$("#dayCounter").textContent=d<1?"Before start":d<=90?`Day ${d} of 90`:"90-day period complete"}
function renderAll(){renderTabs();renderWeekly();renderWeek();renderList("#deliverables30",state.deliverables30);renderSuccess("#success30","success30");renderCheckList("#objectives60",state.objectives60);renderList("#deliverables60",state.deliverables60);renderSuccess("#success60","success60");renderCheckList("#objectives90",state.objectives90);renderList("#deliverables90",state.deliverables90);renderSuccess("#success90","success90");renderPeople();renderEditable("#barcelonaObjectives","barcelonaObjectives");renderEditable("#barcelonaPrep","barcelonaPrep");renderBarcelona();renderInitiatives();bindFields();updateProgress()}
loadLocal();bindNav();bindAdds();renderAll();initFirebase().catch(()=>$("#saveStatus").textContent="Firebase setup error");
