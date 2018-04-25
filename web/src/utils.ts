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
