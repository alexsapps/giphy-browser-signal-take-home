import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { GIF } from '../../app/gifType';
import * as GiphyApi from '../../app/giphyApi';
import { AppDispatch, RootState } from '../../app/store';
import Reducer, { fetchGifsAsync, selectGifs, selectErrorLoadingGifs, selectIsLoading } from './infiniteGifScrollerSlice';
import { AnyAction, SerializedError } from '@reduxjs/toolkit';
import { setQuery } from '../search-box/searchBarSlice';

type InfiniteGifScrollerState = NonNullable<Parameters<typeof Reducer>[0]>;

jest.mock('../../app/giphyApi');

const middlewares = [thunk];
const mockStore = configureMockStore<RootState, AppDispatch>(middlewares);

describe('infiniteGifScrollerSlice', () => {
    function makeGif(): GIF {
        return {
            id: '1',
            webpage: '',
            title: 'gif1',
            fixedWidthImage: {
                url: 'fixed_url',
                width: 100,
                height: 200,
            },
            originalImage: {
                url: 'original_url',
                width: 200,
                height: 200,
            }
        };
    }

    function makeGifState(args: { gifs?: GIF[], error?: Error | null, isLoading?: boolean, isMore?: boolean }): InfiniteGifScrollerState {
        return {
            error: args.error || null,
            gifs: args.gifs || [],
            gifIndex: {},
            isLoading: args.isLoading === undefined ? false : args.isLoading, 
            isMore: args.isMore === undefined ? true : args.isMore,
            loadingRequestId: ''
        };
    }

    describe('async actions', () => {
        describe('fetchGifsAsync', () => {
            function makeAppState(args: { query: string, gifs: GIF[] }): RootState {
                return {
                    search: { query: args.query },
                    infiniteGifScroller: makeGifState({ gifs: args.gifs, error: null, isLoading: false, isMore: true }),
                    fullScreen: { gifId: null },
                }
            }

            test('calls Giphy API wrapper', async () => {
                const store = mockStore(makeAppState({ query: 'test', gifs: [] }));
                const spy = jest.spyOn(GiphyApi, 'fetchGifsFromGiphy');

                await store.dispatch(fetchGifsAsync({}));

                expect(spy).toHaveBeenCalledWith('test', 0);
            });

            test('calls Giphy API wrapper with offset', async () => {
                const store = mockStore(makeAppState({ query: 'test', gifs: [makeGif(), makeGif()] }));
                const spy = jest.spyOn(GiphyApi, 'fetchGifsFromGiphy');

                await store.dispatch(fetchGifsAsync({}));

                expect(spy).toHaveBeenCalledWith('test', 2);
            });
        });
    });

    describe('reducer', () => {
        test('sets isLoading', () => {
            const initialState = makeGifState({isLoading: false});

            const actualState = Reducer(initialState, fetchGifsAsync.pending('5', {}));

            expect(actualState.isLoading).toEqual(true);
        });

        function prepareStateForAction(state: InfiniteGifScrollerState, action: AnyAction) {
            state.loadingRequestId = '100';
            action.meta.requestId = '100';
        }

        test('sets error', () => {
            const initialState = makeGifState({error: null});

            const action = fetchGifsAsync.rejected(new Error('Error'), '5', {});
            prepareStateForAction(initialState, action);
            const actualState = Reducer(initialState, action);

            expect(actualState.error).toBeTruthy();
            expect(actualState.error!.message).toEqual('Error');
        });

        test('clears error on loading', () => {
            const initialState = makeGifState({error: {message: 'Error message', name: 'Error'}});

            const action = fetchGifsAsync.pending('5', {});
            prepareStateForAction(initialState, action);
            const actualState = Reducer(initialState, action);

            expect(actualState.error).toBe(null);
        });

        test('sets gifs', () => {
            const initialState = makeGifState({});

            const gif1 = makeGif(), gif2 = makeGif();
            gif1.id = '1';
            gif2.id = '2';
            const response: GiphyApi.GIFsResponse = {
                gifs: [gif1, gif2],
                isMore: true,
            };
            const action = fetchGifsAsync.fulfilled(response, '5', {});
            prepareStateForAction(initialState, action);
            const actualState = Reducer(initialState, action);

            expect(actualState.gifs.length).toBe(2);
            expect(actualState.gifs[0].id).toBe(gif1.id);
            expect(actualState.gifs[1].id).toBe(gif2.id);
        });

        test('sets isMore', () => {
            const initialState = makeGifState({isMore: false});

            const response: GiphyApi.GIFsResponse = {
                gifs: [makeGif(), makeGif()],
                isMore: true,
            };
            const action = fetchGifsAsync.fulfilled(response, '5', {});
            prepareStateForAction(initialState, action);
            const actualState = Reducer(initialState, action);

            expect(actualState.isMore).toBe(true);
        });

        test('clears isMore', () => {
            const initialState = makeGifState({isMore: true});

            const response: GiphyApi.GIFsResponse = {
                gifs: [makeGif(), makeGif()],
                isMore: false,
            };
            const action = fetchGifsAsync.fulfilled(response, '5', {});
            prepareStateForAction(initialState, action);
            const actualState = Reducer(initialState, action);

            expect(actualState.isMore).toBe(false);
        });

        test('sets more gifs', () => {
            const gif1 = makeGif();
            const initialState = makeGifState({gifs: [gif1]});

            const gif2 = makeGif();
            gif2.id = '2';
            const response: GiphyApi.GIFsResponse = {
                gifs: [gif2],
                isMore: false,
            };
            const action = fetchGifsAsync.fulfilled(response, '5', {});
            prepareStateForAction(initialState, action);
            const actualState = Reducer(initialState, action);

            expect(actualState.gifs.length).toBe(2);
            expect(actualState.gifs[0].id).toBe(gif1.id);
            expect(actualState.gifs[1].id).toBe(gif2.id);
        });

        test('populates index for first request', () => {
            const initialState = makeGifState({});

            const gif1 = makeGif(), gif2 = makeGif();
            gif1.id = '1';
            gif2.id = '2';
            const response: GiphyApi.GIFsResponse = {
                gifs: [gif1, gif2],
                isMore: true,
            };
            const action = fetchGifsAsync.fulfilled(response, '5', {});
            prepareStateForAction(initialState, action);
            const actualState = Reducer(initialState, action);

            expect(actualState.gifIndex['1']).toBe(0);
            expect(actualState.gifIndex['2']).toBe(1);
        });

        test('populates index for subsequent request', () => {
            const gif1 = makeGif();
            gif1.id = '1';
            const initialState = makeGifState({gifs: [gif1]});

            const gif2 = makeGif(), gif3 = makeGif();
            gif2.id = '2';
            gif3.id = '3';
            const response: GiphyApi.GIFsResponse = {
                gifs: [gif2, gif3],
                isMore: false,
            };
            const action = fetchGifsAsync.fulfilled(response, '5', {});
            prepareStateForAction(initialState, action);
            const actualState = Reducer(initialState, action);

            expect(actualState.gifIndex['2']).toBe(1);
            expect(actualState.gifIndex['3']).toBe(2);
        });

        test('clears state when query changes', () => {
            const initialState = makeGifState({error: new Error('error'), isLoading: true, isMore: false});
            initialState.gifIndex['test'] = 1;

            const response: GiphyApi.GIFsResponse = {
                gifs: [makeGif()],
                isMore: true,
            };
            const action = setQuery("query");
            const actualState = Reducer(initialState, action);

            expect(actualState.gifs.length).toBe(0);
            expect(actualState.error).toBe(null);
            expect(actualState.gifIndex['test']).toBeUndefined();
            expect(actualState.isLoading).toBe(false);
            expect(actualState.loadingRequestId).toBe('');
            expect(actualState.isMore).toBe(true);
        });

        test('ignores fulfilled request when query has changed since', () => {
            const initialState = makeGifState({});
            // Waiting for query with ID 2
            initialState.loadingRequestId = '2';

            const response: GiphyApi.GIFsResponse = {
                gifs: [makeGif(), makeGif()],
                isMore: true,
            };
            const action = fetchGifsAsync.fulfilled(response, '5', {});
            // Response from old query arrives
            action.meta.requestId = '1';
            const actualState = Reducer(initialState, action);

            expect(actualState.gifs.length).toBe(0);
        });

        test('ignores rejected request when query has changed since', () => {
            const initialState = makeGifState({});
            initialState.loadingRequestId = '2';

            const action = fetchGifsAsync.rejected(new Error('error'), '5', {});
            action.meta.requestId = '1';
            const actualState = Reducer(initialState, action);

            expect(actualState.error).toBe(null);
        });
    });

    describe('selectors', () => {
        describe('selectGifs', () => {
            test('selects gifs', () => {

            });
        });

        describe('selectErrorLoadingGifs', () => {
            test('selects error', () => {

            });
        });

        describe('selectIsLoading', () => {
            test('detects loading', () => {

            });
            test('detects not loading', () => {

            });
        });

        describe('selectIsMore', () => {
            test('detects more', () => {

            });
            test('detects no more', () => {

            });
        });
    });
})