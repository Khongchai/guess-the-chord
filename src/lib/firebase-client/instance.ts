import { Analytics, getAnalytics } from "firebase/analytics";
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  GoogleAuthProvider,
  User,
  browserSessionPersistence,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { firebaseConfig } from "../common";

/**
 * One huge class doesn't work lol.
 */
export class FirebaseSdk {
  private _app: FirebaseApp;
  private _analytics?: Analytics;
  private _auth: Auth;

  public constructor() {
    if (Object.values(firebaseConfig).some((value) => !value)) {
      throw new Error("Missing Firebase environment variables");
    }

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    this._app = app;
    this._auth = getAuth(app);
    this._auth.setPersistence(browserSessionPersistence);
    this._analytics =
      typeof window !== "undefined" ? getAnalytics(app) : undefined;
  }

  public signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this._auth, provider);
  }

  public async signOut() {
    try {
      await this._auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  public onAuthStateChanged(
    callback: Parameters<Auth["onAuthStateChanged"]>[0]
  ) {
    return onAuthStateChanged(this._auth, callback);
  }

  public get user(): User | null {
    return this._auth.currentUser;
  }
}

export const firebaseClient = new FirebaseSdk();
