import * as React from 'react';
import { css } from 'react-emotion';

import AcclaimsList from 'src/components/Press/AcclaimsList';
import { container } from 'src/styles/mixins';

const pressStyle = css`
    ${container}
    width: 100%;
    height: 100%;
`;

const Press: React.SFC<{}> = () => (
    <div className={pressStyle}>
        <AcclaimsList />
    </div>
);

export default Press;
