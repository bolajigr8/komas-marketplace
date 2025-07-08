

// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { PURGE } from 'redux-persist';

// interface SubscriptionState {
//   subscription: PushSubscription | null;
// }

// const initialState: SubscriptionState = {
//   subscription: null,
// };

// const subscriptionSlice = createSlice({
//   name: 'subscription',
//   initialState,
//   reducers: {
//     setSubscription: (state, action: PayloadAction<PushSubscription | null>) => {
//       state.subscription = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(PURGE, () => initialState);
//   },
// });

// export const { setSubscription } = subscriptionSlice.actions;
// export default subscriptionSlice.reducer;



import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PURGE } from 'redux-persist';

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  productRestock: boolean;
  priceDrops: boolean;
}

interface SubscriptionState {
  subscription: PushSubscription | null;
  isSubscribing: boolean;
  error: string | null;
  preferences: NotificationPreferences;
  lastNotification: {
    title: string;
    body: string;
    timestamp: number;
  } | null;
}

const initialState: SubscriptionState = {
  subscription: null,
  isSubscribing: false,
  error: null,
  preferences: {
    orderUpdates: true,
    promotions: true,
    productRestock: false,
    priceDrops: false
  },
  lastNotification: null
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscription: (state, action: PayloadAction<PushSubscription | null>) => {
      state.subscription = action.payload;
      state.error = null;
    },
    subscriptionRequested: (state) => {
      state.isSubscribing = true;
      state.error = null;
    },
    subscriptionSuccess: (state, action: PayloadAction<PushSubscription>) => {
      state.subscription = action.payload;
      state.isSubscribing = false;
      state.error = null;
    },
    subscriptionFailed: (state, action: PayloadAction<string>) => {
      state.isSubscribing = false;
      state.error = action.payload;
    },
    updatePreferences: (state, action: PayloadAction<Partial<NotificationPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    recordNotification: (state, action: PayloadAction<{ title: string; body: string }>) => {
      state.lastNotification = {
        ...action.payload,
        timestamp: Date.now()
      };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, () => initialState);
  },
});

export const { 
  setSubscription, 
  subscriptionRequested,
  subscriptionSuccess,
  subscriptionFailed,
  updatePreferences,
  recordNotification,
  clearError
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;