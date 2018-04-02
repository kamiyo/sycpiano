export interface LinkShape {
    readonly name: string;
    readonly path: string;
    readonly subPaths?: string[];
}

export interface NavBarLinksProps {
    readonly className?: string;
    readonly currentBasePath: string;
    readonly links: ReadonlyArray<LinkShape>;
    readonly isMobile: boolean;
}

export interface NavBarStateShape {
    readonly isVisible: boolean;
    readonly isExpanded: boolean;
    readonly showSubs: string[];
    readonly lastScrollTop: number;
    readonly onScroll?: (event: React.SyntheticEvent<HTMLElement>) => void;
}
