import { credential } from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getAuth as getClientAuth, signInWithCustomToken } from "firebase/auth";
import { cookies } from "next/headers";
import serviceAccount from "./service.account.json";
import { firebaseConfig } from "../common";

export class FirebaseServer {
  private _auth: ReturnType<typeof getAuth>;

  public constructor() {
    if (!getApps().length) {
      initializeApp({
        credential: credential.cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key,
        }),
      });
    }

    this._auth = getAuth();
  }

  public async getInitialUser() {
    const session = cookies().get("__session");
    if (process.env.NODE_ENV === "development") {
      console.debug(`Cookies: `, cookies().getAll());
    }
    if (!session) return null;

    const decodedIdToken = await this._auth.verifySessionCookie(session.value);
    await this._initializeAuthenticatedApp(decodedIdToken.uid);
    const auth = getClientAuth();

    // handle revoked tokens
    const isRevoked = !(await this._auth
      .verifySessionCookie(session.value, true)
      .catch((e) => console.error(e.message)));
    if (isRevoked) return null;

    if (auth.currentUser?.uid !== decodedIdToken.uid) {
      const customToken = await this._auth
        .createCustomToken(decodedIdToken.uid)
        .catch((e) => console.error(e.message));

      if (!customToken) return null;

      await signInWithCustomToken(auth, customToken);
    }

    return auth.currentUser;
  }

  private async _initializeAuthenticatedApp(uid: string) {
    const random = Math.random().toString(36).split(".")[1];
    const appName = `authenticated-context:${uid}:${random}`;
    return initializeApp(firebaseConfig, appName);
  }
}

export const firebaseServer = new FirebaseServer();
