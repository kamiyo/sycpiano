import PRESS_ACTIONS from 'js/components/Press/actionTypeKeys';
import { AcclaimItemShape } from 'js/components/Press/types';

export interface FetchAcclaimsRequest {
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_REQUEST;
}

export interface FetchAcclaimsError {
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_ERROR;
}

export interface FetchAcclaimsSuccess {
    type: PRESS_ACTIONS.FETCH_ACCLAIMS_SUCCESS;
    items: AcclaimItemShape[];
}

export interface OtherAction {
    type: PRESS_ACTIONS.OTHER_ACTION;
}

type ActionType = FetchAcclaimsError | FetchAcclaimsRequest | FetchAcclaimsSuccess | OtherAction;

export default ActionType;
