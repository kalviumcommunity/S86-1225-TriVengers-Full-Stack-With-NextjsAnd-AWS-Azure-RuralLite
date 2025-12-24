"use client";

export default function ConfirmModal({
  open,
  title = "Confirm Action",
  description = "This action cannot be undone.",
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <dialog
        open
        aria-modal="true"
        aria-labelledby="modal-title"
        className="bg-white rounded-lg p-6 w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className="text-lg font-semibold">
          {title}
        </h2>

        <p className="mt-2 text-sm text-gray-600">
          {description}
        </p>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded"
          >
            Confirm
          </button>
        </div>
      </dialog>
    </div>
  );
}
