import { LinkShape } from 'src/components/App/NavBar/types';

export const links: ReadonlyArray<LinkShape> = [
    { name: 'home', path: '/' },
    {
        name: 'about', path: '/about', subLinks: [
            { name: 'biography', path: '/biography' },
            { name: 'discography', path: '/discography' },
            { name: 'press', path: '/press' },
        ],
    },
    { name: 'blog', path: '//www.seanchenpiano.com/pianonotes' },
    {
        name: 'schedule', path: '/schedule', subLinks: [
            { name: 'upcoming', path: '/upcoming' },
            { name: 'archive', path: '/archive' },
        ],
    },
    {
        name: 'media', path: '/media', subLinks: [
            { name: 'videos', path: '/videos' },
            { name: 'music', path: '/music' },
            { name: 'photos', path: '/photos' },
        ],
    },
    { name: 'contact', path: '/contact' },
    // UNCOMMENT WHEN FINISHING TESTING ON PROD
    // {
    //     name: 'shop', path: '/shop', subLinks: [
    //         { name: 'scores', path: '/scores' },
    //         { name: 'faqs', path: '/faqs' }
    //     ]
    // },
];
