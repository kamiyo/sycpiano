import { LinkShape } from 'src/components/App/NavBar/types';

export const links: ReadonlyArray<LinkShape> = [
    { name: 'home', path: '/' },
    { name: 'about', path: '/about' },
    { name: 'blog', path: '//www.seanchenpiano.com/pianonotes' },
    { name: 'schedule', path: '/schedule', subPaths: ['upcoming', 'archive'] },
    { name: 'media', path: '/media', subPaths: ['videos', 'music', 'photos'] },
    { name: 'press', path: '/press' },
    { name: 'contact', path: '/contact' },
    // { name: 'store', path: '/store' },
];
