import * as React from 'react';
import styled, { css } from 'react-emotion';

import { ContactInfo } from 'src/components/Contact/ContactInfo';
import { ContactSocialMedia } from 'src/components/Contact/ContactSocialMedia';
import { ContactItemShape } from 'src/components/Contact/types';

import {
    joelHarrisonContactPhotoUrl,
    resizedImage,
    seanChenContactPhotoUrl,
} from 'src/styles/imageUrls';
import { pushed } from 'src/styles/mixins';

const imageInsetShadowColor = '#222';
const alternateBackgroundColor = '#eee';

const contactNameToPhotoStylesMap: { [key: string]: (resizeOptions: { width?: number; height?: number }) => string } = {
    'Sean Chen': (resizeOptions: { width?: number; height?: number }) => css({
        background: `url(${resizedImage(seanChenContactPhotoUrl, resizeOptions)}) no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: '0 28%',
    }),
    'Joel Harrison': (resizeOptions: { width?: number; height?: number }) => css({
        background: `url(${resizedImage(joelHarrisonContactPhotoUrl, resizeOptions)}) no-repeat`,
        backgroundSize: '125%',
        backgroundPosition: 'center 40%',
    }),
};

const ContactImage = styled('div')`
    flex: 0 0 55%;
    box-shadow: inset 0 -15px 15px -15px ${imageInsetShadowColor};
`;

const StyledContactInfo = styled(ContactInfo)`
    flex: 1 0 31%;
`;

const StyledContactSocialMedia = styled(ContactSocialMedia) ` flex: 1 0 auto; `;

let ContactItem: React.SFC<ContactItemShape> = ({
    className,
    name,
    title,
    organization,
    phone,
    email,
    social,
}) => {
    return (
        <div className={className}>
            <ContactImage className={contactNameToPhotoStylesMap[name]({ width: 600 })} />

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
};

ContactItem = styled(ContactItem)`
    ${pushed};
    display: flex;
    flex-direction: column;
    background-color: white;
    flex: 0 1 600px;
    width: 100%;

    &:nth-child(2n) {
        background-color: ${alternateBackgroundColor};
    }
`;

export { ContactItem };
