import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import debounce from 'lodash-es/debounce';

import NAV_ACTIONS from 'src/components/App/NavBar/actionTypeKeys';
import * as ActionTypes from 'src/components/App/NavBar/actionTypes';
import { GlobalStateShape } from 'src/types';

const debouncedToggle = debounce((dispatch, correctedShow) => dispatch({
    type: NAV_ACTIONS.NAV_TOGGLE_NAV,
    show: correctedShow,
} as ActionTypes.ToggleNav), 50, { leading: true });

export const toggleNavBar = (show?: boolean): ThunkAction<void, GlobalStateShape, void, ActionTypes.ToggleNav> =>
    (dispatch, getState) => {
        const correctedShow = (typeof show === 'boolean') ? show : !getState().navbar.isVisible;
        if (getState().navbar.isVisible !== correctedShow) {
            debouncedToggle(dispatch, correctedShow);
        }
    };

export const toggleExpanded = (show?: boolean): ThunkAction<void, GlobalStateShape, void, ActionTypes.ToggleExpanded> =>
    (dispatch, getState) => {
        const correctedShow = (typeof show === 'boolean') ? show : !getState().navbar.isExpanded;
        dispatch({
            type: NAV_ACTIONS.NAV_TOGGLE_EXPANDED,
            show: correctedShow,
        });
    };

export const toggleSubNav = (sub = '', isMobile?: boolean): ThunkAction<void, GlobalStateShape, void, ActionTypes.ToggleSubnav> =>
    (dispatch, getState) => {
        const type = NAV_ACTIONS.NAV_TOGGLE_SUBNAV;
        let showSubs = getState().navbar.showSubs;
        if (isMobile) {
            if (showSubs.includes(sub)) {
                showSubs = showSubs.filter((value) => sub !== value);
            } else {
                showSubs = [...showSubs, sub];
            }
        } else {
            if (sub === showSubs[0]) {
                showSubs = [];
            } else {
                showSubs = [sub];
            }
        }
        dispatch({
            type,
            showSubs,
        });
    };

const lastScroll = (scrollTop: number): ThunkAction<void, GlobalStateShape, void, ActionTypes.LastScroll> =>
    (dispatch) => {
        dispatch({
            type: NAV_ACTIONS.NAV_LAST_SCROLL,
            scrollTop,
        });
    };

const debouncedLastScroll = debounce((dispatch, scrollTop) => {
    dispatch(lastScroll(scrollTop));
}, 50, { leading: true });

const onScroll = (triggerHeight: number, dispatch: ThunkDispatch<GlobalStateShape, void, ActionTypes.ToggleNav>, getState: () => GlobalStateShape) => (event: React.UIEvent<HTMLElement> | UIEvent) => {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    if (typeof triggerHeight === 'number') {
        if (scrollTop > getState().navbar.lastScrollTop && scrollTop > triggerHeight) {
            dispatch(toggleNavBar(false));
        } else {
            dispatch(toggleNavBar(true));
        }
        debouncedLastScroll(dispatch, scrollTop);
    }
};

export const setOnScroll = (triggerHeight?: number): ThunkAction<void, GlobalStateShape, void, ActionTypes.SetOnScroll> =>
    (dispatch, getState) => {
        dispatch({
            type: NAV_ACTIONS.NAV_SET_ONSCROLL,
            onScroll: onScroll(triggerHeight, dispatch, getState),
        } as ActionTypes.SetOnScroll);
    };
