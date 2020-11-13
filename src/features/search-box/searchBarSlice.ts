import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

interface SearchBarState {
    query: string;
}

const initialState: SearchBarState = {
    query: '',
};

export const searchBarSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setQuery: (state, action: PayloadAction<string>) => {
            state.query = action.payload;
        },
    },
});

export const { setQuery } = searchBarSlice.actions;

const selectSearchBarState = (state: RootState) =>  state.search;

export const selectQuery = createSelector(selectSearchBarState, (state: SearchBarState) => state.query);

export default searchBarSlice.reducer;
