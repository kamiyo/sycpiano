import * as React from 'react';

export const TrebleIconSVG: React.FC<Record<string, unknown>> = () => (
    <svg style={{ display: 'none' }}>
        <symbol id="treble_icon_template">
            <path d="M342.816 440.064q-12.426 6.213-30.795 6.213-21.61 0-41.6-7.564-19.72-7.294-34.84-19.99-15.125-12.696-24.31-29.714-9.184-17.02-9.184-36.2 0-65.1 92.385-142.63-2.97-11.89-4.592-24.04-1.35-12.16-1.35-25.13 0-17.83 2.97-34.85 2.973-17.29 8.376-32.146 5.673-15.127 13.777-27.283 8.104-12.424 18.64-20.8 36.737 50.787 36.737 96.98 0 29.985-14.318 57.27-14.048 27.012-44.303 52.675l11.886 56.997q9.724-.81 10.804-.81 13.51 0 25.124 4.862 11.887 4.86 20.53 13.505 8.916 8.376 14.048 19.99 5.134 11.617 5.134 25.123 0 9.725-3.51 19.18-3.51 9.454-9.995 17.83-6.483 8.643-15.397 15.666-8.915 7.292-19.72 12.424 0-.54.81 2.97.81 3.783 1.89 9.726 1.35 5.94 2.973 13.238 1.62 7.296 2.7 14.05 1.35 6.753 2.16 11.886 1.08 5.403 1.08 7.294 0 12.695-5.4 23.23t-14.59 18.1q-9.18 7.566-21.34 11.618-12.152 4.32-25.66 4.32-10.264 0-19.18-3.242-8.913-3.242-15.666-9.185-6.752-5.944-10.804-14.588-3.78-8.374-3.78-18.64 0-7.293 2.43-13.776t6.75-11.076q4.32-4.59 10.537-7.293 6.214-2.7 13.507-2.7 6.484 0 12.157 2.97 5.675 2.974 9.727 7.566 4.053 4.86 6.484 10.804 2.43 6.215 2.43 12.43 0 14.045-10.536 22.96-10.264 8.913-25.932 10.534 12.43 6.215 25.666 6.215 10.804 0 21.07-4.05 10.264-3.782 17.83-10.535 7.832-6.484 12.424-15.4 4.86-8.643 4.86-18.638 0-3.78-.81-8.373zm-.81-354.954q-2.702-.54-4.863-.54-8.374 0-15.667 8.644-7.024 8.374-12.427 22.15-5.14 13.507-8.11 30.526-2.97 17.018-2.97 34.036 0 7.024.54 13.507t1.89 12.426q55.103-48.9 55.103-88.07 0-18.64-13.506-32.69zm5.672 343.878q13.237-9.725 19.99-21.34 7.024-11.616 7.024-25.123 0-8.374-2.972-16.208-2.7-8.104-8.104-14.317-5.132-6.213-12.426-9.994-7.294-3.782-15.938-3.782-.54 0-2.16.27-1.622 0-4.593.27zm-25.932-89.144q-8.374 1.08-15.668 4.323-7.294 2.97-12.696 7.563-5.133 4.593-8.374 10.535-2.972 5.943-2.972 12.967 0 20.8 22.15 34.577-18.368-2.98-29.443-14.32-11.076-11.08-11.076-28.1 0-9.996 4.052-19.18 4.32-9.455 11.34-16.75 7.02-7.563 16.48-12.966 9.45-5.403 19.99-7.564l-11.35-54.026q-38.09 28.633-57.81 56.186-19.45 27.556-19.45 54.57 0 14.857 6.483 28.094 6.752 13.234 17.83 22.96 11.343 9.994 25.93 15.67 14.857 5.67 31.335 5.67 9.454 0 17.56-1.89 8.103-1.62 15.126-5.404z" />
        </symbol>
    </svg>
);

export const TrebleIconInstance: React.FC<React.SVGAttributes<unknown>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
        <use xlinkHref="#treble_icon_template" />
    </svg>
);
