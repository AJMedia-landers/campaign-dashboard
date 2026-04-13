import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/signin");

  return <>{children}</>;
}
