import prisma from "../../../../lib/prisma";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";

export async function GET(_req, { params }) {
  try {
    const id = Number(params.id);
    if (!id)
      return sendError("Invalid id", ERROR_CODES.VALIDATION_ERROR, 400);

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
      return sendError("Not found", ERROR_CODES.NOT_FOUND, 404);

    return sendSuccess(user, "User fetched successfully", 200);
  } catch (error) {
    return sendError("User fetch failed", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}

export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    if (!id)
      return sendError("Invalid id", ERROR_CODES.VALIDATION_ERROR, 400);

    const body = await req.json();
    const { name, role } = body || {};
    if (!name && !role) {
      return sendError("Provide fields to update", ERROR_CODES.VALIDATION_ERROR, 400);
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

    return sendSuccess(updated, "User updated", 200);
  } catch (error) {
    if (error?.code === "P2025") {
      return sendError("Not found", ERROR_CODES.NOT_FOUND, 404, error?.message ?? error);
    }
    return sendError("User update failed", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}

export async function DELETE(_req, { params }) {
  try {
    const id = Number(params.id);
    if (!id)
      return sendError("Invalid id", ERROR_CODES.VALIDATION_ERROR, 400);

    await prisma.user.delete({ where: { id } });
    return sendSuccess(null, "User deleted", 200);
  } catch (error) {
    if (error?.code === "P2025") {
      return sendError("Not found", ERROR_CODES.NOT_FOUND, 404, error?.message ?? error);
    }
    return sendError("User deletion failed", ERROR_CODES.INTERNAL_ERROR, 500, error?.message ?? error);
  }
}
