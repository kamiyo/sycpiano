import React from 'react';
import styled, { css } from 'react-emotion';

import { ContactSocialMediaShape } from 'src/components/Contact/types';

const SocialMediaLinkContainer = styled('div')`padding-top: 20px;`;

const socialMediaButtonStyles = css`
    transform: scale(1.5);
    transition: all 0.2s;
    vertical-align: middle;

    &:hover {
        transform: scale(1.7);
        cursor: pointer;
    }
`;

interface SocialMediaLinkProps {
    className?: string;
    site: string;
}

const SocialMediaLink: React.SFC<SocialMediaLinkProps> = (props) => (
    <a className={props.className} href={props.site} target="_blank">
        <img
            className={socialMediaButtonStyles}
            src={`/images/soc-logos/${props.site}-color.svg`}
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
            Object.keys(props.social).map((site, i) => (
                <SocialMediaLinkContainer key={i}>
                    <StyledSocialMediaLink site={site} />
                </SocialMediaLinkContainer>
            ))
        }
    </div>
);

ContactSocialMedia = styled(ContactSocialMedia)`
    padding: 0 25% 10px;
    display: flex;
    justify-content: space-between;
`;

export { ContactSocialMedia };
