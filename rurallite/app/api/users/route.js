import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number(searchParams.get("limit")) || 10)
    );
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({
      success: true,
      data: users,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, role } = body || {};

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid 'name'" },
        { status: 400 }
      );
    }
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid 'email'" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: { name, email, role: role || "STUDENT" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      { success: true, message: "User created", data: user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
