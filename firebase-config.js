export const firebaseConfig = {
  apiKey: "AIzaSyDYJyGuFwChZ9bmcgY6fPHv3z4YprmWRTE",
  authDomain: "lgp-ai-lab-dev.firebaseapp.com",
  projectId: "lgp-ai-lab-dev",
  storageBucket: "lgp-ai-lab-dev.firebasestorage.app",
  messagingSenderId: "1031757295695",
  appId: "1:1031757295695:web:e9eaa8d7599f5ffc863a3a",
  measurementId: "G-JFJKB10KLZ"
};

// Temporary compatibility identifier for the existing Mary Journey. New Journey
// routing will read the workspace ID from the URL in a later sprint.
export const maryWorkspaceId = "9dc23f8e-8b42-4a75-b7d2-91b3f1df46ad";
export const workspaceId = maryWorkspaceId;

// Sprint 1: the Hub is intentionally limited to one administrator.
// Firestore rules enforce this server-side; this value is only used for UI state.
export const hubAdminEmail = "yula.zack@scopely.com";

export const initialWorkspaceMetadata = {
  employeeName: "Mary Fisher",
  roleTitle: "AI Transformation Lead",
  managerName: "Yula Zack",
  startDate: "2026-08-11",
  status: "Active",
  template: "AI Transformation Lead – First 90 Days"
};
