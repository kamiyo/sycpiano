export const sycWithPianoBW = `/syc_withpiano_bw.jpg`;
export const sycWithPianoBWWebP = `/syc_withpiano_bw.webp`;
export const cliburn1 = `/gallery/cliburn1.jpg`;
export const seanChenContactPhotoUrl = `/gallery/syc_headshot1.jpg`;
export const joelHarrisonContactPhotoUrl = `/joel.jpg`;
export const bg1 = `/bg_1.jpg`;
export const homeBackground = `/syc_chair_bg_clean.jpg`;
export const homeBackgroundWebP = `/syc_chair_bg_clean.webp`;
export const sycChairVertical = `/syc_chair_vertical.jpg`;
export const sycChairVerticalWebP = `/syc_chair_vertical.webp`;

export const staticImage = (url: string) => (
    `${IMAGES_PATH}${url}`
);

import { stringify } from 'qs';

export const resizedImage = (url: string, opt: { width?: number; height?: number }) => (
    `/resized${url}?${stringify(opt)}`
);

export const generateSrcsetWidths = (url: string, widths: number[]) => (
    widths.reduce((acc, curr) => {
        return `${resizedImage(url, { width: curr })} ${curr}w${(acc) ? ', ' : ''}${acc}`;
    }, '')
);

export const generateSrcsetHeights = (url: string, heights: number[]) => (
    heights.reduce((acc, curr) => {
        return `${resizedImage(url, { height: curr })} ${curr}h${(acc) ? ', ' : ''}${acc}`;
    }, '')
);
