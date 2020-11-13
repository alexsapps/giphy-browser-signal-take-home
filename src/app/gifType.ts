export type GIF = {
    id: string;
    webpage: string;
    title: string;
    fixedWidthImage: GIFImage;
    originalImage: GIFImage;
};

export type GIFImage = {
    url: string;
    width: number;
    height: number;
}