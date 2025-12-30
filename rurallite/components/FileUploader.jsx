/**
 * Client-Side File Upload Component
 * Demonstrates how to use the pre-signed URL upload API
 */

"use client";

import { useState } from "react";

export default function FileUploader({ userId = null }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Client-side validation for best practices
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
      if (!allowedTypes.includes(selectedFile.type)) {
        setUploadStatus(`❌ File type not allowed: ${selectedFile.type}`);
        setFile(null);
        return;
      }
      if (selectedFile.size > maxFileSize) {
        setUploadStatus(`❌ File size exceeds limit (${maxFileSize / (1024 * 1024)}MB)`);
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setUploadStatus("");
    }
  };

  const uploadFile = async () => {
    if (!file) {
      setUploadStatus("Please select a file first");
      return;
    }

    setUploading(true);
    setUploadStatus("Requesting upload URL...");

    try {
      // Step 1: Request pre-signed URL from backend
      const urlResponse = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          fileType: file.type,
          fileSize: file.size,
          userId: userId,
        }),
      });

      const urlData = await urlResponse.json();

      if (!urlData.success) {
        throw new Error(urlData.message || "Failed to get upload URL");
      }

      setUploadStatus("Uploading to S3...");

      // Step 2: Upload file directly to S3 using pre-signed URL
      const uploadResponse = await fetch(urlData.uploadURL, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to S3");
      }

      setUploadStatus("Saving metadata to database...");

      // Step 3: Store file metadata in database
      const metadataResponse = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileURL: urlData.publicURL,
          key: urlData.key,
          size: file.size,
          mimeType: file.type,
          userId: userId,
        }),
      });

      const metadataData = await metadataResponse.json();

      if (!metadataData.success) {
        throw new Error(metadataData.message || "Failed to save metadata");
      }

      setUploadStatus("✅ Upload successful!");
      setUploadedFile(metadataData.file);
      setFile(null);

      // Reset file input
      document.getElementById("fileInput").value = "";

    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus(`❌ Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">File Upload</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select File
        </label>
        <input
          id="fileInput"
          type="file"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50"
          accept="image/*,application/pdf,.doc,.docx,.txt"
        />
        {file && (
          <p className="mt-2 text-sm text-gray-600">
            Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      <button
        onClick={uploadFile}
        disabled={!file || uploading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md
          hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
          font-semibold transition-colors"
      >
        {uploading ? "Uploading..." : "Upload File"}
      </button>

      {uploadStatus && (
        <div className={`mt-4 p-3 rounded-md ${uploadStatus.includes("✅") ? "bg-green-50 text-green-800" :
          uploadStatus.includes("❌") ? "bg-red-50 text-red-800" :
            "bg-blue-50 text-blue-800"
          }`}>
          {uploadStatus}
        </div>
      )}

      {uploadedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 className="font-semibold mb-2">Uploaded File Info:</h3>
          <dl className="text-sm space-y-1">
            <div>
              <dt className="inline font-medium">Name: </dt>
              <dd className="inline">{uploadedFile.name}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Size: </dt>
              <dd className="inline">{(uploadedFile.size / 1024).toFixed(2)} KB</dd>
            </div>
            <div>
              <dt className="inline font-medium">Type: </dt>
              <dd className="inline">{uploadedFile.mimeType}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Uploaded: </dt>
              <dd className="inline">
                {new Date(uploadedFile.uploadedAt).toLocaleString()}
              </dd>
            </div>
            <div className="mt-2">
              <a
                href={uploadedFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                View File →
              </a>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}
