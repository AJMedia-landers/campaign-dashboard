import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Topbar from "@/components/Topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get("token")?.value;
  if (!token) redirect("/signin");

  return (
    <>
      <Topbar />
      <main>{children}</main>
    </>
  );
}
