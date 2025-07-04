// "use client";

// import React from "react";
// import { Provider } from "react-redux";
// import { store } from "./store";

// const StoreProvider = ({ children }: { children: React.ReactNode }) => {
//   return <Provider store={store}>{children}</Provider>;
// };

// export default StoreProvider;

"use client";

import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store";
import Loader from "@/components/General/Loader";

const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loader />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default StoreProvider;
