import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { setQuery } from '../search-box/searchBarSlice';

interface FullScreenState {
  gifId: string | null
}

const initialState: FullScreenState = {
  gifId: null
};

export const fullScreenSlice = createSlice({
  name: 'fullScreen',
  initialState,
  reducers: {
    showFullScreen: (state, action: PayloadAction<string>) => {
      state.gifId = action.payload;
    },
    closeFullScreen: (state) => {
      state.gifId = null;
    },
  },
  extraReducers: builder => {
    builder.addCase(setQuery, (state, action) => {
      state.gifId = null;
    });
  }
});

export const { showFullScreen, closeFullScreen } = fullScreenSlice.actions;

const selectFullScreenState = (state: RootState) => state.fullScreen;

export const selectFullScreenGifId = createSelector(selectFullScreenState, (state: FullScreenState) => {
  return state.gifId;
});

export const isFullScreenMode = createSelector(selectFullScreenState, (state: FullScreenState) => {
  return state.gifId !== null;
});

export default fullScreenSlice.reducer;
