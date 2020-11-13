import { GIF } from "../gifType";

export type GIFsResponse = {
    gifs: GIF[],
    isMore: boolean,
}

export async function fetchGifsFromGiphy(query: string, offset: number): Promise<GIFsResponse> {
    return new Promise((resolve, reject) => {
        resolve({
            gifs: [
                {   
                    id: '1',
                    webpage: '',
                    title: 'gif 1',
                    fixedWidthImage: {
                        url: '1fix.gif',
                        width: 100,
                        height: 100,
                    },
                    originalImage: {
                        url: '1orig.gif',
                        width: 200,
                        height: 200,
                    },
                },
                {   
                    id: '2',
                    webpage: '',
                    title: 'gif 2',
                    fixedWidthImage: {
                        url: '2fix.gif',
                        width: 100,
                        height: 100,
                    },
                    originalImage: {
                        url: '2orig.gif',
                        width: 200,
                        height: 200,
                    },
                },
            ],
            isMore: true,
        });
    });
}