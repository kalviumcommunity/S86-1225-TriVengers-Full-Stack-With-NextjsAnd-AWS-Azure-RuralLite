"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Logging in...");

    try {
      await new Promise((res) => setTimeout(res, 1500)); // mock API
      toast.success("Login successful!", { id: toastId });
    } catch (error) {
      toast.error("Login failed", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("email")}
        placeholder="Email"
        className="border p-2 w-full"
      />

      <input
        {...register("password")}
        type="password"
        placeholder="Password"
        className="border p-2 w-full"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>

      {isSubmitting && (
        <div role="status" aria-live="polite" className="text-sm text-gray-500">
          Logging in...
        </div>
      )}
    </form>
  );
}
