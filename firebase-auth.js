import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import {
  browserSessionPersistence,
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
provider.setCustomParameters({ prompt: "select_account" });

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

// The workspace remains hidden until the user actively signs in on this page load.
let accessGranted = false;
let currentUser = null;

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

function lockWorkspace() {
  if (loginGate) loginGate.hidden = false;
  if (appShell) {
    appShell.hidden = true;
    appShell.classList.add("auth-hidden");
    appShell.setAttribute("aria-hidden", "true");
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
  setAuthMessage("Sign in with your Scopely Google account to continue.");
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
  setAuthMessage("Connected to Firebase");
}

async function handleSignIn() {
  if (signInButton) signInButton.disabled = true;
  if (gateSignInButton) gateSignInButton.disabled = true;
  setAuthMessage("Opening Google sign-in…");
  try {
    await setPersistence(auth, browserSessionPersistence);
    const result = await signInWithPopup(auth, provider);
    currentUser = result.user;
    unlockWorkspace(result.user);
  } catch (error) {
    console.error("Firebase sign-in failed", error);
    const friendlyMessage = error?.code === "auth/popup-closed-by-user"
      ? "Sign-in window was closed before completion."
      : error?.code === "auth/popup-blocked"
        ? "The browser blocked the sign-in window. Allow pop-ups and try again."
        : `Sign-in failed: ${error?.message || "Unknown error"}`;
    lockWorkspace();
    setAuthMessage(friendlyMessage, true);
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

// Hide the application immediately, before Firebase resolves any saved session.
lockWorkspace();

onAuthStateChanged(auth, (user) => {
  currentUser = user;

  // A remembered Firebase session does not bypass the login gate. The user must
  // actively use the Google sign-in button on each fresh page load.
  if (!user || !accessGranted) {
    showSignedOut();
  } else {
    unlockWorkspace(user);
  }

  window.dispatchEvent(new CustomEvent("workspace-auth-changed", {
    detail: {
      user: user ? {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      } : null,
      accessGranted
    }
  }));
});

export { app, auth };
