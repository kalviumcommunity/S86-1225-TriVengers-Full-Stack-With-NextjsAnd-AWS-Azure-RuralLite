"use client";

import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating account...");

    try {
      await new Promise((res) => setTimeout(res, 1500)); // mock API
      toast.success("Account created successfully!", { id: toastId });
    } catch (error) {
      toast.error("Signup failed", { id: toastId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input
        {...register("name")}
        placeholder="Name"
        className="border p-2 w-full"
      />

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
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Sign Up
      </button>

      {isSubmitting && (
        <div role="status" aria-live="polite" className="text-sm text-gray-500">
          Creating account...
        </div>
      )}
    </form>
  );
}
