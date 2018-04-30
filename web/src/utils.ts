import blurbs from 'src/components/About/blurbs';

export interface FormattedLocationShape {
    venue: string;
    street: string;
    stateZipCountry: string;
}

export const formatLocation = (location: string): FormattedLocationShape => {
    // Example location string:
    // Howard L. Schrott Center for the Arts, 610 W 46th St, Indianapolis, IN 46208, USA
    const [venue, street, ...rest] = location.split(', ');
    const stateZipCountry = `${rest[1]}, ${rest[2]}`;

    return { venue, street, stateZipCountry };
};

export const getViewportSize = () => (
    {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    }
);

export const titleStringBase = 'Sean Chen: Pianist, Composer, Arranger';

export const metaDescriptions: {
    home: string;
    about: string;
    contact: string;
    upcoming: string;
    archive: string;
    videos: string;
    music: string;
    photos: string;
    press: string;
    getMusic: (piece: string, contributors?: string) => string;
    [index: string]: any;
} = {
        home: 'Welcome to the official website of pianist, composer, and arranger Sean Chen. Third Prize at the 2013 Van Cliburn, Christel DeHaan Classical Fellow of the 2013 American Pianists Awards, and Artist-in-Residence at University of Missouri, Kansas City.',
        about: `${blurbs[0]}...`,
        contact: `Contact information for Sean Chen and for booking performances.`,
        upcoming: 'Upcoming recitals, concerti, and masterclasses.',
        archive: 'Past recitals, concerti, and masterclasses.',
        videos: 'A playlist of Sean Chen\'s YouTube clips.',
        music: 'A playlist of Sean Chen\'s live concert recordings, and a link to his Spotify musician page.',
        getMusic: (piece: string, contributors?: string) =>
            `Listen to Sean Chen's live performance of ${piece}` + (contributors ? `, with ${contributors}` : '.'),
        photos: 'Publicity photos for browsing, and a link to a Dropbox folder for high-resolution images.',
        press: `Reviews of Sean Chen's performances.`,
    };
