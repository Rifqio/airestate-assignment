"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Property } from "@/types/property";
import { formatCurrency } from "@/lib/utils";

interface PropertyMapProps {
  properties: Property[];
}

const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

export function PropertyMap({ properties }: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-74.006, 40.7128],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || properties.length === 0) return;

    const mapInstance = map.current;

    const addMarkers = () => {
      const existingMarkers = document.querySelectorAll(".property-marker");
      existingMarkers.forEach((marker) => marker.remove());

      if (properties.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        
        properties.forEach((property) => {
          bounds.extend([property.longitude, property.latitude]);

          const priceEl = document.createElement("div");
          priceEl.className = "property-marker";
          priceEl.innerHTML = `
            <div class="price-badge" data-id="${property.id}">
              <span>${formatCurrency(parseFloat(property.price))}</span>
              <div class="property-popup">
                <div class="property-image">
                  <img src="${property.imageUrl}" alt="${property.title}" />
                </div>
                <div class="property-info">
                  <h3>${property.title}</h3>
                  <p>${property.address}</p>
                </div>
              </div>
            </div>
          `;

          priceEl.addEventListener("mouseenter", () => {
            const id = priceEl.querySelector(".price-badge")?.getAttribute("data-id");
            if (id) setActivePropertyId(id);
          });

          priceEl.addEventListener("mouseleave", () => {
            setActivePropertyId(null);
          });

          new mapboxgl.Marker({ element: priceEl })
            .setLngLat([property.longitude, property.latitude])
            .addTo(mapInstance);
        });

        mapInstance.fitBounds(bounds, {
          padding: 100,
          maxZoom: 15,
        });
      }
    };

    if (mapInstance.loaded()) {
      addMarkers();
    } else {
      mapInstance.on("load", addMarkers);
    }

    return () => {
      if (mapInstance) {
        mapInstance.off("load", addMarkers);
      }
    };
  }, [properties]);

  useEffect(() => {
    const markers = document.querySelectorAll(".price-badge");
    markers.forEach((marker) => {
      const id = marker.getAttribute("data-id");
      if (id === activePropertyId) {
        marker.classList.add("active");
      } else {
        marker.classList.remove("active");
      }
    });
  }, [activePropertyId]);

  return (
    <div className="relative w-full h-[calc(100vh-12rem)] rounded-xl overflow-hidden border">
      <div ref={mapContainer} className="w-full h-full" />
      {!MAPBOX_ACCESS_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 p-4 text-center">
          <div>
            <p className="font-semibold mb-2">Mapbox Access Token Missing</p>
            <p className="text-sm text-muted-foreground">
              Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your environment 
              to enable the map view.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
