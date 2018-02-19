export interface LinkShape {
    readonly name: string;
    readonly path: string;
    readonly subPaths?: string[];
}

export interface NavBarLinksProps {
    readonly className?: string;
    readonly currentBasePath: string;
    readonly links: LinkShape[];
    readonly showSub: string;
    readonly toggleSub: (show?: string) => void;
}
