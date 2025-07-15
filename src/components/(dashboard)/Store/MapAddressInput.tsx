"use client";

import React, { useState, useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { LatLng } from "leaflet";
import { FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ModalCustom from "@/components/ModalCustom";
import { MapPin } from "lucide-react";

// --- Draggable Marker Component ---
function DraggableMarker({ onPositionChange }) {
  const [position, setPosition] = useState<LatLng>(new LatLng(30.0444, 31.2357)); // Default to Cairo
  const markerRef = useRef(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onPositionChange(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const newPos = marker.getLatLng();
          setPosition(newPos);
          onPositionChange(newPos);
        }
      },
    }),
    [onPositionChange]
  );

  return <Marker draggable={true} eventHandlers={eventHandlers} position={position} ref={markerRef}></Marker>;
}

// --- Main Map Input Component ---
const MapAddressInput = ({ name, label }: { name: string; label: string }) => {
  const { control, setValue, watch } = useFormContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // A real app would use a geocoding service here. We'll simulate it.
  const handlePositionChange = (latlng: LatLng) => {
    // Simulate fetching address from lat/lng
    const simulatedAddress = `شارع خالد، مصر الجديدة، محافظة القاهرة، مصر`;
    const mapUrl = `https://www.google.com/maps?q=${latlng.lat},${latlng.lng}`;

    // Set both the display address and the map URL
    setValue(name, simulatedAddress, { shouldValidate: true });
    setValue(`${name}Url`, mapUrl); // Assuming you have a field for the URL
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="relative">
            <FormControl>
              <Input
                {...field}
                placeholder="شارع خالد، مصر الجديدة، محافظة القاهرة، مصر"
                className="pr-12 pl-32" // Make space for icon and button
              />
            </FormControl>
            <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <ModalCustom
              isOpen={isModalOpen}
              onOpenChange={setIsModalOpen}
              btn={
                <Button
                  type="button"
                  className="absolute left-1.5 top-1/2 -translate-y-1/2 h-8 px-4 bg-main text-white hover:bg-main/90"
                >
                  تحديد من الخريطة
                </Button>
              }
              title="تحديد الموقع على الخريطة"
              content={
                <div className="w-full h-[50vh] rounded-lg overflow-hidden z-50">
                  <MapContainer center={[30.0444, 31.2357]} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <DraggableMarker onPositionChange={handlePositionChange} />
                  </MapContainer>
                </div>
              }
              cancelBtn={true}
              functionalbtn={
                <Button onClick={() => setIsModalOpen(false)} className="bg-main text-white">
                  تأكيد
                </Button>
              }
            />
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default MapAddressInput;
