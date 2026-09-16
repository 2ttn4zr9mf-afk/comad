"use client";

import { useEffect, useState } from "react";

type Guest = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string | null;
  email: string | null;
  fechaNacimiento: string | null;
  iglesia: string | null;
};

type Registration = {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
  iglesia: string;
  traeInvitado: boolean;
  emailEnviado: boolean;
  createdAt: string;
  guests: Guest[];
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registrations, setRegistrations] = useState<Registration[] | null>(
    null
  );
  const [expanded, setExpanded] = useState<string | null>(null);

  const loadData = async () => {
    const res = await fetch("/api/admin/registrations");
    if (res.status === 401) {
      setAuthenticated(false);
      return;
    }
    const data = await res.json();
    setRegistrations(data.registrations);
    setAuthenticated(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Contraseña incorrecta");
      return;
    }
    await loadData();
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm dark:bg-zinc-900"
        >
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Acceso admin
          </h1>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input mt-4 w-full"
          />
          {loginError && (
            <p className="mt-2 text-sm text-red-600">{loginError}</p>
          )}
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Inscripciones ({registrations?.length ?? 0})
          </h1>
          <a
            href="/api/admin/export"
            className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900"
          >
            Exportar CSV
          </a>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm dark:bg-zinc-900">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Teléfono</th>
                <th className="px-4 py-3">Iglesia</th>
                <th className="px-4 py-3">Invitados</th>
                <th className="px-4 py-3">Email enviado</th>
                <th className="px-4 py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {registrations?.map((r) => (
                <>
                  <tr
                    key={r.id}
                    className="cursor-pointer border-t border-zinc-100 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50"
                    onClick={() =>
                      setExpanded(expanded === r.id ? null : r.id)
                    }
                  >
                    <td className="px-4 py-3">
                      {r.nombre} {r.apellido}
                    </td>
                    <td className="px-4 py-3">{r.email}</td>
                    <td className="px-4 py-3">{r.telefono}</td>
                    <td className="px-4 py-3">{r.iglesia}</td>
                    <td className="px-4 py-3">{r.guests.length}</td>
                    <td className="px-4 py-3">
                      {r.emailEnviado ? "✅" : "❌"}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                  {expanded === r.id && r.guests.length > 0 && (
                    <tr className="bg-zinc-50 dark:bg-zinc-800/30">
                      <td colSpan={7} className="px-4 py-3">
                        <div className="flex flex-col gap-2">
                          {r.guests.map((g) => (
                            <div
                              key={g.id}
                              className="rounded-lg border border-zinc-200 px-3 py-2 text-xs dark:border-zinc-700"
                            >
                              <strong>
                                {g.nombre} {g.apellido}
                              </strong>{" "}
                              — {g.telefono || "sin teléfono"} —{" "}
                              {g.email || "sin email"} —{" "}
                              {g.iglesia || "sin iglesia"}
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
