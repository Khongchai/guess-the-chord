"use client";

import {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import { firebaseClient } from "../firebase-client/instance";
import { User } from "firebase/auth";
import { useRouter } from "next/navigation";

export const AuthContext = createContext<{ user: User | null }>({ user: null });

export function AuthProviderClient({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const router = useRouter();

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => {
    return firebaseClient.onAuthStateChanged(async (user) => {
      if (!user) {
        setUser(null);
      } else {
        setUser(user);
      }
      router.refresh();
    });
  }, [setUser]);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebaseClient.user;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
