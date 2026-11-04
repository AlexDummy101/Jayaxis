import nextEnv from "@next/env";
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const adminEmail = "jayaxiscompany@gmail.com";
const { loadEnvConfig } = nextEnv;

loadEnvConfig(process.cwd());

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID must be set in .env.local.");
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  throw new Error("Set GOOGLE_APPLICATION_CREDENTIALS to a Firebase service-account JSON file path.");
}

const app = getApps()[0] || initializeApp({
  credential: applicationDefault(),
  projectId
});

const auth = getAuth(app);

try {
  const user = await auth.getUserByEmail(adminEmail);
  const customClaims = user.customClaims || {};

  if (customClaims.admin === true) {
    console.log(`${adminEmail} already has the admin claim.`);
  } else {
    await auth.setCustomUserClaims(user.uid, { ...customClaims, admin: true });
    console.log(`Granted admin access to ${adminEmail}.`);
  }

  console.log("Sign out and sign back in to refresh the Firebase ID token.");
} catch (error) {
  if (error?.code === "auth/user-not-found") {
    throw new Error(`No Firebase Authentication user exists for ${adminEmail}. Create the account first.`);
  }
  throw error;
}