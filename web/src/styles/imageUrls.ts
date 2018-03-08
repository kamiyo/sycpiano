export const sycWithPianoBW = `/gallery/syc_withpiano_bw.jpg`;
export const cliburn1 = `/gallery/cliburn1.jpg`;
export const seanChenContactPhotoUrl = `/gallery/syc_headshot1.jpg`;
export const joelHarrisonContactPhotoUrl = `/joel.jpg`;
export const bg1 = `/bg_1.jpg`;
export const homeBackground = `/syc_chair_bg_clean_1920.jpg`;

export const staticImage = (url: string) => (
    `${IMAGES_PATH}${url}`
);

import { stringify } from 'qs';

export const resizedImage = (url: string, opt: { width?: number; height?: number; }) => (
    `/resized${url}?${stringify(opt)}`
);
