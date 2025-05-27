/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Authentication - NiceEstate",
    description: "Login or register to access NiceEstate",
};

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="flex min-h-screen w-full">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div className="mb-10">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="rounded-full bg-primary p-1.5">
                                <svg 
                                    width="24" 
                                    height="24" 
                                    viewBox="0 0 24 24" 
                                    fill="none" 
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="text-primary-foreground"
                                >
                                    <path 
                                        d="M3 9L12 5L21 9L12 13L3 9Z" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                    <path 
                                        d="M19 12.5V17.5L12 21L5 17.5V12.5" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                            <span className="text-xl font-semibold">NiceEstate</span>
                        </Link>
                        
                        <h2 className="mt-6 text-3xl font-bold tracking-tight">
                            Welcome to NiceEstate
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Your premium real estate platform
                        </p>
                    </div>
                    
                    {children}
                </div>
            </div>

            <div className="relative hidden w-0 flex-1 lg:block">
                <div className="absolute inset-0 h-full w-full bg-gradient-to-b from-blue-50 to-blue-200 dark:from-slate-900 dark:to-slate-800">
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                        <div className="relative w-full max-w-2xl rounded-2xl bg-white/10 backdrop-blur-sm p-4 shadow-2xl dark:bg-black/10">
                            <Image
                                src="https://cdn.prod.website-files.com/620ec747459e13c7cf12a39e/625b10a58137b364b18df2ea_iStock-94179607.jpg"
                                alt="Beautiful property by the ocean"
                                className="h-full w-full rounded-xl object-cover"
                                width={900}
                                height={600}
                                priority
                            />
                            <div className="absolute bottom-8 left-8 max-w-md rounded-lg bg-white/80 p-4 backdrop-blur-sm dark:bg-black/50">
                                <p className="text-sm font-medium">
                                    "NiceEstate helped us find our dream home in half the time. The map interface made house hunting fun!"
                                </p>
                                <p className="mt-2 text-xs font-medium text-muted-foreground">
                                    — Sarah & Michael, New Homeowners
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
