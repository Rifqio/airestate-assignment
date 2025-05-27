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

            <div className="mt-6 flex items-center">
                <div className="flex-1 border-t border-gray-300"></div>
                <p className="px-2 text-xs text-muted-foreground">
                    Or continue with
                </p>
                <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
                <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                >
                    <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                            fill="#EA4335"
                        />
                        <path
                            d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                            fill="#4285F4"
                        />
                        <path
                            d="M5.26498 14.2949C5.01498 13.5699 4.88998 12.7999 4.88998 11.9999C4.88998 11.1999 5.01498 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12.0004 24C15.2404 24 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.2154 17.135 5.2704 14.29L1.28039 17.385C3.25539 21.31 7.3104 24 12.0004 24Z"
                            fill="#34A853"
                        />
                    </svg>
                    <span>Sign in with Google</span>
                </Button>
            </div>
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
