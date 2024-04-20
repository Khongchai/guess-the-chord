import { AuthForm } from "@/components/AuthForm";
import { Redirect } from "@/lib/auth/redirect";

/**
 * Using home page as the login page.
 */
export default function Home() {
  // TODO use middleware instead
  Redirect.ensureUnauthenticated();
  return <AuthForm />;
}
