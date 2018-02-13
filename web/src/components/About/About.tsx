import * as moment from 'moment-timezone';
import * as React from 'react';
import styled, { css } from 'react-emotion';

import blurbs from 'src/components/About/blurbs';
import { offWhite } from 'src/styles/colors';
import { lato1, lato2, lato3 } from 'src/styles/fonts';
import { sycWithPianoBW } from 'src/styles/imageUrls';
import { pushed } from 'src/styles/mixins';
import { screenXS } from 'src/styles/screens';

const FirstLetter = styled('span')`
    display: block;
    float: left;
    font-family: ${lato1};
    font-size: 68px;
    margin-left: -6px;
`;

const Paragraph = styled('p')`
    font-family: ${lato2};
    font-size: 19px;
    margin: 21px 0 21px 0;
    line-height: 2.2em;
`;

const AboutText: React.SFC<{ className?: string }> = (props) => (
    <div className={props.className}>
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
    </div>
);

interface ImageContainerProps { currScrollTop: number; }

const ImageContainer = styled<ImageContainerProps, 'div'>('div')`
    ${pushed};
    flex: 1;
    background: url(${sycWithPianoBW}) no-repeat fixed;
    background-size: 56%;
    background-position: 0 -100px;

    /* disabling as per: https://github.com/styled-components/stylelint-processor-styled-components/issues/130 */
    /* stylelint-disable */
    ${screenXS} {
        flex: 0 0 360px;
        background-size: 106%;
        background-position: 0 27px;
        opacity: ${props => `${1 - props.currScrollTop / 250}`};
    }
    /* stylelint-enable */
`;

const TextContainer = styled(AboutText)`
    ${pushed};
    box-sizing: border-box;
    flex: 0 0 45%;
    height: auto;
    padding: 20px 40px 20px 60px;
    background-color: ${offWhite};
    color: black;
    overflow-y: scroll;
    /* stylelint-disable */
    ${screenXS} {
        margin-top: 0;
        flex: 1;
        overflow-y: visible;
        padding: 20px 30px;
        text-align: justify;
    }
    /* stylelint-enable */
`;

const AboutContainer = styled('div')`
    height: 100%;
    background-color: white;
    position: absolute;
    display: flex;
    /* stylelint-disable */
    ${screenXS} {
        flex-direction: column;
        overflow-y: scroll;
    }
    /* stylelint-enable */
`;

class About extends React.Component {
    state = { currScrollTop: 0 };

    setScrollTop = (event: React.SyntheticEvent<HTMLElement>) => {
        this.setState({ currScrollTop: (event.target as HTMLElement).scrollTop });
    };

    render() {
        return (
            <AboutContainer onScroll={this.setScrollTop}>
                <ImageContainer currScrollTop={this.state.currScrollTop} />
                <TextContainer />
            </AboutContainer>
        );
    }
}

export default About;
