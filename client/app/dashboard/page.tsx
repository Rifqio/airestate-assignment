"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { ENDPOINTS } from "@/lib/endpoints";
import { Property, PropertiesResponse } from "@/types/property";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/property-card";
import { PropertyFormDialog } from "@/components/property-form-dialog";
import { PropertyMap } from "@/components/property-map";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapIcon, GridIcon } from "lucide-react";

export default function Dashboard() {
    const router = useRouter();
    const { user, logout, token } = useAuthStore();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [view, setView] = useState<"map" | "grid">("map");

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };
    
    const fetchProperties = async () => {
        setLoading(true);
        try {
            const BASE_URL =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(
                `${BASE_URL}${ENDPOINTS.PROPERTIES.LIST}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch properties");
            }

            const result: PropertiesResponse = await response.json();

            if (result.status) {
                setProperties(result.data);
            } else {
                throw new Error(
                    result.message || "Failed to fetch properties"
                );
            }
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "An error occurred"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProperties();
        }
    }, [token]);

    return (
        <div className="min-h-screen p-6 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h1 className="text-2xl font-bold">
                        Welcome, {user?.name || user?.email || "User"}!
                    </h1>
                    <div className="flex gap-4">
                        <PropertyFormDialog onPropertyAdded={fetchProperties} />
                        <Button onClick={handleLogout} variant="outline">
                            Log out
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-destructive/15 text-destructive rounded-md">
                        {error}
                    </div>
                )}

                <Tabs 
                    defaultValue="map" 
                    value={view} 
                    onValueChange={(val) => setView(val as "map" | "grid")}
                    className="mb-6"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">
                            Your Properties
                        </h2>
                        <TabsList>
                            <TabsTrigger value="map" className="flex items-center gap-2">
                                <MapIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Map View</span>
                            </TabsTrigger>
                            <TabsTrigger value="grid" className="flex items-center gap-2">
                                <GridIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Grid View</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="map">
                        {loading ? (
                            <div className="h-[calc(100vh-12rem)] w-full bg-muted/20 rounded-xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-3 mx-auto"></div>
                                    <p className="text-muted-foreground">Loading map...</p>
                                </div>
                            </div>
                        ) : properties.length > 0 ? (
                            <PropertyMap properties={properties} />
                        ) : (
                            <div className="text-center py-12 border rounded-xl bg-background">
                                <p className="text-muted-foreground mb-4">
                                    You haven&apos;t created any properties yet.
                                </p>
                                <PropertyFormDialog onPropertyAdded={fetchProperties} />
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="grid">
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <div key={i} className="space-y-3">
                                        <Skeleton className="h-48 w-full" />
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-6 w-1/4" />
                                    </div>
                                ))}
                            </div>
                        ) : properties.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {properties.map((property) => (
                                    <PropertyCard
                                        key={property.id}
                                        property={property}
                                        onPropertyDeleted={fetchProperties}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-muted-foreground mb-4">
                                    You haven&apos;t created any properties yet.
                                </p>
                                <PropertyFormDialog onPropertyAdded={fetchProperties} />
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
