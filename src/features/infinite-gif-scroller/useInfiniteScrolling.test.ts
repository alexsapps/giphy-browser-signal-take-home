import { loadavg } from 'os';
import { shouldFetchMore } from './useInfiniteScrolling';

describe('shouldFetchMore', () => {
    function shouldFetchMoreTest(args: {
        scrollHeight: number,
        scrollTop: number,
        clientHeight: number,
        loadWhenRemainingScrollLessThan: number
    }) {
        return shouldFetchMore(args.scrollHeight, args.scrollTop, args.clientHeight, args.loadWhenRemainingScrollLessThan);
    }

    test('fetches when screen is empty', () => {
        expect(shouldFetchMoreTest({
            scrollHeight: 1000,
            scrollTop: 0,
            clientHeight: 0,
            loadWhenRemainingScrollLessThan: 0
        })).toBe(false);
    });

    test('does not fetch more when screen is filled, no pre-loading', () => {
        expect(shouldFetchMoreTest({
            scrollHeight: 1000,
            scrollTop: 0,
            clientHeight: 1000,
            loadWhenRemainingScrollLessThan: 0
        })).toBe(false);
    });

    test('fetches more when screen is filled, with pre-loading', () => {
        expect(shouldFetchMoreTest({
            scrollHeight: 1000,
            scrollTop: 0,
            clientHeight: 1000,
            loadWhenRemainingScrollLessThan: 100
        })).toBe(true);
    });

    test('fetches more when scrolled down', () => {
        expect(shouldFetchMoreTest({
            scrollHeight: 2000,
            scrollTop: 1100,
            clientHeight: 1000,
            loadWhenRemainingScrollLessThan: 0
        })).toBe(true);
    });
});