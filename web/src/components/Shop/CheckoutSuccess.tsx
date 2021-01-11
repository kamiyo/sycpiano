import * as React from 'react';
import { parse } from 'qs';
import { RouteComponentProps } from 'react-router-dom';

type CheckoutSuccessProps = { isMobile?: boolean } & RouteComponentProps<unknown>

const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({ location }) => {
    const query = parse(location.search);
    return (
        <div>
            {query.session_id}
        </div>
    );
};

export { CheckoutSuccess }