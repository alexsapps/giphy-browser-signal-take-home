import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import searchReducer from '../features/search-box/searchBarSlice';
import infiniteGifScrollerReducer from '../features/infinite-gif-scroller/infiniteGifScrollerSlice';
import fullScreenReducer from '../features/full-screen-gif/fullScreenGifSlice';
import { useDispatch } from 'react-redux';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    infiniteGifScroller: infiniteGifScrollerReducer,
    fullScreen: fullScreenReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

// https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()