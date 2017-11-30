import * as React from 'react';

interface SVGProps {
    onMouseOver?: () => void;
    onMouseOut?: () => void;
}

export const PlaySVG = ({ onMouseOver, onMouseOut, ...props }: SVGProps & React.SVGAttributes<any>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        width='500'
        height='500'
        viewBox='0 0 132.29166 132.29166'
    >
        <path
            d='M105.252 66.145L75.922 83.08l-29.33 16.932V32.28l29.33 16.932z'
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        />
    </svg>
);

export const PauseSVG = ({ onMouseOver, onMouseOut, ...props }: SVGProps & React.SVGAttributes<any>) => (
    <svg
        {...props}
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 132.29166 132.29166'
        height='500'
        width='500'
    >
        <g
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        >
            <path fill='#FFF' fillOpacity='0' d='M23.813 23.813h84.667v84.667H23.813z' />
            <path d='M44.71 32.28H55.29v67.732H44.71zm32.29 0H87.58v67.732H77z' />
        </g>
    </svg>
);
