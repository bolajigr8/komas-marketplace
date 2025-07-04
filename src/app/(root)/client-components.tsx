// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import PushNotificationManager from "@/components/General/PushNotificationManager";
// import {
//   subscribeUser,
//   unsubscribeUser,
//   sendNotification,
//   applyPromoCode,
// } from "../actions";
// import { BellRing, Download, Tag, X, Check } from "lucide-react";

// type BeforeInstallPromptEvent = Event & {
//   prompt: () => Promise<void>;
//   userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
// };

// type PromoResult = {
//   success: boolean;
//   error?: string;
//   discount?: number;
//   type?: string;
// };

// // InstallPrompt component for PWA installation
// export function InstallPrompt() {
//   const [isIOS, setIsIOS] = useState<boolean>(false);
//   const [isStandalone, setIsStandalone] = useState<boolean>(false);
//   const [deferredPrompt, setDeferredPrompt] =
//     useState<BeforeInstallPromptEvent | null>(null);

//   useEffect(() => {
//     // Check if iOS device
//     setIsIOS(
//       /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
//     );

//     // Check if already installed as PWA
//     setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

//     // Handle beforeinstallprompt event for non-iOS
//     const handleBeforeInstallPrompt = (e: Event) => {
//       // Prevent the mini-infobar from appearing on mobile
//       e.preventDefault();
//       // Store the event for later use
//       setDeferredPrompt(e as BeforeInstallPromptEvent);
//     };

//     window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

//     return () => {
//       window.removeEventListener(
//         "beforeinstallprompt",
//         handleBeforeInstallPrompt
//       );
//     };
//   }, []);

//   const handleInstallClick = async () => {
//     if (!deferredPrompt) return;

//     // Show the install prompt
//     deferredPrompt.prompt();

//     // Wait for the user to respond to the prompt
//     const choiceResult = await deferredPrompt.userChoice;

//     // Reset the deferred prompt variable
//     setDeferredPrompt(null);

//     // Track the outcome for analytics
//     if (choiceResult.outcome === "accepted") {
//       console.log("User accepted the install prompt");
//     } else {
//       console.log("User dismissed the install prompt");
//     }
//   };

//   if (isStandalone) {
//     return null;
//   }

//   return (
//     // <div className="p-4 bg-gray-100 rounded-lg my-4">
//     //   <h3 className="text-xl font-bold mb-2">Install App</h3>
//     //   {!isIOS && deferredPrompt ? (
//     //     <Button onClick={handleInstallClick} className="w-full mb-2">
//     //       Add to Home Screen
//     //     </Button>
//     //   ) : null}

//     //   {isIOS && (
//     //     <div className="p-3 bg-blue-50 rounded border border-blue-200">
//     //       <p className="text-sm">
//     //         To install this app on your iOS device, tap the share button
//     //         <span role="img" aria-label="share icon">
//     //           {" "}
//     //           ⎋{" "}
//     //         </span>
//     //         and then "Add to Home Screen"
//     //         <span role="img" aria-label="plus icon">
//     //           {" "}
//     //           ➕{" "}
//     //         </span>
//     //         .
//     //       </p>
//     //     </div>
//     //   )}
//     // </div>

//     <div className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm">
//       <Download className="w-4 h-4 mr-2" />

//       {!isIOS && deferredPrompt ? (
//         <button
//           onClick={handleInstallClick}
//           className="font-medium hover:underline"
//         >
//           Install App
//         </button>
//       ) : null}

//       {isIOS && (
//         <span className="font-medium">
//           Add to Home Screen via <span className="mx-1">⎋</span> menu
//         </span>
//       )}
//     </div>
//   );
// }

// // PromoCode component
// export function PromoCodeSection() {
//   const [promoCode, setPromoCode] = useState<string>("");
//   const [promoResult, setPromoResult] = useState<PromoResult | null>(null);
//   const [isApplying, setIsApplying] = useState<boolean>(false);

//   const handlePromoApply = async () => {
//     if (!promoCode) return;

//     setIsApplying(true);
//     try {
//       const result = await applyPromoCode(promoCode);
//       setPromoResult(result);

//       // If promo is valid, send notification
//       if (result.success) {
//         const discountText =
//           result.type === "percentage"
//             ? `${result.discount}% off`
//             : `$${result.discount} off`;

//         sendNotification(
//           `Promo code ${promoCode} applied! You got ${discountText}.`
//         );
//       }
//     } catch (error) {
//       console.error("Error applying promo code:", error);
//     } finally {
//       setIsApplying(false);
//     }
//   };

//   return (
//     <div className="relative bg-white rounded-lg shadow-sm overflow-hidden">
//       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 to-purple-500"></div>

//       <div className="p-4">
//         <div className="flex items-center mb-3">
//           <Tag className="w-5 h-5 text-indigo-500 mr-2" />
//           <h3 className="font-medium">Apply Discount Code</h3>
//         </div>

//         <div className="flex">
//           <input
//             type="text"
//             placeholder="Enter promo code"
//             value={promoCode}
//             onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
//             className="flex-1 p-2 border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
//           />
//           <button
//             onClick={handlePromoApply}
//             disabled={isApplying || !promoCode}
//             className="px-4 py-2 bg-indigo-600 text-white rounded-r-md disabled:opacity-50 hover:bg-indigo-700 transition-colors"
//           >
//             {isApplying ? "..." : "Apply"}
//           </button>
//         </div>

//         {promoResult && (
//           <div
//             className={`mt-3 p-2 rounded-md text-sm flex items-start ${
//               promoResult.success
//                 ? "bg-green-50 text-green-700"
//                 : "bg-red-50 text-red-700"
//             }`}
//           >
//             {promoResult.success ? (
//               <>
//                 <Check className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
//                 <p>
//                   {promoResult.type === "percentage"
//                     ? `${promoResult.discount}% discount applied`
//                     : `$${promoResult.discount} discount applied`}
//                 </p>
//               </>
//             ) : (
//               <>
//                 <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
//                 <p>{promoResult.error}</p>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export function PushNotificationManagerWrapper() {
//   // You could add local state/UI improvements here if needed
//   return (
//     <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
//       <BellRing className="w-4 h-4 mr-2" />
//       <PushNotificationManager />
//     </div>
//   );
// }

// "use client";

// export { InstallPromptToast } from "./InstallPromptToast";
