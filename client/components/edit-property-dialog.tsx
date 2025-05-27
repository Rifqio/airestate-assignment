"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth.store";
import { ENDPOINTS } from "@/lib/endpoints";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapLocationPicker } from "./map-location-picker";
import { toast } from "./ui/use-toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

// Modified schema to avoid using FileList directly
const propertyFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number",
  }),
  latitude: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= -90 && Number(val) <= 90, {
    message: "Latitude must be between -90 and 90",
  }),
  longitude: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= -180 && Number(val) <= 180, {
    message: "Longitude must be between -180 and 180",
  }),
  address: z.string().min(5, "Address must be at least 5 characters"),
  image: z.any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
      "Max file size is 5MB"
    )
    .refine(
      (files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp files are accepted"
    ),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface EditPropertyDialogProps {
  propertyId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPropertyUpdated: () => void;
}

export function EditPropertyDialog({ 
  propertyId, 
  open, 
  onOpenChange, 
  onPropertyUpdated 
}: EditPropertyDialogProps) {
  const { token } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      latitude: "",
      longitude: "",
      address: "",
    },
  });

  // Fetch property details when dialog opens
  useEffect(() => {
    if (!open || !propertyId || !token) return;

    const fetchPropertyDetails = async () => {
      setIsLoading(true);
      setLoadError(null);
      
      try {
        const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://103.175.220.122:6500";
        const response = await fetch(
          `${BASE_URL}${ENDPOINTS.PROPERTIES.DETAIL(propertyId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch property details");
        }

        const result = await response.json();
        
        if (result.status && result.data) {
          setCurrentProperty(result.data);
          
          // Populate form with property data
          form.reset({
            title: result.data.title,
            description: result.data.description,
            price: result.data.price,
            latitude: String(result.data.latitude),
            longitude: String(result.data.longitude),
            address: result.data.address,
          });
        } else {
          throw new Error(result.message || "Failed to fetch property details");
        }
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "An error occurred");
        toast({
          title: "Error",
          description: "Failed to load property details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [open, propertyId, token, form]);

  const handleLocationSelected = (lat: number, lng: number, address: string) => {
    form.setValue("latitude", lat.toString());
    form.setValue("longitude", lng.toString());
    form.setValue("address", address);
  };

  const onSubmit = async (values: PropertyFormValues) => {
    if (!token || !propertyId) return;

    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("price", values.price);
      formData.append("latitude", values.latitude);
      formData.append("longitude", values.longitude);
      formData.append("address", values.address);
      
      // Only append image if a new one is selected
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }

      const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://103.175.220.122:6500";
      const response = await fetch(`${BASE_URL}${ENDPOINTS.PROPERTIES.UPDATE(propertyId)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update property");
      }

      toast({
        title: "Success!",
        description: "Property has been updated successfully.",
      });

      // Close dialog and refresh property list
      onOpenChange(false);
      onPropertyUpdated();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>
            Update the details of your property listing.
          </DialogDescription>
        </DialogHeader>
        
        {isLoading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : loadError ? (
          <div className="py-4 text-center">
            <p className="text-destructive">{loadError}</p>
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        className="resize-none" 
                        rows={3} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormDescription>
                  Update the property location on the map
                </FormDescription>
                {currentProperty && (
                  <MapLocationPicker 
                    onLocationSelected={handleLocationSelected}
                    initialLatitude={parseFloat(form.getValues().latitude || String(currentProperty.latitude))}
                    initialLongitude={parseFloat(form.getValues().longitude || String(currentProperty.longitude))}
                  />
                )}
              </FormItem>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude</FormLabel>
                      <FormControl>
                        <Input type="text" readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude</FormLabel>
                      <FormControl>
                        <Input type="text" readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input 
                        readOnly
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Address is automatically generated from the selected location
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="image"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Property Image</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        {currentProperty && (
                          <div className="mb-2">
                            <p className="text-sm text-muted-foreground mb-1">Current image:</p>
                            <div className="relative h-32 w-32 rounded-md overflow-hidden border">
                              <img 
                                src={currentProperty.imageUrl} 
                                alt={currentProperty.title}
                                className="object-cover h-full w-full"
                              />
                            </div>
                          </div>
                        )}
                        <Input
                          {...fieldProps}
                          type="file"
                          accept="image/*"
                          onChange={(event) => onChange(event.target.files)}
                          className="cursor-pointer"
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a new image only if you want to replace the current one (max 5MB).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isLoading}>
                  {isSubmitting ? (
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
                    "Update Property"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
