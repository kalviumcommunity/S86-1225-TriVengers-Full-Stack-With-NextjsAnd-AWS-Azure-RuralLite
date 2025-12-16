import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_req, { params }) {
  try {
    const id = Number(params.id);
    if (!id)
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 }
      );

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user)
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    if (!id)
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 }
      );

    const body = await req.json();
    const { name, role } = body || {};
    if (!name && !role) {
      return NextResponse.json(
        { success: false, error: "Provide fields to update" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(role ? { role } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "User updated",
      data: updated,
    });
  } catch (error) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const id = Number(params.id);
    if (!id)
      return NextResponse.json(
        { success: false, error: "Invalid id" },
        { status: 400 }
      );

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "User deleted" });
  } catch (error) {
    if (error?.code === "P2025") {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
