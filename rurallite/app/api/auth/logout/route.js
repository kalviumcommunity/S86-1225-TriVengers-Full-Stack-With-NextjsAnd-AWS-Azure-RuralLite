import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json(
    {
      success: true,
      message: "Logged out",
      data: null,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );

  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set("token", "", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}
