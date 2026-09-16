import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const registrations = await prisma.registration.findMany({
    include: { guests: true },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "tipo",
    "nombre",
    "apellido",
    "telefono",
    "email",
    "fecha_nacimiento",
    "iglesia",
    "trae_invitado",
    "email_enviado",
    "fecha_inscripcion",
    "inscrito_padre",
  ];

  const rows: string[] = [headers.join(",")];

  for (const r of registrations) {
    rows.push(
      [
        "inscrito",
        r.nombre,
        r.apellido,
        r.telefono,
        r.email,
        r.fechaNacimiento.toISOString().slice(0, 10),
        r.iglesia,
        r.traeInvitado ? "si" : "no",
        r.emailEnviado ? "si" : "no",
        r.createdAt.toISOString(),
        "",
      ]
        .map((v) => csvEscape(String(v)))
        .join(",")
    );

    for (const g of r.guests) {
      rows.push(
        [
          "invitado",
          g.nombre,
          g.apellido,
          g.telefono ?? "",
          g.email ?? "",
          g.fechaNacimiento ? g.fechaNacimiento.toISOString().slice(0, 10) : "",
          g.iglesia ?? "",
          "",
          "",
          "",
          `${r.nombre} ${r.apellido}`,
        ]
          .map((v) => csvEscape(String(v)))
          .join(",")
      );
    }
  }

  const csv = rows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscripciones.csv"`,
    },
  });
}
