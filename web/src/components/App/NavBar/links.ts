import { LinkShape } from 'src/components/App/NavBar/types';

export const links: ReadonlyArray<LinkShape> = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'schedule', path: '/schedule', subPaths: ['upcoming', 'archive'] },
    { name: 'media', path: '/media', subPaths: ['videos', 'music', 'photos'] },
    { name: 'press', path: '/press' },
    { name: 'contact', path: '/contact' },
];
