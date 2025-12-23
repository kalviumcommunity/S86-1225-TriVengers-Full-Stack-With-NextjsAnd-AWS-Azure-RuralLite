"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";

// Zod validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = (data) => {
    console.log("Contact Form Data:", data);
    alert("Message Sent Successfully!");
  };

  return (
    <main className="p-6 flex justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 bg-gray-50 p-6 border rounded-lg"
      >
        <h1 className="text-xl font-bold mb-4">
          Contact Us
        </h1>

        <FormInput
          label="Name"
          name="name"
          register={register}
          error={errors.name?.message}
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          register={register}
          error={errors.email?.message}
        />

        <FormInput
          label="Message"
          name="message"
          register={register}
          error={errors.message?.message}
        />

        <button
          className="bg-green-600 text-white py-2 w-full rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
