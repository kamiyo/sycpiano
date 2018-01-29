import * as React from 'react';
import styled from 'react-emotion';

import { lato2, lato2i } from 'src/styles/fonts';
import { homeBackground } from 'src/styles/imageUrls';
import { container /*, pushed*/ } from 'src/styles/mixins';

const textShadowColor = 'rgba(0, 0, 0, 0.3)';

const HomeContainer = styled('div')`
    ${container}
    height: 100%;
    width: 100%;
    background: url(${homeBackground}) no-repeat;
    background-size: 100%;
    background-position: 0px -200px;
    position: absolute;
`;

const Content = styled('div')`
    position: absolute;
    width: 100%;
    text-align: center;
    top: 35%;
    color: white;
    text-shadow: 2px 0px 4px ${textShadowColor};
    z-index: 100;
`;

const Name = styled('div')`
    font-family: ${lato2};
    font-size: 100px;
    text-transform: uppercase;
`;

const Skills = styled('div')`
    font-family: ${lato2};
    font-size: 30px;
    color: #EFE6B0;
    text-shadow: 2px 2px 6px ${textShadowColor};
`;

const Handle = styled('div')`
    margin-top: 15px;
    font-family: ${lato2i};
    font-size: 30px;
    color: white;
    text-shadow: 2px 2px 4px ${textShadowColor};
`;

const BackgroundCover = styled('div')`
    background-color: black;
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.2;
`;

/*
from original CSS file, feel free to convert to css object instead of using styled

const Quote = styled('div')`
    font-family: ${lato2i};
    font-size: 40px;
    position: absolute;
    color: white;
    bottom: 50px;
    right: 50px;
    text-shadow: 2px 2px 4px ${textShadowColor};
    opacity: 0;
`;

const doubleQuote = css`
    font-size: 95px;
    position: absolute;
`;

const OpenQuote = styled('div')`
    ${doubleQuote}
    top: -13px;
    left: -35px;
`;

const CloseQuote = styled('div')`
    ${doubleQuote}
    bottom: -10px;
    right: 86px;
`;

const QuoteAuthor = styled('div')`
    float: right;
`;

const NextEvent = styled('div')`
    position: absolute;
    ${pushed}
    margin-top: 50px;
    left: 0;
    color: black;
    font-family:${lato2i};
    background-color: rgba(248, 248, 248, .8);
    padding: 10px;
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
`;

const EventLabel = styled('div')`
    font-size: 35px;
`;

const EventDate = styled('div')`
    font-size: 25px;
    span {
        display: inline-block;
    }
`;

const Separator = styled('div')`
    margin: 0 12px;
`;

const EventName = styled('div')`
    font-size: 40px;
    font-family: ${lato2}
`;

const EventLocation = styled('div')`
    font-size: 17px;
`;
*/

const Home: React.SFC<{}> = () => {
    return (
        <HomeContainer>
            <BackgroundCover />
            <Content>
                <Name>Sean Chen</Name>
                <Skills>pianist / composer / arranger</Skills>
                <Handle>@seanchenpiano</Handle>
            </Content>
        </HomeContainer>
    );
};

export default Home;
