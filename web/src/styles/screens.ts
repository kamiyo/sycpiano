export const xs = '480px';
export const m = '1024px';
export const xl = '1600px';

type DimensionName = keyof MediaQueryBounds;

const dimensionNameMap: { [key in DimensionName]: string } = {
    minWidth: 'min-width',
    maxWidth: 'max-width',
    minHeight: 'min-height',
    maxHeight: 'max-height',
    orientation: 'orientation',
};

interface MediaQueryBounds {
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
    orientation?: string;
}

const mediaQuery = (mediaQueryBounds: MediaQueryBounds): string => {
    const widthQueries = Object
        .keys(mediaQueryBounds)
        .map((dimension: DimensionName) => (
            dimension
                ? `(${dimensionNameMap[dimension]} : ${mediaQueryBounds[dimension]})`
                : ''
        ));

    return widthQueries.reduce((accumulator, curr, idx) => (
        `${accumulator}${idx > 0 ? ` and ${curr}` : curr}`
    ), '@media only screen and ');
};

export const screenXS = mediaQuery({ maxWidth: xs });
export const screenM = mediaQuery({ maxWidth: m });
export const screenXL = mediaQuery({ minWidth: xl });
export const screenPortrait = mediaQuery({ orientation: 'portrait' });
