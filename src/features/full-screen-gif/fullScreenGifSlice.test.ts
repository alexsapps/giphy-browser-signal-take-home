import { RootState } from '../../app/store';
import Reducer, { showFullScreen, closeFullScreen, selectFullScreenGifId, isFullScreenMode } from './fullScreenGifSlice';

type FullScreenState = NonNullable<Parameters<typeof Reducer>[0]>;

describe('fullScreenSlice', () => {
    describe('actions', () => {
        describe('showFullScreen', () => {
            test('sets ID', () => {    
                expect(showFullScreen('5')).toEqual({
                    type: showFullScreen.type,
                    payload: '5'
                })
            });
        });

        describe('closeFullScreen', () => {
            test('clears ID', () => {    
                expect(closeFullScreen()).toEqual({
                    type: closeFullScreen.type,
                })
            });
        });
    });

    describe('reducer', () => {
        test('enables fullscreen', () => {
            const initialState: FullScreenState = { gifId: null}

            const actualState = Reducer(initialState, showFullScreen('5'));

            const expectedState: FullScreenState = { gifId: '5' }
            expect(actualState).toEqual(expectedState);
        });

        test('closes fullscreen', () => {
            const initialState: FullScreenState = { gifId: '5'}

            const actualState = Reducer(initialState, closeFullScreen());

            const expectedState: FullScreenState = { gifId: null }
            expect(actualState).toEqual(expectedState);
        });
    });

    describe('selectors', () => {
        describe('selectFullScreenGifId', () => {
            test('gets ID of full screen gif', () => {
                const initialState: FullScreenState = { gifId: '5'};

                expect (selectFullScreenGifId.resultFunc(initialState)).toBe('5');
            });
        })

        describe('selectFullScreenGifId', () => {
            test('detects full screen mode', () => {
                const initialState: FullScreenState = { gifId: '5'};

                expect (isFullScreenMode.resultFunc(initialState)).toBe(true);
            });

            test('detects not full screen mode', () => {
                const initialState: FullScreenState = { gifId: null};

                expect (isFullScreenMode.resultFunc(initialState)).toBe(false);
            });
        })
    });
})