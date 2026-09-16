import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";

export async function isAdminAuthenticated() {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === "ok";
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(COOKIE_NAME, "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
