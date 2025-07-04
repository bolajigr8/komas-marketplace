"use client";

import { useState, useEffect } from "react";
import { BellRing, Bell, BellOff, AlertCircle } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  DropdownSection,
  Button,
} from "@nextui-org/react";
import { subscribeUser, unsubscribeUser } from "@/app/actions";

// Helper function to convert base64 to Uint8Array for push subscription
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationBell() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      if ("serviceWorker" in navigator && "PushManager" in window) {
        setIsSupported(true);
        try {
          const registration = await navigator.serviceWorker.register(
            "/sw.js",
            {
              scope: "/",
            }
          );
          const sub = await registration.pushManager.getSubscription();
          if (sub) {
            setSubscription(sub);
          }
        } catch (err) {
          console.error("Error checking notification status:", err);
        }
      }
    };

    checkSupport();
  }, []);

  async function handleSubscribe() {
    setIsLoading(true);
    setError(null);

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ""
        ),
      });

      setSubscription(sub);

      // Use the PushSubscription's toJSON method to safely serialize the subscription
      const subJson = sub.toJSON();

      // Create a safe serialized version with explicit type handling
      const serializedSub = {
        endpoint: sub.endpoint,
        expirationTime: sub.expirationTime,
        keys: {
          p256dh: subJson.keys?.p256dh || "",
          auth: subJson.keys?.auth || "",
        },
      };

      await subscribeUser(serializedSub);
    } catch (err: any) {
      setError(err.message || "Failed to subscribe to notifications");
      console.error("Subscription error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUnsubscribe() {
    setIsLoading(true);
    setError(null);

    try {
      await subscription?.unsubscribe();
      setSubscription(null);
      await unsubscribeUser();
    } catch (err: any) {
      setError(err.message || "Failed to unsubscribe");
      console.error("Unsubscribe error:", err);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isSupported) {
    return (
      <div className="text-gray-400 cursor-not-allowed p-2">
        <BellOff className="w-5 h-5" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        {subscription ? (
          <Bell className="w-5 h-5 text-gray-700" />
        ) : (
          <BellRing className="w-5 h-5 text-gray-700" />
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
          {/* Notifications section */}
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
            <div className="py-1 mt-2">
              <p className="text-sm font-medium">
                {subscription
                  ? "Notifications are enabled"
                  : "Enable notifications"}
              </p>
              <p className="text-xs text-gray-500">
                {subscription
                  ? "You'll receive updates about your orders and promotions"
                  : "Get updates about orders and special offers"}
              </p>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3">
              <div className="flex items-center text-red-500 text-xs py-1">
                <AlertCircle className="w-4 h-4 mr-1" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="p-3">
            {subscription ? (
              <button
                onClick={handleUnsubscribe}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-md disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Turn off notifications"}
              </button>
            ) : (
              <button
                onClick={handleSubscribe}
                className="w-full py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-md disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Turn on notifications"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
