import { GIFObject as GiphyGIFObject, MultiResponse as GiphyMultiResponse } from "giphy-api";
import { GIF, GIFImage } from "./gifType";

const API_KEY = 'AMGYbpPUUP6ckwNejfMX6dPlyxAWyKIX';
const LIMIT = 8;

export type GIFsResponse = {
    gifs: GIF[],
    isMore: boolean,
}

/**
 * Fetches GIFs from the Giphy API.
 * @param query Search query. If empty, trending gifs are fetched.
 * @param offset Offset to start searching.
 */
export async function fetchGifsFromGiphy(query: string, offset: number): Promise<GIFsResponse> {
    let endpoint = 'https://api.giphy.com/v1/gifs/trending';
    if (query !== '') {
        endpoint = 'https://api.giphy.com/v1/gifs/search';
    }

    const url = new URL(endpoint);
    url.searchParams.append("api_key", API_KEY);
    if (query !== '') {
        url.searchParams.append("q", query);
    }
    url.searchParams.append("limit", LIMIT.toString());
    url.searchParams.append("offset", offset.toString());
    endpoint = url.toString();

    return fetch(endpoint)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error fetching GIFs from Giphy. Status code: ${response.status}, status text: ${response.statusText}`);
            }

            return response.json();
        })
        .then((response: GiphyMultiResponse) => {
            if (response.meta && response.meta.status !== 200) {
                throw new Error(`Error fetching GIFs from Giphy. Meta status code: ${response.meta.status}, response id: ${response.meta.response_id}, message: ${response.meta.msg}`);
            }

            if (!response.pagination) {
                // This actually happens.
                throw new Error("Giphy isn't working right now.");
            }
            
            const {offset, count, total_count} = response.pagination;
            const isMore = offset + count < total_count;
            const gifs = (response.data as GiphyGIFObject[]).map(GiphyGifToCustomObject);
            return { gifs, isMore };
        });
}

// Avoid leaking Giphy's API throughout the app to ease future migrations or
// abstractions.
function GiphyGifToCustomObject(giphy: GiphyGIFObject): GIF {
    return {
        id: giphy.id,
        webpage: giphy.url,
        title: giphy.title,
        fixedWidthImage: GiphyImageToCustomObject(giphy.images.fixed_width),
        originalImage: GiphyImageToCustomObject(giphy.images.original)
    };
}

function GiphyImageToCustomObject(giphy: {
    url: string;
    width: string;
    height: string;
}): GIFImage {
    return {
        url: giphy.url,
        width: parseInt(giphy.width),
        height: parseInt(giphy.height),
    };
}