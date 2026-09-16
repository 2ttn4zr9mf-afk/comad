"use client";

import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type GuestForm = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  iglesia: string;
};

type FormValues = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  iglesia: string;
  traeInvitado: boolean;
  guests: GuestForm[];
};

const emptyGuest: GuestForm = {
  nombre: "",
  apellido: "",
  telefono: "",
  email: "",
  fechaNacimiento: "",
  iglesia: "",
};

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      fechaNacimiento: "",
      iglesia: "",
      traeInvitado: false,
      guests: [],
    },
  });

  const traeInvitado = watch("traeInvitado");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guests",
  });

  const onSubmit = async (values: FormValues) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          guests: values.traeInvitado ? values.guests : [],
        }),
      });

      if (!res.ok) throw new Error("Error al enviar");

      setStatus("sent");
      reset();
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            ¡Inscripción recibida!
          </h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Te hemos enviado un correo con los métodos de pago disponibles.
            Revisa tu bandeja de entrada (y spam).
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 rounded-full bg-zinc-900 px-5 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Hacer otra inscripción
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-sm dark:bg-zinc-900 sm:p-10">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Formulario de inscripción
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Completa tus datos. Tras enviar el formulario recibirás un correo
          con los métodos de pago.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-6"
        >
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre" error={errors.nombre?.message}>
              <input
                className="input"
                {...register("nombre", { required: "Requerido" })}
              />
            </Field>
            <Field label="Apellido" error={errors.apellido?.message}>
              <input
                className="input"
                {...register("apellido", { required: "Requerido" })}
              />
            </Field>
            <Field label="Teléfono" error={errors.telefono?.message}>
              <input
                type="tel"
                className="input"
                {...register("telefono", { required: "Requerido" })}
              />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input
                type="email"
                className="input"
                {...register("email", { required: "Requerido" })}
              />
            </Field>
            <Field
              label="Fecha de nacimiento"
              error={errors.fechaNacimiento?.message}
            >
              <input
                type="date"
                className="input"
                {...register("fechaNacimiento", { required: "Requerido" })}
              />
            </Field>
            <Field label="Iglesia" error={errors.iglesia?.message}>
              <input
                className="input"
                {...register("iglesia", { required: "Requerido" })}
              />
            </Field>
          </section>

          <section>
            <label className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300"
                {...register("traeInvitado")}
              />
              ¿Traerás invitado/s?
            </label>
          </section>

          {traeInvitado && (
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                  Invitados
                </h2>
                <button
                  type="button"
                  onClick={() => append(emptyGuest)}
                  className="rounded-full border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
                >
                  + Añadir invitado
                </button>
              </div>

              {fields.length === 0 && (
                <p className="text-sm text-zinc-500">
                  Añade al menos un invitado.
                </p>
              )}

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Invitado {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field
                      label="Nombre"
                      error={errors.guests?.[index]?.nombre?.message}
                    >
                      <input
                        className="input"
                        {...register(`guests.${index}.nombre`, {
                          required: "Requerido",
                        })}
                      />
                    </Field>
                    <Field
                      label="Apellido"
                      error={errors.guests?.[index]?.apellido?.message}
                    >
                      <input
                        className="input"
                        {...register(`guests.${index}.apellido`, {
                          required: "Requerido",
                        })}
                      />
                    </Field>
                    <Field label="Teléfono">
                      <input
                        type="tel"
                        className="input"
                        {...register(`guests.${index}.telefono`)}
                      />
                    </Field>
                    <Field label="Email">
                      <input
                        type="email"
                        className="input"
                        {...register(`guests.${index}.email`)}
                      />
                    </Field>
                    <Field label="Fecha de nacimiento">
                      <input
                        type="date"
                        className="input"
                        {...register(`guests.${index}.fechaNacimiento`)}
                      />
                    </Field>
                    <Field label="Iglesia">
                      <input
                        className="input"
                        {...register(`guests.${index}.iglesia`)}
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </section>
          )}

          {status === "error" && (
            <p className="text-sm text-red-600">
              Ha ocurrido un error al enviar la inscripción. Inténtalo de
              nuevo.
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || status === "sending"}
            className="mt-2 rounded-full bg-zinc-900 px-6 py-3 font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900"
          >
            {status === "sending" ? "Enviando..." : "Enviar inscripción"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </label>
  );
}
