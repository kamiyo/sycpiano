import * as React from 'react';

import { css, SerializedStyles } from '@emotion/core';
import styled from '@emotion/styled';

import TweenLite from 'gsap/TweenLite';

import { ContactInfo } from 'src/components/Contact/ContactInfo';
import { ContactSocialMedia } from 'src/components/Contact/ContactSocialMedia';
import { ContactItemShape } from 'src/components/Contact/types';
import { LazyImage } from 'src/components/LazyImage';

import {
    generateSrcsetWidths,
    marthaWoodsContactPhotoUrl,
    resizedImage,
    seanChenContactPhotoUrl,
    staticImage,
} from 'src/styles/imageUrls';
import { pushed } from 'src/styles/mixins';
import { screenWidths, screenXSorPortrait } from 'src/styles/screens';

const imageInsetShadowColor = '#222';
const alternateBackgroundColor = '#eee';

const photosAttributesMap = new Map<string, { jpg?: string; webp?: string; svg?: string; css: SerializedStyles; imgCss?: SerializedStyles}>([
    ['Sean Chen', {
        jpg: seanChenContactPhotoUrl(),
        webp: seanChenContactPhotoUrl('webp'),
        css: css({
            backgroundSize: 'cover',
            backgroundPosition: '0 28%',
        }),
    }],
    // ['Joel Harrison', {
    //     jpg: joelHarrisonContactPhotoUrl(),
    //     webp: joelHarrisonContactPhotoUrl('webp'),
    //     css: css({
    //         backgroundSize: '125%',
    //         backgroundPosition: 'center 40%',
    //     }),
    // }],
    // ['Martha Woods', {
    //     jpg: marthaWoodsContactPhotoUrl(),
    //     webp: marthaWoodsContactPhotoUrl('webp'),
    //     css: css({
    //         backgroundSize: 'unset',
    //         backgroundPosition: '0 0',
    //     }),
    // }],
    ['Martha Woods', {
        svg: marthaWoodsContactPhotoUrl(),
        css: css({
            backgroundSize: 'unset',
            backgroundPosition: '0 0',
            backgroundColor: 'white',
            visibility: 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }),
        imgCss: css({
            width: '90%',
        }),
    }],
]);

interface ImageContainerProps { bgImage?: string; contact: string; }

const ImageContainer = styled.div<ImageContainerProps>`
    background-image: ${props => props.bgImage ? `url(${props.bgImage})` : 'unset'};
    background-attachment: initial;
    background-repeat: no-repeat;
    background-color: black;
    visibility: hidden;
    flex: 0 0 55%;
    box-shadow: inset 0 -15px 15px -15px ${imageInsetShadowColor};
    ${props => photosAttributesMap.get(props.contact).css}

    ${screenXSorPortrait} {
        height: 75vw;
    }
`;

const StyledContactInfo = styled(ContactInfo)` flex: 1 0 31%; `;

const StyledContactSocialMedia = styled(ContactSocialMedia)` flex: 1 0 auto; `;

const imageLoaderStyle = css`
    visibility: hidden;
    position: absolute;
`;

const StyledContactItem = styled.div`
    ${pushed}
    display: flex;
    flex-direction: column;
    background-color: white;
    flex: 0 1 600px;
    width: 100%;

    &:nth-of-type(2n) {
        background-color: ${alternateBackgroundColor};
    }

    ${screenXSorPortrait} {
        height: fit-content;
        padding-bottom: 3em;

        &:not(:first-of-type) {
            margin-top: 0;
        }
    }
`;

interface ContactItemState {
    bgImage: string;
}

class ContactItem extends React.Component<ContactItemShape, ContactItemState> {
    state: ContactItemState = { bgImage: '' };
    private bgRef: React.RefObject<HTMLDivElement> = React.createRef();

    onImageLoad = (el: HTMLImageElement) => {
        this.setState({ bgImage: el.currentSrc }, () => {
            TweenLite.to(
                this.bgRef.current,
                0.3,
                { autoAlpha: 1, delay: 0.2, clearProps: 'opacity' });
        });
    }

    onImageDestroy = () => {
        TweenLite.to(
            this.bgRef.current,
            0.1,
            { autoAlpha: 0 },
        );
    }

    render() {
        const {
            name,
            position,
            phone,
            email,
            social,
            isMobile,
            website,
        }: Partial<ContactItemShape> = this.props;

        const attributes = photosAttributesMap.get(name);
        const {
            webp,
            jpg,
        } = attributes;
        const webpSrcSet = generateSrcsetWidths(webp, screenWidths);
        const jpgSrcSet = generateSrcsetWidths(jpg, screenWidths);

        return (
            <StyledContactItem>

                <ImageContainer
                    bgImage={this.state.bgImage}
                    ref={this.bgRef}
                    contact={name}
                >
                    {(!attributes.svg) ? (
                        <LazyImage
                            isMobile={isMobile}
                            id={`contact_lazy_image_${name.replace(/ /g, '_')}`}
                            csss={{
                                mobile: imageLoaderStyle,
                                desktop: imageLoaderStyle,
                            }}
                            mobileAttributes={{
                                webp: {
                                    srcset: webpSrcSet,
                                    sizes: '100vw',
                                },
                                jpg: {
                                    srcset: jpgSrcSet,
                                    sizes: '100vw',
                                },
                                src: resizedImage(jpg, { width: 640 }),
                            }}
                            desktopAttributes={{
                                webp: {
                                    srcset: webpSrcSet,
                                    sizes: '100vh',
                                },
                                jpg: {
                                    srcset: jpgSrcSet,
                                    sizes: '100vh',
                                },
                                src: resizedImage(jpg, { height: 1080 }),
                            }}
                            alt={`${name}`}
                            successCb={this.onImageLoad}
                            destroyCb={this.onImageDestroy}
                        />
                    ) : (
                            <img
                                src={staticImage(`/logos${attributes.svg}`)}
                                css={attributes.imgCss}
                            />
                        )}
                </ImageContainer>

                <StyledContactInfo
                    name={name}
                    position={position}
                    phone={phone}
                    email={email}
                    website={website}
                />

                <StyledContactSocialMedia social={social} />
            </StyledContactItem>
        );
    }
}

export default ContactItem;
