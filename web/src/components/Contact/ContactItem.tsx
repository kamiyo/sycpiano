import * as React from 'react';
import styled, { css } from 'react-emotion';

import { ContactInfo } from 'src/components/Contact/ContactInfo';
import { ContactSocialMedia } from 'src/components/Contact/ContactSocialMedia';
import { ContactItemShape } from 'src/components/Contact/types';

import {
    joelHarrisonContactPhotoUrl,
    seanChenContactPhotoUrl,
} from 'src/styles/imageUrls';
import { pushed } from 'src/styles/mixins';

const imageInsetShadowColor = '#222';
const alternateBackgroundColor = '#eee';

const contactNameToPhotoStylesMap: { [key: string]: string } = {
    'Sean Chen': css({
        background: `url(${seanChenContactPhotoUrl}) no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: '0 28%',
    }),
    'Joel Harrison': css({
        background: `url(${joelHarrisonContactPhotoUrl}) no-repeat`,
        backgroundSize: '125%',
        backgroundPosition: 'center 40%',
    }),
};

const ContactImage = styled('div')`
    flex: 0 0 55%;
    box-shadow: inset 0 -15px 15px -15px ${imageInsetShadowColor};
`;

const StyledContactInfo = styled(ContactInfo)` flex: 0 0 31%; `;

const StyledContactSocialMedia = styled(ContactSocialMedia)` flex: 1 0 auto; `;

let ContactItem: React.SFC<ContactItemShape> = ({
    className,
    name,
    title,
    organization,
    phone,
    email,
    social,
}) => (
    <div className={className}>
        <ContactImage className={contactNameToPhotoStylesMap[name]} />

        <StyledContactInfo
            name={name}
            title={title}
            organization={organization}
            phone={phone}
            email={email}
        />

        <StyledContactSocialMedia social={social} />
    </div>
);

ContactItem = styled(ContactItem)`
    ${pushed};
    display: flex;
    flex-direction: column;
    background-color: white;
    flex: 0 1 600px;

    &:nth-child(2n) {
        background-color: ${alternateBackgroundColor};
    }
`;

export { ContactItem };
