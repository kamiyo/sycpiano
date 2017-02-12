export const acclaimsListReducer = (state = {
    isFetching: false,
    acclaims: [],
}, action) => {
    switch (action.type) {
        case 'PRESS--FETCH_ACCLAIMS_SUCCESS':
            return { isFetching: false, acclaims: action.acclaims };
        case 'PRESS--FETCHING_ACCLAIMS':
            return state.isFetching ? state : { ...state, isFetching: true };
        default:
            return state;
    };
};
