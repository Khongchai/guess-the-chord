import { ReactNode } from "react";
import { firebaseServer } from "../firebase-server/instance";
import { AuthProviderClient } from "./AuthProvider.client";

export const AuthProviderServer = async (props: { children: ReactNode }) => {
  const user = await firebaseServer.getInitialUser();
  return (
    <AuthProviderClient initialUser={user}>{props.children}</AuthProviderClient>
  );
};
