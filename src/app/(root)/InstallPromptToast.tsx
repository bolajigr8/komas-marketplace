// "use client";

// import { useState, useEffect } from "react";
// import { Download, X } from "lucide-react";

// // Implement useLocalStorage hook directly
// function useLocalStorage<T>(
//   key: string,
//   initialValue: T
// ): [T, (value: T) => void] {
//   // Get from local storage then parse stored json or return initialValue
//   const readValue = (): T => {
//     // Prevent build error "window is undefined" but keep working
//     if (typeof window === "undefined") {
//       return initialValue;
//     }

//     try {
//       const item = window.localStorage.getItem(key);
//       return item ? (JSON.parse(item) as T) : initialValue;
//     } catch (error) {
//       console.warn(`Error reading localStorage key "${key}":`, error);
//       return initialValue;
//     }
//   };

//   // State to store our value
//   const [storedValue, setStoredValue] = useState<T>(readValue);

//   // Return a wrapped version of useState's setter function that persists the new value to localStorage
//   const setValue = (value: T) => {
//     try {
//       // Allow value to be a function so we have the same API as useState
//       const valueToStore =
//         value instanceof Function ? value(storedValue) : value;

//       // Save state
//       setStoredValue(valueToStore);

//       // Save to local storage
//       if (typeof window !== "undefined") {
//         window.localStorage.setItem(key, JSON.stringify(valueToStore));
//       }
//     } catch (error) {
//       console.warn(`Error setting localStorage key "${key}":`, error);
//     }
//   };

//   return [storedValue, setValue];
// }

// type BeforeInstallPromptEvent = Event & {
//   prompt: () => Promise<void>;
//   userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
// };

// export function InstallPromptToast() {
//   const [isIOS, setIsIOS] = useState<boolean>(false);
//   const [isStandalone, setIsStandalone] = useState<boolean>(false);
//   const [deferredPrompt, setDeferredPrompt] =
//     useState<BeforeInstallPromptEvent | null>(null);
//   const [showPrompt, setShowPrompt] = useState<boolean>(false);
//   const [dismissed, setDismissed] = useLocalStorage(
//     "install-prompt-dismissed",
//     false
//   );

//   useEffect(() => {
//     // Don't show if already dismissed
//     if (dismissed) return;

//     // Check if iOS device
//     const isIOSDevice =
//       /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
//     setIsIOS(isIOSDevice);

//     // Check if already installed as PWA
//     const isInStandaloneMode = window.matchMedia(
//       "(display-mode: standalone)"
//     ).matches;
//     setIsStandalone(isInStandaloneMode);

//     // If already installed or in standalone mode, don't show prompt
//     if (isInStandaloneMode) return;

//     // Handle beforeinstallprompt event for non-iOS
//     const handleBeforeInstallPrompt = (e: Event) => {
//       // Prevent the mini-infobar from appearing on mobile
//       e.preventDefault();
//       // Store the event for later use
//       setDeferredPrompt(e as BeforeInstallPromptEvent);
//       // Show our custom prompt after a short delay (let page load first)
//       setTimeout(() => setShowPrompt(true), 2000);
//     };

//     window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

//     // For iOS, show the prompt after a delay if user has visited before
//     // This mimics the behavior we want since iOS doesn't have beforeinstallprompt
//     if (isIOSDevice) {
//       const hasVisitedBefore = localStorage.getItem("visited-before");
//       if (hasVisitedBefore) {
//         setTimeout(() => setShowPrompt(true), 2000);
//       } else {
//         localStorage.setItem("visited-before", "true");
//       }
//     }

//     return () => {
//       window.removeEventListener(
//         "beforeinstallprompt",
//         handleBeforeInstallPrompt
//       );
//     };
//   }, [dismissed]);

//   const handleInstallClick = async () => {
//     if (!deferredPrompt) return;

//     // Show the install prompt
//     deferredPrompt.prompt();

//     // Wait for the user to respond to the prompt
//     const choiceResult = await deferredPrompt.userChoice;

//     // Reset the deferred prompt variable
//     setDeferredPrompt(null);

//     // Hide our custom prompt
//     setShowPrompt(false);

//     // Mark as dismissed regardless of outcome to avoid annoying users
//     setDismissed(true);
//   };

//   const handleDismiss = () => {
//     setShowPrompt(false);
//     setDismissed(true);
//   };

//   //   if (isStandalone || !showPrompt) {
//   //     return null;
//   //   }

//   return (
//     <div className="fixed bottom-4 right-4 z-50 max-w-xs bg-white rounded-lg shadow-lg overflow-hidden animate-slideUp">
//       <div className="relative">
//         <button
//           onClick={handleDismiss}
//           className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
//         >
//           <X className="w-4 h-4" />
//         </button>

//         <div className="p-4 pt-3">
//           <div className="flex items-center mb-2">
//             <Download className="w-5 h-5 text-primary-600 mr-2" />
//             <h3 className="font-medium text-gray-800">Install Komas App</h3>
//           </div>

//           <p className="text-xs text-gray-600 mb-3">
//             {isIOS
//               ? "Add to Home Screen for a faster shopping experience"
//               : "Install our app for a better shopping experience"}
//           </p>

//           {!isIOS && deferredPrompt ? (
//             <button
//               onClick={handleInstallClick}
//               className="w-full py-2 px-3 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
//             >
//               Install Now
//             </button>
//           ) : isIOS ? (
//             <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
//               Tap <span className="mx-1">⎋</span> then "Add to Home Screen"
//             </div>
//           ) : null}
//         </div>
//       </div>
//     </div>
//   );
// }
