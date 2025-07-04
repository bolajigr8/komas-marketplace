// "use client";

// import { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   subscribeUser,
//   unsubscribeUser,
//   sendNotification,
// } from "@/app/actions";
// import { setSubscription } from "@/redux-store/store-slices/subscriptionSlice";
// import { RootState } from "@/redux-store/store";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/block";
// import { Button } from "../ui/button";

// function urlBase64ToUint8Array(base64String: string) {
//   const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
//   const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

//   const rawData = window.atob(base64);
//   const outputArray = new Uint8Array(rawData.length);

//   for (let i = 0; i < rawData.length; ++i) {
//     outputArray[i] = rawData.charCodeAt(i);
//   }
//   return outputArray;
// }

// interface Input {
//   type: string;
//   placeholder: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   className?: string;
// }

// // Create a simple Input component to use if the UI Input isn't available
// const CustomInput = ({
//   type,
//   placeholder,
//   value,
//   onChange,
//   className,
// }: Input) => (
//   <input
//     type={type}
//     placeholder={placeholder}
//     value={value}
//     onChange={onChange}
//     className={`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm ${
//       className || ""
//     }`}
//   />
// );

// export default function PushNotificationManager() {
//   const dispatch = useDispatch();
//   const subscription = useSelector(
//     (state: RootState) => state.subscription.subscription
//   );

//   const [isSupported, setIsSupported] = useState(false);
//   const [message, setMessage] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if ("serviceWorker" in navigator && "PushManager" in window) {
//       setIsSupported(true);
//       registerServiceWorker();
//     }
//   }, []);

//   async function registerServiceWorker() {
//     try {
//       const registration = await navigator.serviceWorker.register("/sw.js", {
//         scope: "/",
//         updateViaCache: "none",
//       });
//       const sub = await registration.pushManager.getSubscription();
//       if (sub) {
//         dispatch(setSubscription(sub));
//       }
//     } catch (err) {
//       setError("Failed to register service worker");
//       console.error(err);
//     }
//   }

//   async function subscribeToPush() {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const registration = await navigator.serviceWorker.ready;
//       const sub = await registration.pushManager.subscribe({
//         userVisibleOnly: true,
//         applicationServerKey: urlBase64ToUint8Array(
//           process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
//         ),
//       });

//       dispatch(setSubscription(sub));
//       const serializedSub = JSON.parse(JSON.stringify(sub));
//       await subscribeUser(serializedSub);
//     } catch (err) {
//       setError("Failed to subscribe to push notifications");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function unsubscribeFromPush() {
//     setIsLoading(true);
//     setError(null);
//     try {
//       await subscription?.unsubscribe();
//       dispatch(setSubscription(null));
//       await unsubscribeUser();
//     } catch (err) {
//       setError("Failed to unsubscribe from push notifications");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   async function sendTestNotification() {
//     if (!subscription) return;

//     setIsLoading(true);
//     setError(null);
//     try {
//       await sendNotification(message);
//       setMessage("");
//     } catch (err) {
//       setError("Failed to send notification");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   }

//   if (!isSupported) {
//     return (
//       <Card>
//         <CardContent className="pt-4">
//           <p className="text-center text-red-500">
//             Push notifications are not supported in this browser.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   // Input component (use our CustomInput as fallback)
//   const InputComponent = CustomInput;

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Push Notifications</CardTitle>
//         <CardDescription>
//           Get real-time updates on orders, promotions, and more
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         {subscription ? (
//           <div className="space-y-4">
//             <p className="text-green-600">
//               You are subscribed to push notifications.
//             </p>
//             <Button
//               //   variant="outline"
//               onClick={unsubscribeFromPush}
//               disabled={isLoading}
//               className="w-full"
//             >
//               {isLoading ? "Processing..." : "Unsubscribe"}
//             </Button>

//             <div className="pt-2 border-t">
//               <p className="text-sm text-gray-600 mb-2">
//                 Send yourself a test notification:
//               </p>
//               <div className="flex gap-2">
//                 <InputComponent
//                   type="text"
//                   placeholder="Enter notification message"
//                   value={message}
//                   onChange={(e) => setMessage(e.target.value)}
//                   className="flex-1"
//                 />
//                 <Button
//                   onClick={sendTestNotification}
//                   disabled={isLoading || !message}
//                 >
//                   {isLoading ? "Sending..." : "Send"}
//                 </Button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <p>Stay updated with the latest deals and order status.</p>
//             <Button
//               onClick={subscribeToPush}
//               disabled={isLoading}
//               className="w-full"
//             >
//               {isLoading ? "Processing..." : "Subscribe to Notifications"}
//             </Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
} from "@/app/actions";
import {
  setSubscription,
  subscriptionRequested,
  subscriptionSuccess,
  subscriptionFailed,
  updatePreferences,
  recordNotification,
  clearError,
  NotificationPreferences,
} from "@/redux-store/store-slices/subscriptionSlice";
import { RootState } from "@/redux-store/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/block";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { AlertCircle, Bell, BellOff } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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

interface Input {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

// Create a simple Input component to use if the UI Input isn't available
const CustomInput = ({
  type,
  placeholder,
  value,
  onChange,
  className,
}: Input) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm ${
      className || ""
    }`}
  />
);

export default function PushNotificationManager() {
  const dispatch = useDispatch();
  const { subscription, isSubscribing, error, preferences, lastNotification } =
    useSelector((state: RootState) => state.subscription);

  const [isSupported, setIsSupported] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
        updateViaCache: "none",
      });
      const sub = await registration.pushManager.getSubscription();
      if (sub) {
        dispatch(setSubscription(sub));
      }
    } catch (err) {
      dispatch(subscriptionFailed("Failed to register service worker"));
      console.error(err);
    }
  }

  async function subscribeToPush() {
    dispatch(subscriptionRequested());
    setIsLoading(true);

    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      });

      dispatch(subscriptionSuccess(sub));
      const serializedSub = JSON.parse(JSON.stringify(sub));
      await subscribeUser(serializedSub);

      // Record notification for display in history
      dispatch(
        recordNotification({
          title: "Subscription Successful",
          body: "You'll now receive notifications for important updates",
        })
      );
    } catch (err: any) {
      dispatch(
        subscriptionFailed(
          err.message || "Failed to subscribe to push notifications"
        )
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function unsubscribeFromPush() {
    setIsLoading(true);
    dispatch(clearError());

    try {
      await subscription?.unsubscribe();
      dispatch(setSubscription(null));
      await unsubscribeUser();
    } catch (err: any) {
      dispatch(
        subscriptionFailed(
          err.message || "Failed to unsubscribe from push notifications"
        )
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function sendTestNotification() {
    if (!subscription) return;

    setIsLoading(true);
    dispatch(clearError());

    try {
      await sendNotification(message);

      // Record notification for display in history
      dispatch(
        recordNotification({
          title: "Test Notification",
          body: message,
        })
      );

      setMessage("");
    } catch (err: any) {
      dispatch(
        subscriptionFailed(err.message || "Failed to send notification")
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handlePreferenceChange = (
    key: keyof NotificationPreferences,
    value: boolean
  ) => {
    dispatch(updatePreferences({ [key]: value }));
  };

  if (!isSupported) {
    return (
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2 text-red-500">
            <AlertCircle size={16} />
            <p>Push notifications are not supported in this browser.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Input component (use our CustomInput as fallback)
  const InputComponent = CustomInput;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {subscription ? <Bell size={18} /> : <BellOff size={18} />}
          <span>Push Notifications</span>
        </CardTitle>
        <CardDescription>
          Get real-time updates on orders, promotions, and more
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 p-3 rounded mb-4 text-red-700 text-sm flex items-start">
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {subscription ? (
          <Tabs defaultValue="send">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="send" className="flex-1">
                Send Test
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex-1">
                Preferences
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="send">
              <div className="space-y-4">
                <p className="text-green-600 text-sm">
                  You are subscribed to push notifications.
                </p>

                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Send yourself a test notification:
                  </p>
                  <div className="flex gap-2">
                    <InputComponent
                      type="text"
                      placeholder="Enter notification message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendTestNotification}
                      disabled={isLoading || !message}
                    >
                      {isLoading ? "Sending..." : "Send"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="orderUpdates">Order Updates</Label>
                    <p className="text-sm text-gray-500">
                      Status changes & shipping information
                    </p>
                  </div>
                  <Switch
                    id="orderUpdates"
                    checked={preferences?.orderUpdates}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("orderUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="promotions">Promotions</Label>
                    <p className="text-sm text-gray-500">
                      Special offers and discounts
                    </p>
                  </div>
                  <Switch
                    id="promotions"
                    checked={preferences?.promotions}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("promotions", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="productRestock">Product Restocks</Label>
                    <p className="text-sm text-gray-500">
                      When items come back in stock
                    </p>
                  </div>
                  <Switch
                    id="productRestock"
                    checked={preferences?.productRestock}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("productRestock", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="priceDrops">Price Drops</Label>
                    <p className="text-sm text-gray-500">
                      When items on your wishlist drop in price
                    </p>
                  </div>
                  <Switch
                    id="priceDrops"
                    checked={preferences?.priceDrops}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("priceDrops", checked)
                    }
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              {lastNotification ? (
                <div className="p-3 border rounded mb-3">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{lastNotification.title}</h4>
                    <span className="text-xs text-gray-500">
                      {new Date(
                        lastNotification.timestamp
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{lastNotification.body}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent notifications</p>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <p className="text-sm">
              Stay updated with the latest deals and order status.
            </p>
            <Button
              onClick={subscribeToPush}
              disabled={isSubscribing}
              className="w-full"
            >
              {isSubscribing ? "Processing..." : "Subscribe to Notifications"}
            </Button>
          </div>
        )}
      </CardContent>

      {subscription && (
        <CardFooter className="flex justify-end border-t pt-4">
          <Button
            // variant="outline"
            // size="sm"
            onClick={unsubscribeFromPush}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Unsubscribe"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
