const xs = '480px';
const xl = '1600px';

type DimensionName = keyof MediaQueryBounds;

const dimensionNameMap: { [key in DimensionName]: string } = {
    minWidth: 'min-width',
    maxWidth: 'max-width',
};

interface MediaQueryBounds {
    minWidth?: string;
    maxWidth?: string;
}

const mediaQuery = (mediaQueryBounds: MediaQueryBounds): string => {
    const widthQueries = Object
        .keys(mediaQueryBounds)
        .map((dimension: DimensionName) => (
            dimension
                ? `(${dimensionNameMap[dimension]}: ${mediaQueryBounds[dimension]})`
                : ''
        ));

    return widthQueries.reduce((accumulator, curr, idx) => (
        `${accumulator}${idx > 0 ? ` and ${curr}` : curr}`
    ), '@media ');
};

export const screenXS = mediaQuery({ maxWidth: xs });
export const screenXL = mediaQuery({ minWidth: xl });
