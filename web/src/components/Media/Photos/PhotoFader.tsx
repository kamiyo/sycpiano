import * as React from 'react';
import { css } from 'react-emotion';
import { Transition } from 'react-transition-group';

import TweenLite from 'gsap/TweenLite';

import { LazyImage } from 'src/components/LazyImage';
import { PhotoItem } from 'src/components/Media/Photos/types';
import { idFromItem, resizedPathFromItem, staticPathFromItem } from 'src/components/Media/Photos/utils';
import { generateSrcsetWidths } from 'src/styles/imageUrls';
import { screenWidths } from 'src/styles/screens';

const fadeOnEnter = (element: HTMLElement) => {
    TweenLite.to(element, 0.25, { autoAlpha: 1 });
};

const fadeOnExit = (element: HTMLElement) => {
    TweenLite.to(element, 0.25, { autoAlpha: 0 });
};

interface PhotoFaderProps {
    readonly item: PhotoItem;
    readonly isCurrent: boolean;
}

const PhotoFader: React.SFC<PhotoFaderProps> = ({ item, isCurrent }) => {
    const urlWebP = resizedPathFromItem(item, { gallery: true, webp: true });
    const urlJpg = resizedPathFromItem(item, { gallery: true });
    return (
        <Transition
            mountOnEnter={true}
            unmountOnExit={true}
            in={isCurrent}
            onEntering={fadeOnEnter}
            onExiting={fadeOnExit}
            appear={true}
            timeout={250}
        >
            <LazyImage
                id={`${idFromItem(item)}_view`}
                alt="Sean Chen Pianist Photo Viewer"
                classNames={{
                    desktop: css` visibility: hidden; `,
                }}
                desktopAttributes={{
                    webp: {
                        srcset: generateSrcsetWidths(urlWebP, screenWidths),
                        sizes: '100vh',
                    },
                    jpg: {
                        srcset: generateSrcsetWidths(urlJpg, screenWidths),
                        sizes: '100vh',
                    },
                    src: staticPathFromItem(item),
                }}
                successCb={(el: HTMLImageElement) => {
                    TweenLite.to(el, 0.2, { autoAlpha: 1 });
                }}
            />
        </Transition>
    );
};

export default PhotoFader;
