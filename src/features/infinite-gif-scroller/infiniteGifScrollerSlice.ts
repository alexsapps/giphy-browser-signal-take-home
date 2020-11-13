import { createAsyncThunk, createSelector, createSlice, SerializedError } from '@reduxjs/toolkit';
import { GIF } from '../../app/gifType';
import { fetchGifsFromGiphy, GIFsResponse } from '../../app/giphyApi';
import { AppDispatch, RootState } from '../../app/store';
import { selectQuery, setQuery } from '../search-box/searchBarSlice';

interface InfiniteGifScrollerState {
    gifs: GIF[],
    gifIndex: Record<string, number>,
    isMore: boolean,
    error: SerializedError|null,
    isLoading: boolean,
    loadingRequestId: string,
}

const initialState: InfiniteGifScrollerState = {
    gifs: [],
    gifIndex: {},
    isMore: true,
    error: null,
    isLoading: false,
    loadingRequestId: '',
};

export const fetchGifsAsync = createAsyncThunk<GIFsResponse, {}, {
    dispatch: AppDispatch
    state: RootState}>(
    'infiniteGifScroller/fetchGifsAsyncStatus',
    async (arg: {}, {dispatch, getState}) => {
        const state = getState();
        const query = selectQuery(state);
        const offset = selectGifs(state).length;

        return fetchGifsFromGiphy(query, offset);
    }
);

export const infiniteGifScrollerSlice = createSlice({
    name: 'infiniteGifScroller',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchGifsAsync.pending, (state, action) => {
            state.isLoading = true;
            state.loadingRequestId = action.meta.requestId;
            state.error = null;
        });
        builder.addCase(fetchGifsAsync.fulfilled, (state, action) => {
            if (action.meta.requestId !== state.loadingRequestId) return;

            const gifs = action.payload.gifs;
            state.gifs = state.gifs.concat(gifs);
            state.isMore = action.payload.isMore;
            state.error = null;
            state.isLoading = false;
            state.loadingRequestId = '';

            // TODO: test
            for (let i = 0; i < gifs.length; i++) {
                state.gifIndex[gifs[i].id] =
                    state.gifs.length - gifs.length + i;
            }
        });
        builder.addCase(fetchGifsAsync.rejected, (state, action) => {
            if (action.meta.requestId !== state.loadingRequestId) return;

            console.error(action.error);
            state.error = action.error;
            state.isLoading = false;
            state.loadingRequestId = '';
            if (action.payload) {
                console.log("Ignoring value of rejected fetchGifsAsync request.");
            }
        });
        builder.addCase(setQuery, (state, action) => {
            state.error = null;
            state.gifs = [];
            state.gifIndex = {};
            state.isMore = true;
            state.isLoading = false;
            state.loadingRequestId = '';
        });
    }
});

const selectInfiniteGifScrollerState = (state: RootState) => state.infiniteGifScroller;
export const selectGifs = createSelector(selectInfiniteGifScrollerState, (state: InfiniteGifScrollerState) => state.gifs);
export const selectErrorLoadingGifs = createSelector(selectInfiniteGifScrollerState, (state: InfiniteGifScrollerState) => state.error);
export const selectIsLoading = createSelector(selectInfiniteGifScrollerState, (state: InfiniteGifScrollerState) => state.isLoading);
export const selectIsMore = createSelector(selectInfiniteGifScrollerState, (state: InfiniteGifScrollerState) => state.isMore);

export default infiniteGifScrollerSlice.reducer;
