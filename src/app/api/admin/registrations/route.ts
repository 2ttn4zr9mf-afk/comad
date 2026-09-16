import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const registrations = await prisma.registration.findMany({
    include: { guests: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ registrations });
}
