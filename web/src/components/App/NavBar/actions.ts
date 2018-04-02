import { Dispatch } from 'react-redux';
import { ThunkAction } from 'redux-thunk';

import NAV_ACTIONS from 'src/components/App/NavBar/actionTypeKeys';
import * as ActionTypes from 'src/components/App/NavBar/actionTypes';
import { GlobalStateShape } from 'src/types';

export const toggleNavBar = (show?: boolean): ThunkAction<void, GlobalStateShape, void> =>
    (dispatch, getState) => {
        const correctedShow = (typeof show === 'boolean') ? show : !getState().navbar.isVisible;
        if (getState().navbar.isVisible !== correctedShow) {
            dispatch({
                type: NAV_ACTIONS.NAV_TOGGLE_NAV,
                show: correctedShow,
            } as ActionTypes.ToggleNav);
        }
    };

export const toggleExpanded = (show?: boolean): ThunkAction<void, GlobalStateShape, void> =>
    (dispatch, getState) => {
        const correctedShow = (typeof show === 'boolean') ? show : !getState().navbar.isExpanded;
        dispatch({
            type: NAV_ACTIONS.NAV_TOGGLE_EXPANDED,
            show: correctedShow,
        } as ActionTypes.ToggleExpanded);
    };

export const toggleSubNav = (sub = '', isMobile?: boolean): ThunkAction<void, GlobalStateShape, void> =>
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
        } as ActionTypes.ToggleSubnav);
    };

const lastScroll = (scrollTop: number): ThunkAction<void, GlobalStateShape, void> =>
    (dispatch) => {
        dispatch({
            type: NAV_ACTIONS.NAV_LAST_SCROLL,
            scrollTop,
        });
    };

const onScroll = (triggerHeight: number, dispatch: Dispatch<GlobalStateShape>, getState: () => GlobalStateShape) => (event: React.SyntheticEvent<HTMLElement>) => {
    const scrollTop = (event.target as HTMLElement).scrollTop;
    if (typeof triggerHeight === 'number') {
        if (scrollTop > getState().navbar.lastScrollTop && scrollTop > triggerHeight) {
            dispatch(toggleNavBar(false));
        } else {
            dispatch(toggleNavBar(true));
        }
        dispatch(lastScroll(scrollTop));
    }
};

export const setOnScroll = (triggerHeight?: number): ThunkAction<void, GlobalStateShape, void> =>
    (dispatch, getState) => {
        dispatch({
            type: NAV_ACTIONS.NAV_SET_ONSCROLL,
            onScroll: onScroll(triggerHeight, dispatch, getState),
        } as ActionTypes.SetOnScroll);
    };
