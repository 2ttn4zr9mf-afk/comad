import { NextRequest, NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
