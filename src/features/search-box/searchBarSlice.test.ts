import Reducer, { selectQuery, setQuery } from './searchBarSlice';

type SearchBarState = NonNullable<Parameters<typeof Reducer>[0]>;

describe('searchBarSlice', () => {
    describe('actions', () => {
        describe('setQuery', () => {
            test('sets query', () => {
                const q = 'test';
    
                expect(setQuery(q)).toEqual({
                    type: setQuery.type,
                    payload: q
                })
            });
        });
    });

    describe('reducer', () => {
        test('sets query', () => {
            const initialState: SearchBarState = { query: ''}

            const actualState = Reducer(initialState, setQuery('test'));

            const expectedState: SearchBarState = { query: 'test' }
            expect(actualState).toEqual(expectedState);
        });

        test('clears query', () => {
            const initialState: SearchBarState = { query: 'test'}

            const actualState = Reducer(initialState, setQuery(''));

            const expectedState: SearchBarState = { query: '' }
            expect(actualState).toEqual(expectedState);
        });
    });

    describe('selectors', () => {
        describe('selectQuery', () => {
            test('gets query', () => {
                const initialState: SearchBarState = { query: 'test'};

                expect (selectQuery.resultFunc(initialState)).toBe('test');
            });
        })
    });
})