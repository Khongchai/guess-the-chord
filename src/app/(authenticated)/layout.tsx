import { Redirect } from "@/lib/auth/redirect";

export default function Layout() {
  // TODO use middleware instead
  //   Redirect.ensureAuthenticated();

  return (
    <div>
      <h1>Layout</h1>
    </div>
  );
}
