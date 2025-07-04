
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getImageSrc } from "@/lib/server-actions";
// import { RootState } from "./store";

// interface ImageState {
//   [key: string]: {
//     url: string | null;
//     isLoading: boolean;
//     error: string | null;
//     lastFetched?: number;
//   };
// }

// interface FetchImageResult {
//   key: string;
//   url: string;
// }

// export const fetchImage = createAsyncThunk<
//   FetchImageResult,
//   { folderName: string; fileName: string },
//   { rejectValue: string }
// >("image/fetchImage", async ({ folderName, fileName }, { rejectWithValue }) => {
//   try {
//     const url = await getImageSrc({ folderName, fileName });
//     return { key: `${folderName}/${fileName}`, url };
//   } catch (error) {
//     return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch image');
//   }
// });

// const imageSlice = createSlice({
//   name: "image",
//   initialState: {} as ImageState,
//   reducers: {
//     clearImageCache: () => ({}),
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchImage.pending, (state, action) => {
//         const key = `${action.meta.arg.folderName}/${action.meta.arg.fileName}`;
//         state[key] = { url: null, isLoading: true, error: null };
//       })
//       .addCase(fetchImage.fulfilled, (state, action) => {
//         state[action.payload.key] = {
//           url: action.payload.url,
//           isLoading: false,
//           error: null,
//           lastFetched: Date.now(),
//         };
//       })
//       .addCase(fetchImage.rejected, (state, action) => {
//         const key = `${action.meta.arg.folderName}/${action.meta.arg.fileName}`;
//         state[key] = {
//           url: null,
//           isLoading: false,
//           error: action.payload || 'Failed to load image',
//           lastFetched: Date.now(),
//         };
//       });
//   },
// });

// export const { clearImageCache } = imageSlice.actions;
// export const selectImage = (key: string) => (state: RootState) => state.image[key];
// export default imageSlice.reducer;



import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getImageSrc } from "@/lib/server-actions";
import { RootState } from "../store";
import { PURGE } from 'redux-persist';

interface ImageState {
  [key: string]: {
    url: string | null;
    isLoading: boolean;
    error: string | null;
    lastFetched?: number;
  };
}

interface FetchImageResult {
  key: string;
  url: string;
}

export const fetchImage = createAsyncThunk<
  FetchImageResult,
  { folderName: string; fileName: string },
  { rejectValue: string }
>("image/fetchImage", async ({ folderName, fileName }, { rejectWithValue }) => {
  try {
    const url = await getImageSrc({ folderName, fileName });
    return { key: `${folderName}/${fileName}`, url };
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch image');
  }
});

const initialState: ImageState = {};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    clearImageCache: () => ({}),
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImage.pending, (state, action) => {
        const key = `${action.meta.arg.folderName}/${action.meta.arg.fileName}`;
        state[key] = { url: null, isLoading: true, error: null };
      })
      .addCase(fetchImage.fulfilled, (state, action) => {
        state[action.payload.key] = {
          url: action.payload.url,
          isLoading: false,
          error: null,
          lastFetched: Date.now(),
        };
      })
      .addCase(fetchImage.rejected, (state, action) => {
        const key = `${action.meta.arg.folderName}/${action.meta.arg.fileName}`;
        state[key] = {
          url: null,
          isLoading: false,
          error: action.payload || 'Failed to load image',
          lastFetched: Date.now(),
        };
      })
      // Handle Redux Persist purge action
      .addCase(PURGE, () => initialState);
  },
});

export const { clearImageCache } = imageSlice.actions;
export const selectImage = (key: string) => (state: RootState) => state.image[key];
export default imageSlice.reducer;