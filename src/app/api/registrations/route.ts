import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registrationSchema } from "@/lib/schema";
import { sendPaymentEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const registration = await prisma.registration.create({
    data: {
      nombre: data.nombre,
      apellido: data.apellido,
      telefono: data.telefono,
      email: data.email,
      fechaNacimiento: new Date(data.fechaNacimiento),
      iglesia: data.iglesia,
      traeInvitado: data.traeInvitado,
      guests: {
        create: data.traeInvitado
          ? data.guests.map((g) => ({
              nombre: g.nombre,
              apellido: g.apellido,
              telefono: g.telefono || null,
              email: g.email || null,
              fechaNacimiento: g.fechaNacimiento
                ? new Date(g.fechaNacimiento)
                : null,
              iglesia: g.iglesia || null,
            }))
          : [],
      },
    },
  });

  try {
    const result = await sendPaymentEmail(data.email, data.nombre);
    if (!("skipped" in result)) {
      await prisma.registration.update({
        where: { id: registration.id },
        data: { emailEnviado: true },
      });
    }
  } catch (err) {
    console.error("Error enviando email:", err);
  }

  return NextResponse.json({ ok: true, id: registration.id });
}
