import NAV_ACTIONS from 'src/components/App/NavBar/actionTypeKeys';

export interface ToggleSubnav {
    readonly type: typeof NAV_ACTIONS.NAV_TOGGLE_SUBNAV;
    readonly showSubs: string[];
}

export interface ToggleNav {
    readonly type: typeof NAV_ACTIONS.NAV_TOGGLE_NAV;
    readonly show: boolean;
}

export interface ToggleExpanded {
    readonly type: typeof NAV_ACTIONS.NAV_TOGGLE_EXPANDED;
    readonly show: boolean;
}

export interface LastScroll {
    readonly type: typeof NAV_ACTIONS.NAV_LAST_SCROLL;
    readonly scrollTop: number;
}

export interface OtherActions {
    readonly type: typeof NAV_ACTIONS.NAV_OTHER_ACTIONS;
}

export type ActionTypes = ToggleSubnav | ToggleNav | ToggleExpanded |
    LastScroll | OtherActions;
