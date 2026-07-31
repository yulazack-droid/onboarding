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
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ hd: "scopely.com" });

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");
const signedInUser = document.getElementById("signedInUser");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userAvatar = document.getElementById("userAvatar");
const authMessage = document.getElementById("authMessage");
const gateSignInButton = document.getElementById("gateSignInButton");
const gateAuthMessage = document.getElementById("gateAuthMessage");
const loginGate = document.getElementById("loginGate");
const appShell = document.getElementById("appShell");
const overviewDayMessage = document.getElementById("overviewDayMessage");

let accessGranted = false;
let currentUser = null;
let authResolved = false;

function isScopelyUser(user) {
  return Boolean(user?.email && user.email.toLowerCase().endsWith("@scopely.com"));
}

function setJourneyMessage() {
  if (!overviewDayMessage) return;
  const start = new Date("2026-08-11T00:00:00");
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const difference = Math.round((today - start) / 86400000);
  if (difference < 0) {
    const days = Math.abs(difference);
    overviewDayMessage.textContent = `Your first day is in ${days} day${days === 1 ? "" : "s"}.`;
  } else {
    overviewDayMessage.textContent = `Today is day ${difference + 1} of your journey here.`;
  }
}

function setAuthMessage(message, isError = false) {
  if (authMessage) {
    authMessage.textContent = message;
    authMessage.classList.toggle("error", isError);
  }
  if (gateAuthMessage) {
    gateAuthMessage.textContent = message;
    gateAuthMessage.classList.toggle("error", isError);
  }
}

function dispatchAuth(user, granted) {
  window.dispatchEvent(new CustomEvent("workspace-auth-changed", {
    detail: {
      user: user && granted ? {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      } : null,
      accessGranted: Boolean(granted)
    }
  }));
}

function lockWorkspace() {
  accessGranted = false;
  if (loginGate) loginGate.hidden = !authResolved;
  if (appShell) {
    appShell.hidden = true;
    appShell.classList.add("auth-hidden");
    appShell.setAttribute("aria-hidden", "true");
  }
}

function showSignedInUser(user) {
  if (signInButton) signInButton.hidden = true;
  if (signedInUser) signedInUser.hidden = false;
  if (userName) userName.textContent = user.displayName || "Signed-in user";
  if (userEmail) userEmail.textContent = user.email || "";
  if (userAvatar && user.photoURL) {
    userAvatar.src = user.photoURL;
    userAvatar.alt = `${user.displayName || "User"} profile photo`;
    userAvatar.hidden = false;
  } else if (userAvatar) {
    userAvatar.hidden = true;
    userAvatar.removeAttribute("src");
  }
}

function unlockWorkspace(user) {
  accessGranted = true;
  if (loginGate) loginGate.hidden = true;
  if (appShell) {
    appShell.hidden = false;
    appShell.classList.remove("auth-hidden");
    appShell.setAttribute("aria-hidden", "false");
  }
  showSignedInUser(user);
  setAuthMessage("");
  dispatchAuth(user, true);
}

function showSignedOut() {
  lockWorkspace();
  if (signInButton) signInButton.hidden = false;
  if (signedInUser) signedInUser.hidden = true;
  if (userName) userName.textContent = "";
  if (userEmail) userEmail.textContent = "";
  if (userAvatar) {
    userAvatar.hidden = true;
    userAvatar.removeAttribute("src");
  }
  if (gateSignInButton) gateSignInButton.textContent = "Sign in with Google";
  setAuthMessage("Use your Scopely Google account to continue.");
  dispatchAuth(null, false);
}

async function handleSignIn() {
  if (signInButton) signInButton.disabled = true;
  if (gateSignInButton) gateSignInButton.disabled = true;
  setAuthMessage(currentUser ? "Opening workspace…" : "Connecting to Google…");

  try {
    // If Firebase already has a valid session, the explicit Continue click opens the app
    // without forcing a second popup. A new browser/session still receives the Google popup.
    if (currentUser) {
      if (!isScopelyUser(currentUser)) {
        await signOut(auth);
        throw new Error("Please sign in with a Scopely account.");
      }
      unlockWorkspace(currentUser);
      return;
    }

    await setPersistence(auth, browserLocalPersistence);
    const result = await signInWithPopup(auth, provider);
    currentUser = result.user;

    if (!isScopelyUser(currentUser)) {
      await signOut(auth);
      currentUser = null;
      throw new Error("Please sign in with a Scopely account.");
    }

    unlockWorkspace(currentUser);
  } catch (error) {
    console.error("Firebase sign-in failed", error);
    let friendlyMessage;
    if (error?.code === "auth/popup-closed-by-user") {
      friendlyMessage = "The sign-in window was closed. Please try again.";
    } else if (error?.code === "auth/popup-blocked") {
      friendlyMessage = "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.";
    } else if (error?.code === "auth/cancelled-popup-request") {
      friendlyMessage = "Another sign-in attempt was already open. Please try once more.";
    } else if (error?.code === "auth/unauthorized-domain") {
      friendlyMessage = "This website is not yet authorized in Firebase Authentication.";
    } else {
      friendlyMessage = error?.message || "Sign-in failed. Please try again.";
    }
    lockWorkspace();
    setAuthMessage(friendlyMessage, true);
    dispatchAuth(null, false);
  } finally {
    if (signInButton) signInButton.disabled = false;
    if (gateSignInButton) gateSignInButton.disabled = false;
  }
}

async function handleSignOut() {
  if (signOutButton) signOutButton.disabled = true;
  setAuthMessage("Signing out…");
  try {
    accessGranted = false;
    currentUser = null;
    await signOut(auth);
    showSignedOut();
  } catch (error) {
    console.error("Firebase sign-out failed", error);
    setAuthMessage(`Sign-out failed: ${error?.message || "Unknown error"}`, true);
  } finally {
    if (signOutButton) signOutButton.disabled = false;
  }
}

signInButton?.addEventListener("click", handleSignIn);
gateSignInButton?.addEventListener("click", handleSignIn);
signOutButton?.addEventListener("click", handleSignOut);

setJourneyMessage();
lockWorkspace();

onAuthStateChanged(auth, (user) => {
  authResolved = true;
  currentUser = user;

  if (!user) {
    showSignedOut();
    return;
  }

  if (!isScopelyUser(user)) {
    showSignedOut();
    setAuthMessage("Please sign in with a Scopely account.", true);
    return;
  }

  // A persisted, verified Scopely session should restore the Journey directly
  // after refresh. New sessions still use the Google sign-in gate.
  unlockWorkspace(user);
});

export { app, auth };
