/**
 * File Upload API - Generate Pre-Signed URLs (Best Practices)
 * POST /api/upload
 * 
 * - Only allows whitelisted file types and enforces max file size (server-side)
 * - Generates a short-lived, private, server-side-encrypted S3 upload URL
 * - Never exposes AWS credentials or sensitive error details
 * - All credentials/config are loaded from environment variables
 */
import { NextResponse } from "next/server";
import { generatePresignedUploadURL } from "@/lib/aws-s3";

export async function POST(req) {
    try {
        // Parse request body
        const { filename, fileType, fileSize, userId } = await req.json();

        // Validate required fields
        if (!filename || !fileType || !fileSize) {
            return NextResponse.json({
                success: false,
                message: "Missing required fields: filename, fileType, and fileSize are required",
            }, { status: 400 });
        }

        if (typeof filename !== 'string' || filename.trim().length === 0) {
            return NextResponse.json({
                success: false,
                message: "Invalid filename",
            }, { status: 400 });
        }

        if (typeof fileSize !== 'number' || fileSize <= 0) {
            return NextResponse.json({
                success: false,
                message: "File size must be a positive number",
            }, { status: 400 });
        }

        // Server-side file type and size validation (defense in depth)
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ];
        const maxFileSize = 10 * 1024 * 1024;

        if (!allowedTypes.includes(fileType)) {
            return NextResponse.json({
                success: false,
                message: `File type not allowed: ${fileType}`,
            }, { status: 400 });
        }

        if (fileSize > maxFileSize) {
            return NextResponse.json({
                success: false,
                message: `File size exceeds limit (${maxFileSize / (1024 * 1024)}MB)`
            }, { status: 400 });
        }

        // Generate pre-signed URL with 60-second expiry for security
        const result = await generatePresignedUploadURL(
            filename,
            fileType,
            fileSize,
            userId,
            60 // Short expiry for security
        );

        if (!result.success) {
            return NextResponse.json({
                success: false,
                message: result.error || "Failed to generate upload URL",
            }, { status: 400 });
        }

        // Return pre-signed URL and file metadata
        return NextResponse.json({
            success: true,
            uploadURL: result.uploadURL,
            key: result.key,
            publicURL: result.publicURL,
            expiresIn: 60, // seconds
            message: "Pre-signed URL generated successfully. Upload must complete within 60 seconds.",
        });
    } catch (error) {
        // Never leak sensitive error details
        console.error("Upload API Error:", error);
        return NextResponse.json({
            success: false,
            message: "Internal server error. Please try again later.",
        }, { status: 500 });
    }
}

// GET endpoint to check API status
export async function GET() {
    return NextResponse.json({
        success: true,
        message: "File Upload API - Use POST to generate pre-signed URLs",
        allowedTypes: [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ],
        maxFileSize: "10MB",
        expiryTime: "60 seconds",
    });
} 