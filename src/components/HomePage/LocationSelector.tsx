"use client";

import React, { useState, useEffect } from "react";
import { SlLocationPin } from "react-icons/sl";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@nextui-org/react";
import { reverseGeocode } from "@/lib/utils/geocoding";

type Geolocation = {
  latitude: number;
  longitude: number;
  address?: string;
};

const LocationSelector = () => {
  const [geolocation, setGeolocation] = useState<Geolocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      setGeolocation(JSON.parse(savedLocation));
    }
  }, []);

  useEffect(() => {
    if (geolocation) {
      localStorage.setItem("userLocation", JSON.stringify(geolocation));
    }
  }, [geolocation]);

  return (
    <div className="relative group">
      <div className="bg-white/10 backdrop-blur-[0.5px] flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
        <SlLocationPin
          className="text-primary-500"
          size={20}
          aria-hidden="true"
        />
        <div className="flex flex-col">
          <span className="text-sm text-gray-900 font-bold">Deliver to:</span>
          <span className="font-medium text-white">
            {geolocation?.address || "Select location"}
          </span>
        </div>
        <Button
          onPress={() => setIsOpen(true)}
          variant="light"
          size="sm"
          className="ml-2 font-bold border-b border-primary-200 rounded-[0]"
        >
          Change
        </Button>
      </div>

      <LocationPermissionModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setGeoLocation={setGeolocation}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

interface PermissionModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setGeoLocation: React.Dispatch<React.SetStateAction<Geolocation | null>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LocationPermissionModal = ({
  isOpen,
  setIsOpen,
  setGeoLocation,
  isLoading,
  setIsLoading,
}: PermissionModalProps) => {
  const { toast } = useToast();

  const handleAllow = async () => {
    setIsLoading(true);

    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }

      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        }
      );

      const { latitude, longitude } = position.coords;
      const address = await reverseGeocode(latitude, longitude);
      console.log(address);
      setGeoLocation({ latitude, longitude, address });

      toast({ description: "Location updated successfully" });
    } catch (error) {
      toast({
        description:
          error instanceof Error
            ? error.message
            : "Unable to get your location",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      backdrop="blur"
      size="xl"
      classNames={{
        base: "rounded-lg shadow-lg",
        header: "border-b pb-4",
        body: "py-6",
        footer: "border-t pt-4",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-xl font-semibold">
          Location Access
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-gray-600">
              Allow Komas to access your location to show you nearby stores and
              get accurate delivery estimates.
            </p>
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
              <SlLocationPin className="text-primary-500" size={24} />
              <p className="text-sm">
                Your location will be used to enhance your shopping experience.
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="flex gap-3 justify-end">
          <Button
            variant="flat"
            onPress={() => setIsOpen(false)}
            className="min-w-[100px] !border-none !outline-none !focus:ring-0"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleAllow}
            isLoading={isLoading}
            className="min-w-[100px]"
          >
            Allow Access
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LocationSelector;
