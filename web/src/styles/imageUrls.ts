type imageFormat = 'jpg' | 'webp';

// Functions to return the correct image url, depending on jpg or webp.
export const sycWithPianoBW = (format: imageFormat = 'jpg') => `/syc_withpiano_bw.${format}`;
export const cliburn1 = (format: imageFormat = 'jpg') => `/gallery/cliburn1.${format}`;
export const seanChenContactPhotoUrl = (format: imageFormat = 'jpg') => `/gallery/syc_headshot1.${format}`;
export const joelHarrisonContactPhotoUrl = (format: imageFormat = 'jpg') => `/joel.${format}`;
export const marthaWoodsContactPhotoUrl = () => `/wentworth.svg`;
// export const marthaWoodsContactPhotoUrl = (format: imageFormat = 'jpg') => `/wentworth.${format}`;

export const bg1 = `/bg_1.jpg`;
export const homeBackground = (format: imageFormat = 'jpg') => `/syc_chair_bg_clean.${format}`;
export const sycChairVertical = (format: imageFormat = 'jpg') => `/syc_chair_vertical.${format}`;

export const staticImage = (url: string) => (
    `${IMAGES_PATH}${url}`
);

import { stringify } from 'qs';

// Generates url to call the resized api for specified image and dimensions.
export const resizedImage = (url: string, opt: { width?: number; height?: number }) => (
    `/resized${url}?${stringify(opt)}`
);

// Generates source set urls and widths for <picture> elements.
export const generateSrcsetWidths = (url: string, widths: number[]) => (
    widths.reduce((acc, curr) => {
        return `${resizedImage(url, { width: curr })} ${curr}w${(acc) ? ', ' : ''}${acc}`;
    }, '')
);

// Generates source set urls and heights for <picture> elements.
export const generateSrcsetHeights = (url: string, heights: number[]) => (
    heights.reduce((acc, curr) => {
        return `${resizedImage(url, { height: curr })} ${curr}h${(acc) ? ', ' : ''}${acc}`;
    }, '')
);
