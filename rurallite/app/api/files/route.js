/**
 * Files API - Store and Manage File Metadata
 * POST /api/files - Store file metadata after successful upload
 * GET /api/files - Retrieve all files or files for a specific user
 * DELETE /api/files/[id] - Delete file metadata and S3 object
 */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { deleteFile } from "@/lib/aws-s3";

const prisma = new PrismaClient();

/**
 * POST - Store file metadata after successful upload to S3
 */
export async function POST(req) {
    try {
        const { fileName, fileURL, key, size, mimeType, userId } = await req.json();

        // Validate required fields
        if (!fileName || !fileURL || !key || !mimeType) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: fileName, fileURL, key, and mimeType are required",
                },
                { status: 400 }
            );
        }

        // Create file record in database
        const fileRecord = await prisma.file.create({
            data: {
                name: fileName,
                url: fileURL,
                key: key,
                size: size || null,
                mimeType: mimeType,
                userId: userId || null,
            },
        });

        return NextResponse.json({
            success: true,
            message: "File metadata saved successfully",
            file: {
                id: fileRecord.id,
                name: fileRecord.name,
                url: fileRecord.url,
                size: fileRecord.size,
                mimeType: fileRecord.mimeType,
                uploadedAt: fileRecord.uploadedAt,
            },
        });
    } catch (error) {
        console.error("File metadata storage error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to store file metadata",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}

/**
 * GET - Retrieve files
 * Query params:
 * - userId: Filter by user ID
 * - limit: Number of files to return
 */
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        const limit = parseInt(searchParams.get("limit")) || 50;

        // Build query
        const where = userId ? { userId: parseInt(userId) } : {};

        // Fetch files
        const files = await prisma.file.findMany({
            where,
            orderBy: {
                uploadedAt: "desc",
            },
            take: limit,
            select: {
                id: true,
                name: true,
                url: true,
                size: true,
                mimeType: true,
                uploadedAt: true,
                userId: true,
            },
        });

        return NextResponse.json({
            success: true,
            count: files.length,
            files,
        });
    } catch (error) {
        console.error("File retrieval error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to retrieve files",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Delete file metadata and S3 object
 * Body: { fileId, key }
 */
export async function DELETE(req) {
    try {
        const { fileId, key } = await req.json();

        if (!fileId || !key) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Missing required fields: fileId and key are required",
                },
                { status: 400 }
            );
        }

        // Delete from S3
        const s3Result = await deleteFile(key);
        if (!s3Result.success) {
            console.error("S3 deletion failed:", s3Result.error);
            // Continue with database deletion even if S3 deletion fails
        }

        // Delete from database
        await prisma.file.delete({
            where: { id: parseInt(fileId) },
        });

        return NextResponse.json({
            success: true,
            message: "File deleted successfully",
            s3Deleted: s3Result.success,
        });
    } catch (error) {
        console.error("File deletion error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete file",
                error: process.env.NODE_ENV === "development" ? error.message : undefined,
            },
            { status: 500 }
        );
    }
} 