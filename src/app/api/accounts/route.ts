import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

const API = process.env.NEXT_PUBLIC_API_BASE!;

export async function GET(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const platform = req.nextUrl.searchParams.get("platform");
  const qs = platform ? `?platform=${encodeURIComponent(platform)}` : "";

  const res = await fetch(`${API}/api/accounts${qs}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const text = await res.text();
  let json: any;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return NextResponse.json(json, { status: res.status });
}
