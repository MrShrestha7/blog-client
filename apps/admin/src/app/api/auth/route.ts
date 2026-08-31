import { cookies } from "next/headers";
import { signToken } from "../../../utils/auth";

export async function POST(request: Request) {
  const { password } = await request.json();

  if (password !== "123") {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = signToken({ role: "admin" });
  const cookieStore = await cookies();
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return Response.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  return Response.json({ ok: true });
}
