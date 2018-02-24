export interface LinkShape {
    readonly name: string;
    readonly path: string;
    readonly subPaths?: string[];
}

export interface NavBarLinksProps {
    readonly className?: string;
    readonly currentBasePath: string;
    readonly links: ReadonlyArray<LinkShape>;
    readonly showSub: string;
    readonly toggleSub: (show?: string) => void;
    readonly isMobile: boolean;
    readonly closeMobileMenu?: (toExpand?: boolean) => void;
}
