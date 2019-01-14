import PRESS_ACTIONS from 'src/components/About/Press/actionTypeKeys';
import { AcclaimItemShape } from 'src/components/About/Press/types';

export interface FetchAcclaimsRequest {
    readonly type: typeof PRESS_ACTIONS.FETCH_ACCLAIMS_REQUEST;
}

export interface FetchAcclaimsError {
    readonly type: typeof PRESS_ACTIONS.FETCH_ACCLAIMS_ERROR;
}

export interface FetchAcclaimsSuccess {
    readonly type: typeof PRESS_ACTIONS.FETCH_ACCLAIMS_SUCCESS;
    readonly items: AcclaimItemShape[];
}

export interface OtherAction {
    readonly type: typeof PRESS_ACTIONS.OTHER_ACTION;
}

type ActionType = FetchAcclaimsError | FetchAcclaimsRequest | FetchAcclaimsSuccess | OtherAction;

export default ActionType;
