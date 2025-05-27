"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth.store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginForm() {
    const router = useRouter();
    const [isRegistered, setIsRegistered] = useState(false);
    const { login, loading } = useAuthStore();
    const [error, setError] = useState("");

    useEffect(() => {
        const url = new URL(window.location.href);
        setIsRegistered(url.searchParams.get("registered") === "true");
    }, []);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        try {
            setError("");
            await login(values.email, values.password);
            router.push("/dashboard");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || "An error occurred during login");
                return;
            }
            setError("An unexpected error occurred. Please try again.");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Sign in to your account</h2>
                <Link
                    href="/auth/register"
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Create an account
                </Link>
            </div>

            {isRegistered && (
                <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    <p>
                        Registration successful! Please login with your
                        credentials.
                    </p>
                </div>
            )}

            {error && (
                <div className="mt-4 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    <p>{error}</p>
                </div>
            )}

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-6 space-y-6"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email address</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="name@example.com"
                                        type="email"
                                        autoComplete="email"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Your password"
                                        type="password"
                                        autoComplete="current-password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center justify-between">
                        <FormField
                            control={form.control}
                            name="rememberMe"
                            render={({ field }) => (
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-primary accent-primary"
                                        checked={field.value}
                                        onChange={field.onChange}
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm"
                                    >
                                        Remember me
                                    </label>
                                </div>
                            )}
                        />

                        <div className="text-sm">
                            <a
                                href="#"
                                className="font-medium text-primary hover:underline"
                            >
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <svg
                                className="h-5 w-5 animate-spin text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                        ) : (
                            "Sign in"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

// Main page component with Suspense
export default function Login() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginForm />
        </Suspense>
    );
}
