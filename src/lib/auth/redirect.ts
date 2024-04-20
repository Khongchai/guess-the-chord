import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export class Redirect {
  public static ensureAuthenticated() {
    // if no session, redirect to "/"
    const session = cookies().get("__session");
    if (!session) {
      redirect("/");
    }
    return;
  }

  public static ensureUnauthenticated() {
    // if session, redirect to "/dashboard"
    const session = cookies().get("__session");
    if (session) {
      redirect("/dashboard");
    }
    return;
  }
}
