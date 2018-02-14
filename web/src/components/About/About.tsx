import * as moment from 'moment-timezone';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import { FadeBackgroundImage, FadeBackgroundImageProps } from 'src/components/LazyImage';

import { easeQuadOut } from 'd3-ease';

import blurbs from 'src/components/About/blurbs';
import { offWhite } from 'src/styles/colors';
import { lato1, lato2, lato3 } from 'src/styles/fonts';
import { sycWithPianoBW } from 'src/styles/imageUrls';
import { pushed } from 'src/styles/mixins';
import { screenM, screenPortrait, screenXS } from 'src/styles/screens';

const pictureHeight = 250;

const FirstLetter = styled('span') `
    display: block;
    float: left;
    font-family: ${lato1};
    font-size: 68px;
    margin-left: -6px;
`;

const Paragraph = styled('p') `
    font-family: ${lato2};
    font-size: 19px;
    margin: 21px 0 21px 0;
    line-height: 2.2em;
`;

const SpaceFiller = styled('div') `
    display: none;

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        display: block;
        height: ${pictureHeight}px;
        width: 100%;
        background-color: transparent;
    }
`;

const TextGroup = styled('div') `
    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        background-color: white;
        padding: 20px 30px;
    }
`;

const AboutText: React.SFC<{ className?: string }> = (props) => (
    <div className={props.className}>
        <SpaceFiller />
        <TextGroup>
            {blurbs.map((blurb, i) => {
                if (i === 0) {
                    const firstLetter = blurb[0];
                    const age = moment().diff('1988-08-27', 'year');
                    blurb = blurb.replace(/##/, age.toString());
                    const withoutFirstLetter = blurb.slice(1);
                    const nameLocation = withoutFirstLetter.indexOf('Sean Chen');
                    const name = withoutFirstLetter.slice(nameLocation, nameLocation + 9);
                    const beforeName = withoutFirstLetter.slice(0, nameLocation);
                    const afterName = withoutFirstLetter.slice(nameLocation + 9);
                    return (
                        <Paragraph key={i}>
                            <FirstLetter>{firstLetter}</FirstLetter>
                            {beforeName}
                            <span className={css` font-family: ${lato3}; `}>
                                {name}
                            </span>
                            {afterName}
                        </Paragraph>
                    );
                }
                return <Paragraph key={i}>{blurb}</Paragraph>;
            })}
        </TextGroup>
    </div>
);

interface ImageContainerProps { currScrollTop: number; }

const ImageContainer = styled<ImageContainerProps & FadeBackgroundImageProps, typeof FadeBackgroundImage>(FadeBackgroundImage) `
    flex: 1;
    background-size: cover;
    background-position: center -100px;

    /* stylelint-disable-next-line */
    ${screenM} {
        background-size: cover;
        background-position: center 0;
    }

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        position: absolute;
        height: ${pictureHeight}px;
        width: 100%;
        background-size: 106%;
        background-position: center 15%;
        opacity: ${props => `${easeQuadOut(Math.max(1 - props.currScrollTop / pictureHeight, 0))}`};
    }
`;

const TextContainer = styled(AboutText) `
    box-sizing: border-box;
    flex: 0 0 45%;
    height: auto;
    padding: 20px 40px 20px 60px;
    background-color: ${offWhite};
    color: black;
    overflow-y: scroll;

    /* stylelint-disable-next-line */
    ${screenPortrait}, ${screenXS} {
        position: absolute;
        margin-top: 0;
        height: 100%;
        left: 0;
        overflow-y: scroll;
        text-align: justify;
        background-color: transparent;
        padding: 0;
    }
`;

const AboutContainer = styled('div') `
    ${pushed};
    width: 100%;
    background-color: white;
    position: absolute;
    display: flex;

    /* stylelint-disable-next-line */
    ${screenXS} {
        display: block;
    }
`;

class About extends React.Component {
    state = { currScrollTop: 0 };

    setScrollTop = (event: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ currScrollTop: (event.target as HTMLElement).scrollTop });
    };

    render() {
        return (
            <AboutContainer onScroll={this.setScrollTop}>
                <ImageContainer
                    currScrollTop={this.state.currScrollTop}
                    src={sycWithPianoBW}
                    duration={250}
                />
                <TextContainer />
            </AboutContainer>
        );
    }
}

export default About;
