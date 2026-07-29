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

function setAuthMessage(message, isError = false) {
  if (authMessage) { authMessage.textContent = message; authMessage.classList.toggle("error", isError); }
  if (gateAuthMessage) { gateAuthMessage.textContent = message; gateAuthMessage.classList.toggle("error", isError); }
}

function showSignedOut() {
  signInButton.hidden = false;
  if (loginGate) loginGate.hidden = false;
  if (appShell) appShell.classList.add("auth-hidden");
  signedInUser.hidden = true;
  userName.textContent = "";
  userEmail.textContent = "";
  userAvatar.hidden = true;
  userAvatar.removeAttribute("src");
  setAuthMessage("Not signed in");
}

function showSignedIn(user) {
  signInButton.hidden = true;
  if (loginGate) loginGate.hidden = true;
  if (appShell) appShell.classList.remove("auth-hidden");
  signedInUser.hidden = false;
  userName.textContent = user.displayName || "Signed-in user";
  userEmail.textContent = user.email || "";
  if (user.photoURL) {
    userAvatar.src = user.photoURL;
    userAvatar.alt = `${user.displayName || "User"} profile photo`;
    userAvatar.hidden = false;
  } else {
    userAvatar.hidden = true;
    userAvatar.removeAttribute("src");
  }
  setAuthMessage("Connected to Firebase");
}

async function handleSignIn() {
  signInButton.disabled = true;
  if (gateSignInButton) gateSignInButton.disabled = true;
  setAuthMessage("Opening Google sign-in…");
  try {
    await setPersistence(auth, browserLocalPersistence);
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Firebase sign-in failed", error);
    const friendlyMessage = error?.code === "auth/popup-closed-by-user"
      ? "Sign-in window was closed before completion."
      : error?.code === "auth/popup-blocked"
        ? "The browser blocked the sign-in window. Allow pop-ups and try again."
        : `Sign-in failed: ${error?.message || "Unknown error"}`;
    setAuthMessage(friendlyMessage, true);
  } finally {
    signInButton.disabled = false;
    if (gateSignInButton) gateSignInButton.disabled = false;
  }
}

async function handleSignOut() {
  signOutButton.disabled = true;
  setAuthMessage("Signing out…");
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Firebase sign-out failed", error);
    setAuthMessage(`Sign-out failed: ${error?.message || "Unknown error"}`, true);
  } finally {
    signOutButton.disabled = false;
  }
}

signInButton?.addEventListener("click", handleSignIn);
gateSignInButton?.addEventListener("click", handleSignIn);
signOutButton?.addEventListener("click", handleSignOut);

onAuthStateChanged(auth, (user) => {
  if (user) {
    showSignedIn(user);
  } else {
    showSignedOut();
  }

  window.dispatchEvent(new CustomEvent("workspace-auth-changed", {
    detail: {
      user: user ? {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL
      } : null
    }
  }));
});

export { app, auth };
