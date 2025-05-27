import React, { useState } from "react";
import Image from "next/image";
import { Property } from "@/types/property";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { ENDPOINTS } from "@/lib/endpoints";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { EditPropertyDialog } from "./edit-property-dialog";

interface PropertyCardProps {
    property: Property;
    onPropertyDeleted: () => void;
}

export function PropertyCard({ property, onPropertyDeleted }: PropertyCardProps) {
    const { token } = useAuthStore();
    const [isHovered, setIsHovered] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    const handleDelete = async () => {
        if (!token) return;
        
        setIsDeleting(true);
        try {
            const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(
                `${BASE_URL}${ENDPOINTS.PROPERTIES.DELETE(property.id)}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to delete property");
            }

            toast({
                title: "Success",
                description: "Property deleted successfully",
            });

            onPropertyDeleted();
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete property",
                variant: "destructive",
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    return (
        <>
            <Card 
                className="overflow-hidden transition-all hover:shadow-lg relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="relative h-48 w-full overflow-hidden">
                    <Image
                        src={property.imageUrl}
                        alt={property.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {isHovered && (
                        <div className="absolute right-2 top-2 flex gap-2">
                            <Button 
                                size="icon" 
                                variant="secondary" 
                                className="h-8 w-8 rounded-full bg-white/80 text-gray-700 hover:bg-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowEditDialog(true);
                                }}
                            >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">Edit property</span>
                            </Button>
                            <Button 
                                size="icon" 
                                variant="destructive" 
                                className="h-8 w-8 rounded-full bg-white/80 text-red-600 hover:bg-white hover:text-red-700"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDeleteDialog(true);
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete property</span>
                            </Button>
                        </div>
                    )}
                </div>
                <CardHeader className="p-4">
                    <h3 className="text-lg font-semibold line-clamp-1">
                        {property.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {property.address}
                    </p>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="mb-2 text-sm line-clamp-2">
                        {property.description}
                    </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <p className="text-lg font-bold text-primary">
                        {formatCurrency(parseFloat(property.price))}
                    </p>
                </CardFooter>
            </Card>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the property &quot;{property.title}&quot;. 
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 focus:ring-red-600"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Deleting...</span>
                                </>
                            ) : (
                                "Delete Property"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Edit property dialog */}
            <EditPropertyDialog 
                propertyId={property.id}
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                onPropertyUpdated={onPropertyDeleted}
            />
        </>
    );
}
