import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { browserLocalPersistence, getAuth, GoogleAuthProvider, onAuthStateChanged, setPersistence, signInWithPopup, signOut } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { collection, getDocs, getFirestore, query, where } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
const roles=[
 {id:"ai-transformation-lead",name:"AI Transformation Lead",category:"Leadership & Transformation",status:"Ready",description:"AI strategy, delivery and enablement."},
 {id:"data-analyst",name:"Data Analyst",category:"Analytics",status:"Ready",description:"Analytics, insights and decision support."},
 {id:"data-scientist",name:"Data Scientist",category:"Analytics",status:"Coming Soon",description:"Advanced modeling and experimentation."},
 {id:"bi-analyst",name:"BI Analyst",category:"Analytics",status:"Coming Soon",description:"Reporting and business intelligence."},
 {id:"product-manager",name:"Product Manager",category:"Product",status:"Coming Soon",description:"Product strategy and execution."},
 {id:"producer",name:"Producer",category:"Product",status:"Coming Soon",description:"Delivery planning and coordination."},
 {id:"monetization-manager",name:"Monetization Manager",category:"Monetization & Economy",status:"Ready",description:"Pricing, offers, LiveOps and growth."},
 {id:"economy-manager",name:"Economy Manager",category:"Monetization & Economy",status:"Coming Soon",description:"Game economy strategy."},
 {id:"liveops-manager",name:"LiveOps Manager",category:"Live Operations",status:"Coming Soon",description:"Live events and player engagement."},
 {id:"crm-manager",name:"CRM Manager",category:"Marketing & Player Engagement",status:"Coming Soon",description:"Lifecycle and player communication."},
 {id:"user-acquisition-manager",name:"User Acquisition Manager",category:"Marketing & Player Engagement",status:"Coming Soon",description:"Growth and acquisition."},
 {id:"community-manager",name:"Community Manager",category:"Marketing & Player Engagement",status:"Coming Soon",description:"Community and player voice."},
 {id:"engineering-manager",name:"Engineering Manager",category:"Engineering & Quality",status:"Coming Soon",description:"Engineering leadership."},
 {id:"qa-manager",name:"QA Manager",category:"Engineering & Quality",status:"Coming Soon",description:"Quality strategy and delivery."}
];
// Use the same default app as the Hub, template and assignment screens.
// A named app creates a separate persisted login and makes the user sign in again.
const app=initializeApp(firebaseConfig),auth=getAuth(app),db=getFirestore(app),provider=new GoogleAuthProvider();provider.setCustomParameters({hd:"scopely.com"});
const $=id=>document.getElementById(id);let currentUser=null;
const allowed=user=>Boolean(user?.email?.toLowerCase().endsWith("@scopely.com"));
function render(){const search=$("roleSearch").value.trim().toLowerCase(),filtered=roles.filter(role=>`${role.name} ${role.category} ${role.description}`.toLowerCase().includes(search)),root=$("roleList");$("roleResultCount").textContent=`${filtered.length} roles available`;root.innerHTML="";let category="";filtered.forEach(role=>{if(role.category!==category){category=role.category;const label=document.createElement("div");label.className="role-category";label.textContent=category;root.appendChild(label)}const button=document.createElement("button");button.type="button";button.className="role-option";button.disabled=role.status!=="Ready";button.setAttribute("role","option");button.setAttribute("aria-disabled",String(button.disabled));button.innerHTML=`<span><h3>${role.name}</h3><p>${role.description}</p></span><span class="role-status ${button.disabled?"soon":""}">${role.status}</span>`;if(!button.disabled)button.onclick=()=>openRole(role);root.appendChild(button)});if(!filtered.length)root.innerHTML='<p class="picker-caption">No roles match your search.</p>'}
async function openRole(role){const button=[...document.querySelectorAll(".role-option")].find(node=>node.querySelector("h3")?.textContent===role.name);if(button){button.disabled=true;button.querySelector(".role-status").textContent="Opening…"}try{const snapshot=await getDocs(query(collection(db,"managerTemplates"),where("ownerUserId","==",currentUser.uid)));const templates=snapshot.docs.map(doc=>({id:doc.id,...doc.data()})).filter(template=>template.sourceTemplateId===role.id).sort((a,b)=>(b.updatedAt?.seconds||0)-(a.updatedAt?.seconds||0));/* A manager's own draft opens directly in full edit mode. */const target=templates[0]?`index.html?managerTemplate=${encodeURIComponent(templates[0].id)}`:`index.html?template=${encodeURIComponent(role.id)}`;location.assign(target)}catch(error){console.error(error);location.assign(`index.html?template=${encodeURIComponent(role.id)}`)}}
$("roleSearch").addEventListener("input",render);$("signInButton").onclick=async()=>{try{await setPersistence(auth,browserLocalPersistence);const result=await signInWithPopup(auth,provider);if(!allowed(result.user)){await signOut(auth);throw new Error("Please use a Scopely account.")}}catch(error){$("loginMessage").textContent=error.message||"Sign-in failed."}};
onAuthStateChanged(auth,user=>{if(!allowed(user)){$("loginGate").hidden=false;return}currentUser=user;$("loginGate").hidden=true;$("app").hidden=false;$("userName").textContent=user.displayName||"Scopely user";$("userEmail").textContent=user.email||"";render()});
