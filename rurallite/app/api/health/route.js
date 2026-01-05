import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { status: "fail" },
    { status: 500 }
  );
}
