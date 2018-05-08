export const navBarHeight = {
    desktop: 80,
    mobile: 60,
};

export const navBarMarginTop = 18;

// be sure to use vw for tablet and px for desktop
const desktopPlaylistWidth = 550;

export const playlistContainerWidth = {
    desktop: '550px',
    tablet: '45vw',
};
export const playlistTogglerWidth = 20;
export const playlistWidth = {
    desktop: `${desktopPlaylistWidth - playlistTogglerWidth}px`,
    tablet: `calc(${playlistContainerWidth.tablet} - ${playlistTogglerWidth}px)`,
};
export const playlistPadding = 10;
