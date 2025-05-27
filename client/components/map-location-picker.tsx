"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapLocationPickerProps {
  onLocationSelected: (latitude: number, longitude: number, address: string) => void;
  initialLatitude?: number;
  initialLongitude?: number;
}

// Ensure you have a Mapbox access token
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

// Initialize Mapbox with access token
mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export function MapLocationPicker({
  onLocationSelected,
  initialLatitude = 40.7128,
  initialLongitude = -74.006,
}: MapLocationPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to perform reverse geocoding
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        return data.features[0].place_name;
      }
      return "Address unknown";
    } catch (error) {
      console.error("Error fetching address:", error);
      return "Error fetching address";
    }
  };

  // Initialize map when component mounts
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Create the map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialLongitude, initialLatitude],
      zoom: 12,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add a draggable marker to the map
    const addMarker = () => {
      if (!map.current) return;

      // Create a draggable marker
      marker.current = new mapboxgl.Marker({ draggable: true })
        .setLngLat([initialLongitude, initialLatitude])
        .addTo(map.current);

      // Get initial address
      getAddressFromCoordinates(initialLatitude, initialLongitude).then(
        (address) => {
          onLocationSelected(initialLatitude, initialLongitude, address);
          setLoading(false);
        }
      );

      // When marker is dragged, update coordinates and get new address
      marker.current.on("dragend", async () => {
        const lngLat = marker.current?.getLngLat();
        if (lngLat) {
          const address = await getAddressFromCoordinates(lngLat.lat, lngLat.lng);
          onLocationSelected(lngLat.lat, lngLat.lng, address);
        }
      });
    };

    map.current.on("load", addMarker);

    // Allow clicking on the map to move the marker
    map.current.on("click", async (e) => {
      const lngLat = e.lngLat;
      marker.current?.setLngLat(lngLat);
      const address = await getAddressFromCoordinates(lngLat.lat, lngLat.lng);
      onLocationSelected(lngLat.lat, lngLat.lng, address);
    });

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialLatitude, initialLongitude, onLocationSelected]);

  return (
    <div className="relative w-full">
      <div 
        ref={mapContainer} 
        className="w-full h-[300px] rounded-md border overflow-hidden"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}
      {!MAPBOX_ACCESS_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-4 text-center">
          <div>
            <p className="font-semibold mb-2">Mapbox Access Token Missing</p>
            <p className="text-sm text-muted-foreground">
              Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment.
            </p>
          </div>
        </div>
      )}
      <p className="text-xs text-muted-foreground mt-2">
        Click on the map or drag the marker to select a location
      </p>
    </div>
  );
}
