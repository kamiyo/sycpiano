import * as React from 'react';
import styled, { css } from 'react-emotion';

import AcclaimsList from 'src/components/Press/AcclaimsList';
import { container } from 'src/styles/mixins';

import { pushed } from 'src/styles/mixins';

let Press: React.SFC<{className?: string}> = (props) => (
    <div className={props.className}>
        <AcclaimsList className={css`${pushed};`}/>
    </div>
);

Press = styled(Press)`
    ${container}
    box-sizing: border-box;
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
`;

export default Press;
