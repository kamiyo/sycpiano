import NAV_ACTIONS from 'src/components/App/NavBar/actionTypeKeys';
import { ActionTypes } from 'src/components/App/NavBar/actionTypes';
import { NavBarStateShape } from 'src/components/App/NavBar/types';

export const navBarReducer = (state: NavBarStateShape = {
    isVisible: true,
    isExpanded: false,
    showSubs: [],
    lastScrollTop: 0,
}, action: ActionTypes) => {
    switch (action.type) {
        case NAV_ACTIONS.NAV_TOGGLE_NAV:
            return {
                ...state,
                isVisible: action.show,
            };
        case NAV_ACTIONS.NAV_TOGGLE_SUBNAV:
            return {
                ...state,
                showSubs: action.showSubs,
            };
        case NAV_ACTIONS.NAV_TOGGLE_EXPANDED:
            return {
                ...state,
                isExpanded: action.show,
            };
        case NAV_ACTIONS.NAV_LAST_SCROLL:
            return {
                ...state,
                lastScrollTop: action.scrollTop,
            };
        default:
            return state;
    }
};
