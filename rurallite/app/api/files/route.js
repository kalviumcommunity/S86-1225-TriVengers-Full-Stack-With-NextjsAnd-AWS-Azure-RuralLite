import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { deleteFile } from "@/lib/aws-s3";

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
          message:
            "Missing required fields: fileName, fileURL, key, and mimeType are required",
        },
        { status: 400 }
      );
    }

    const filesCollection = await getCollection("files");

    // Create file record in database
    const fileData = {
      name: fileName,
      url: fileURL,
      key: key,
      size: size || null,
      mimeType: mimeType,
      userId: userId || null,
      uploadedAt: new Date(),
    };

    const result = await filesCollection.insertOne(fileData);

    return NextResponse.json({
      success: true,
      message: "File metadata saved successfully",
      file: {
        id: result.insertedId.toString(),
        name: fileData.name,
        url: fileData.url,
        size: fileData.size,
        mimeType: fileData.mimeType,
        uploadedAt: fileData.uploadedAt,
      },
    });
  } catch (error) {
    console.error("File metadata storage error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to store file metadata",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
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
    const query = userId ? { userId: userId } : {};

    const filesCollection = await getCollection("files");

    // Fetch files
    const files = await filesCollection
      .find(query)
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .toArray();

    // Format files for response
    const formattedFiles = files.map((file) => ({
      id: file._id.toString(),
      name: file.name,
      url: file.url,
      size: file.size,
      mimeType: file.mimeType,
      uploadedAt: file.uploadedAt,
      userId: file.userId,
    }));

    return NextResponse.json({
      success: true,
      count: formattedFiles.length,
      files: formattedFiles,
    });
  } catch (error) {
    console.error("File retrieval error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve files",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
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

    const filesCollection = await getCollection("files");

    // Delete from database
    await filesCollection.deleteOne({
      _id: new ObjectId(fileId),
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
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
