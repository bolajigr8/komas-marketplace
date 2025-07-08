// "use client";

// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import cartReducer from "./store-slices/CartSlice";
// import deliveryReducer from "./store-slices/DeliverySlice";
// import imageReducer from "./image-slice";

// const rootReducer = combineReducers({
//   cart: cartReducer,
//   delivery: deliveryReducer,
//   image: imageReducer,
// });

// export type RootState = ReturnType<typeof rootReducer>;

// function loadState() {
//   try {
//     if (typeof window !== 'undefined') {
//       const serializedState = localStorage.getItem('reduxState');
//       return serializedState ? JSON.parse(serializedState) : undefined;
//     }
//     return undefined;
//   } catch {
//     return undefined;
//   }
// }

// function saveState(state: RootState) {
//   try {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('reduxState', JSON.stringify(state));
//     }
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// }

// function initStore(preloadedState = undefined) {
//   return configureStore({
//     reducer: rootReducer,
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({
//         serializableCheck: false,
//       }),
//     preloadedState,
//     devTools: process.env.NODE_ENV !== 'production',
//   });
// }

// // Declare type after the init function is defined
// type StoreType = ReturnType<typeof initStore>;
// let browserStore: StoreType | undefined;

// export const store = (() => {
//   if (typeof window === 'undefined') {
//     return initStore();
//   }

//   if (!browserStore) {
//     const preloadedState = loadState();
//     browserStore = initStore(preloadedState);

//     // Make sure browserStore is initialized before subscribing
//     if (browserStore) {
//       browserStore.subscribe(() => {
//         saveState(browserStore!.getState());
//       });
//     }
//   }

//   return browserStore;
// })();

// export type AppDispatch = typeof store.dispatch;

'use client'

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import cartReducer from './store-slices/CartSlice'
import deliveryReducer from './store-slices/DeliverySlice'
import imageReducer from './store-slices/image-slice'
import subscriptionReducer from './store-slices/subscriptionSlice'

import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: string) {
      return Promise.resolve(value)
    },
    removeItem(_key: string) {
      return Promise.resolve()
    },
  }
}

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage()

const rootReducer = combineReducers({
  cart: cartReducer,
  delivery: deliveryReducer,
  image: imageReducer,
  subscription: subscriptionReducer,
})

export type RootState = ReturnType<typeof rootReducer>

// Configure persist options
const persistConfig = {
  key: 'root',
  storage,
  // You can blacklist specific reducers if needed
  // blacklist: ['image'], // Uncomment if you don't want to persist image cache
}

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Handle Next.js SSR properly
function initStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  })
}

// Store type
type StoreType = ReturnType<typeof initStore>
let browserStore: StoreType | undefined

export const store = (() => {
  if (typeof window === 'undefined') {
    return initStore()
  }

  if (!browserStore) {
    browserStore = initStore()
  }

  return browserStore
})()

export const persistor = persistStore(store)
export type AppDispatch = typeof store.dispatch
