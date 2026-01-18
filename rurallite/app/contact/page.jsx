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
        <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6 flex justify-center items-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full max-w-lg bg-white p-10 border-2 border-orange-100 rounded-3xl shadow-2xl"
            >
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-2">
                        Contact Us
                    </h1>
                    <p className="text-slate-600">We'd love to hear from you!</p>
                </div>

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

                <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 w-full rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 mt-6">
                    <svg
                        className="w-5 h-5 inline-block mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                    </svg>
                    Send Message
                </button>
            </form>
        </main>
    );
}
