import { getCollection } from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";
import { sendSuccess, sendError } from "../../../../lib/responseHandler";
import { ERROR_CODES } from "../../../../lib/errorCodes";
import { userUpdateSchema } from "../../../../lib/schemas/userSchema";
import { ZodError } from "zod";

export async function GET(_req, { params }) {
  try {
    const id = params.id;
    if (!id || !ObjectId.isValid(id)) {
      return sendError("Invalid id", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    const usersCollection = await getCollection("users");
    const user = await usersCollection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );

    if (!user) return sendError("Not found", ERROR_CODES.NOT_FOUND, 404);

    return sendSuccess(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      "User fetched successfully",
      200
    );
  } catch (error) {
    return sendError(
      "User fetch failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}

export async function PUT(req, { params }) {
  try {
    const id = params.id;
    if (!id || !ObjectId.isValid(id)) {
      return sendError("Invalid id", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    const body = await req.json();
    try {
      const data = userUpdateSchema.parse(body);
      if (!data || Object.keys(data).length === 0) {
        return sendError(
          "Provide fields to update",
          ERROR_CODES.VALIDATION_ERROR,
          400
        );
      }

      const updateData = {
        ...(data.name ? { name: data.name } : {}),
        ...(data.role ? { role: data.role } : {}),
        updatedAt: new Date(),
      };

      const usersCollection = await getCollection("users");
      const result = await usersCollection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: updateData },
        { returnDocument: "after", projection: { password: 0 } }
      );

      if (!result) {
        return sendError("Not found", ERROR_CODES.NOT_FOUND, 404);
      }

      return sendSuccess(
        {
          id: result._id.toString(),
          name: result.name,
          email: result.email,
          role: result.role,
          createdAt: result.createdAt,
        },
        "User updated",
        200
      );
    } catch (err) {
      if (err instanceof ZodError) {
        return sendError(
          "Validation Error",
          ERROR_CODES.VALIDATION_ERROR,
          400,
          err.errors.map((e) => ({ field: e.path[0], message: e.message }))
        );
      }
      throw err;
    }
  } catch (error) {
    return sendError(
      "User update failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const id = params.id;
    if (!id || !ObjectId.isValid(id)) {
      return sendError("Invalid id", ERROR_CODES.VALIDATION_ERROR, 400);
    }

    const usersCollection = await getCollection("users");
    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return sendError("Not found", ERROR_CODES.NOT_FOUND, 404);
    }

    return sendSuccess(null, "User deleted", 200);
  } catch (error) {
    return sendError(
      "User deletion failed",
      ERROR_CODES.INTERNAL_ERROR,
      500,
      error?.message ?? error
    );
  }
}
