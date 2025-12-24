"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function DashboardPage() {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setOpen(false);
    const toastId = toast.loading("Deleting...");

    try {
      await new Promise((res) => setTimeout(res, 1000)); // mock API
      toast.success("Item deleted successfully", { id: toastId });
    } catch (error) {
      toast.error("Delete failed", { id: toastId });
    }
  };

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Dashboard</h1>

      <button
        onClick={() => setOpen(true)}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Delete Item
      </button>

      <ConfirmModal
        open={open}
        title="Delete Item?"
        description="Are you sure you want to delete this item?"
        onConfirm={handleDelete}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
