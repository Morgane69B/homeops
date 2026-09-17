import { redirect } from "next/navigation";
import { auth } from "@/auth";

/** Redirects non-admins away. Use at the top of every /admin page and server action. */
export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    redirect("/login?callbackUrl=/admin");
  }
  return session;
}
