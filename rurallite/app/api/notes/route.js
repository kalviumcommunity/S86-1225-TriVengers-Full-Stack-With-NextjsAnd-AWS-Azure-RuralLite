import { getCollection } from "../../../lib/mongodb";
import { sendSuccess, sendError } from "../../../lib/responseHandler";
import { ERROR_CODES } from "../../../lib/errorCodes";
import { sanitizeInput } from "../../../lib/utils/sanitize";
import { ObjectId } from "mongodb";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const notesCollection = await getCollection("notes");

        // If ID is provided, fetch single note
        if (id) {
            const note = await notesCollection.findOne({ _id: new ObjectId(id) });
            if (!note) {
                return sendError("Note not found", ERROR_CODES.NOT_FOUND, 404);
            }
            // Convert _id to id for frontend
            note.id = note._id.toString();
            delete note._id;
            return sendSuccess(note, "Note fetched successfully", 200);
        }

        // Fetch all notes
        const notes = await notesCollection
            .find({})
            .sort({ updatedAt: -1 })
            .toArray();

        // Convert _id to id for each note
        const formattedNotes = notes.map((note) => ({
            ...note,
            id: note._id.toString(),
            _id: undefined,
        }));

        return sendSuccess(formattedNotes, "Notes fetched successfully", 200, {
            count: formattedNotes.length,
        });
    } catch (error) {
        return sendError(
            "Failed to fetch notes",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}

// Create a new note
export async function POST(req) {
    try {
        const body = await req.json();
        const { title, content, userId } = body;

        if (!content || !userId) {
            return sendError(
                "Missing content or userId",
                ERROR_CODES.BAD_REQUEST,
                400
            );
        }

        // Sanitize input to prevent XSS/SQLi
        const cleanTitle = title ? sanitizeInput(title) : "Untitled Note";
        const cleanContent = sanitizeInput(content);

        const notesCollection = await getCollection("notes");

        const newNote = {
            title: cleanTitle,
            content: cleanContent,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const result = await notesCollection.insertOne(newNote);

        const note = {
            ...newNote,
            id: result.insertedId.toString(),
            _id: undefined,
        };

        return sendSuccess(note, "Note created successfully", 201);
    } catch (error) {
        return sendError(
            "Failed to create note",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}

// Update a note
export async function PUT(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return sendError(
                "Note ID is required",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        const body = await req.json();
        const { title, content } = body;

        const notesCollection = await getCollection("notes");

        const updateData = {
            ...(title && { title: sanitizeInput(title) }),
            ...(content && { content: sanitizeInput(content) }),
            updatedAt: new Date(),
        };

        const result = await notesCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateData },
            { returnDocument: "after" }
        );

        if (!result) {
            return sendError("Note not found", ERROR_CODES.NOT_FOUND, 404);
        }

        const note = {
            ...result,
            id: result._id.toString(),
            _id: undefined,
        };

        return sendSuccess(note, "Note updated successfully", 200);
    } catch (error) {
        return sendError(
            "Failed to update note",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}

// Delete a note
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return sendError(
                "Note ID is required",
                ERROR_CODES.VALIDATION_ERROR,
                400
            );
        }

        const notesCollection = await getCollection("notes");
        const result = await notesCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return sendError("Note not found", ERROR_CODES.NOT_FOUND, 404);
        }

        return sendSuccess({}, "Note deleted successfully", 200);
    } catch (error) {
        return sendError(
            "Failed to delete note",
            ERROR_CODES.INTERNAL_ERROR,
            500,
            error?.message ?? error
        );
    }
}
