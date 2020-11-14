import { GIFObject, MultiResponse as GiphyMultiResponse } from "giphy-api";
import {fetchGifsFromGiphy} from './giphyApi';
import fetchMock from 'fetch-mock';
import { GIF } from "./gifType";

// https://stackoverflow.com/questions/61132262/typescript-deep-partial
type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};

describe('fetchGifsFromGiphy', () => {
    beforeEach(() => {
        fetchMock.restore();
    });

    function makeResponse(args?: {gifs?: DeepPartial<GIFObject>[], total?: number, count?: number, offset?: number}): GiphyMultiResponse {
        const pagination = {
            total_count: args?.total ?? 100,
            count: args?.count ?? 0,
            offset: args?.offset ?? 0,
        };

        return {data: args?.gifs ?? [], pagination} as GiphyMultiResponse;
    }

    // https://api.giphy.com/v1/gifs/trending?api_key=AMGYbpPUUP6ckwNejfMX6dPlyxAWyKIX&limit=8&offset=0
    test('fetches trending without query', async () => {
        fetchMock.mock('begin:https://api.giphy.com/v1/gifs/trending?', makeResponse());

        await fetchGifsFromGiphy('', 0);

        expect(fetchMock.calls().length).toBe(1);
    });

    test('fetches search endpoint with query', async () => {
        fetchMock.mock('begin:https://api.giphy.com/v1/gifs/search?', makeResponse());

        await fetchGifsFromGiphy('test-query', 0);

        expect(fetchMock.calls().length).toBe(1);
        expect(fetchMock.calls()[0][0]).toContain("q=test-query");
    });

    test('sets isMore when there are more', async () => {
        fetchMock.mock('begin:https://api.giphy.com/v1/gifs/trending?', makeResponse({count: 5, offset: 0, total: 10}));

        expect ((await fetchGifsFromGiphy('', 0)).isMore).toBe(true);
    });

    test('does not set isMore when there are not more', async () => {
        fetchMock.mock('begin:https://api.giphy.com/v1/gifs/trending?', makeResponse({count: 5, offset: 5, total: 10}));

        expect ((await fetchGifsFromGiphy('', 0)).isMore).toBe(false);
    });

    test('populates GIF properties', async () => {
        fetchMock.mock('begin:https://api.giphy.com/v1/gifs/trending?', makeResponse({gifs: [{
            id: '1',
            url: 'webpage',
            title: 'title',
            images: {
                fixed_width: {
                    width: '100',
                    height: '150',
                    url: 'fixed',
                },
                original: {
                    width: '200',
                    height: '250',
                    url: 'original',
                }
            }
        }]}));

        const expected: GIF = {
            id: '1',
            webpage: 'webpage',
            title: 'title',
            fixedWidthImage: {
                width: 100,
                height: 150,
                url: 'fixed',
            },
            originalImage: {
                width: 200,
                height: 250,
                url: 'original',
            },
        };

        expect ((await fetchGifsFromGiphy('', 0)).gifs).toEqual([expected]);
    });
});