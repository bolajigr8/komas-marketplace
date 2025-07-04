"use client";

import { useState, useEffect } from "react";
import { BellRing, Bell, BellOff } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@nextui-org/react";
import { subscribeUser, unsubscribeUser } from "@/app/actions";

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

export default function NotificationBadge() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check if push notifications are supported
  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      checkSubscriptionStatus();
    }
  }, []);

  async function checkSubscriptionStatus() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (err) {
      console.error("Error checking subscription:", err);
    }
  }

  async function handleSubscribe() {
    setIsSubscribing(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      setSubscription(sub);
      const serializedSub = JSON.parse(JSON.stringify(sub));
      await subscribeUser(serializedSub);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to subscribe to push notifications:", err);
    } finally {
      setIsSubscribing(false);
    }
  }

  async function handleUnsubscribe() {
    try {
      await subscription?.unsubscribe();
      setSubscription(null);
      await unsubscribeUser();
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to unsubscribe from push notifications:", err);
    }
  }

  if (!isSupported) {
    return null;
  }

  return (
    <Popover placement="bottom" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors relative flex items-center justify-center"
          aria-label="Notifications"
        >
          {subscription ? (
            <Bell className="w-5 h-5 text-gray-700" />
          ) : (
            <BellRing className="w-5 h-5 text-gray-700" />
          )}
          {subscription && (
            <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full w-2 h-2"></span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {subscription ? (
              <Bell className="w-5 h-5 text-primary-600" />
            ) : (
              <BellRing className="w-5 h-5 text-gray-600" />
            )}
            <h3 className="font-medium text-gray-800">
              {subscription ? "Notifications enabled" : "Enable notifications"}
            </h3>
          </div>

          <p className="text-sm text-gray-600">
            {subscription
              ? "You'll receive updates about your orders, promotions, and more."
              : "Get notified about order updates, special offers, and more."}
          </p>

          <div className="pt-2">
            {subscription ? (
              <Button
                size="sm"
                color="danger"
                variant="light"
                onClick={handleUnsubscribe}
                className="w-full"
              >
                Turn off notifications
              </Button>
            ) : (
              <Button
                size="sm"
                color="primary"
                onClick={handleSubscribe}
                isLoading={isSubscribing}
                className="w-full"
              >
                {isSubscribing ? "Enabling..." : "Enable notifications"}
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
