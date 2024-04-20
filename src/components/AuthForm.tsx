"use client";

import { firebaseClient } from "@/lib/firebase-client/instance";
import { Button } from "./Button";
import { Logo } from "./Logo";

export const AuthForm = () => {
  return (
    <div className="flex min-h-full flex-col  justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <Logo className="mx-auto h-20 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className={"space-y-6"}>
          <Button
            onClick={firebaseClient.signInWithGoogle.bind(firebaseClient)}
          >
            Sign in with Google
          </Button>
        </form>
      </div>
    </div>
  );
};
