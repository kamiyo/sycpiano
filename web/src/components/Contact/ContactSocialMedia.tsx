import * as React from 'react';
import styled, { css } from 'react-emotion';

import { ContactSocialMediaShape } from 'src/components/Contact/types';
import { staticImage } from 'src/styles/imageUrls';
import { screenXSorPortrait } from 'src/styles/screens';

const SocialMediaLinkContainer = styled('div')` padding-top: 20px; `;

const socialMediaButtonStyles = css`
    transition: all 0.2s;
    vertical-align: middle;
    margin: 0 20px;
    width: 3em;

    ${/*sc-selector*/ screenXSorPortrait} {
        width: 2em;
    }

    &:hover {
        transform: scale(1.2);
        cursor: pointer;
    }
`;

interface SocialMediaLinkProps {
    className?: string;
    social: string;
    url: string;
}

const SocialMediaLink: React.SFC<SocialMediaLinkProps> = (props) => (
    <a className={props.className} href={props.url} target="_blank">
        <img
            className={socialMediaButtonStyles}
            src={staticImage(`/soc-logos/${props.social}-color.svg`)}
        />
    </a>
);

const StyledSocialMediaLink = styled(SocialMediaLink)`
    flex: 1 0 auto;
    text-align: center;
    display: block;
`;

let ContactSocialMedia = (props: ContactSocialMediaShape) => (
    <div className={props.className}>
        {
            Object.keys(props.social).map((social, i) => (
                <SocialMediaLinkContainer key={i}>
                    <StyledSocialMediaLink url={props.social[social]} social={social}/>
                </SocialMediaLinkContainer>
            ))
        }
    </div>
);

ContactSocialMedia = styled(ContactSocialMedia)`
    padding: 0 10px;
    display: flex;
    justify-content: center;
`;

export { ContactSocialMedia };
