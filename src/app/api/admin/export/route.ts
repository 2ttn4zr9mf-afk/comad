import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
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

  const inscritosRows = registrations.map((r) => ({
    Nombre: r.nombre,
    Apellido: r.apellido,
    Teléfono: r.telefono,
    Email: r.email,
    "Fecha de nacimiento": r.fechaNacimiento.toISOString().slice(0, 10),
    Iglesia: r.iglesia,
    "Trae invitado": r.traeInvitado ? "Sí" : "No",
    "Nº invitados": r.guests.length,
    "Email enviado": r.emailEnviado ? "Sí" : "No",
    "Fecha de inscripción": r.createdAt.toISOString().slice(0, 10),
  }));

  const invitadosRows = registrations.flatMap((r) =>
    r.guests.map((g) => ({
      Nombre: g.nombre,
      Apellido: g.apellido,
      Teléfono: g.telefono ?? "",
      Email: g.email ?? "",
      "Fecha de nacimiento": g.fechaNacimiento
        ? g.fechaNacimiento.toISOString().slice(0, 10)
        : "",
      Iglesia: g.iglesia ?? "",
      "Inscrito por": `${r.nombre} ${r.apellido}`,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(inscritosRows),
    "Inscritos"
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(invitadosRows),
    "Invitados"
  );

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="inscripciones.xlsx"`,
    },
  });
}
