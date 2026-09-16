import { z } from "zod";

export const guestSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  apellido: z.string().min(1, "Requerido"),
  telefono: z.string().optional(),
  email: z.string().email("Email no válido").optional().or(z.literal("")),
  fechaNacimiento: z.string().optional().or(z.literal("")),
  iglesia: z.string().optional(),
});

export const registrationSchema = z.object({
  nombre: z.string().min(1, "Requerido"),
  apellido: z.string().min(1, "Requerido"),
  telefono: z.string().min(1, "Requerido"),
  email: z.string().email("Email no válido"),
  fechaNacimiento: z.string().min(1, "Requerido"),
  iglesia: z.string().min(1, "Requerido"),
  traeInvitado: z.boolean(),
  guests: z.array(guestSchema).default([]),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type GuestInput = z.infer<typeof guestSchema>;
