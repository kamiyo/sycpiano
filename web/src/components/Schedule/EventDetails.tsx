import startCase from 'lodash-es/startCase';
import { Moment } from 'moment-timezone';
import mix from 'polished/lib/color/mix';
import * as React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled, { css, cx } from 'react-emotion';
import { RouteComponentProps, withRouter } from 'react-router';

import { LinkIconInstance } from 'src/components/Schedule/LinkIconSVG';
import { LocationIconInstance } from 'src/components/Schedule/LocationIconSVG';
import { Collaborator, EventType, Piece } from 'src/components/Schedule/types';
import { getGoogleMapsSearchUrl } from 'src/components/Schedule/utils';

import { lightBlue, logoBlue, magenta, textGrey } from 'src/styles/colors';
import { lato2 } from 'src/styles/fonts';

import TweenLite from 'gsap/TweenLite';
import { screenXSorPortrait } from 'src/styles/screens';

const locationIconDimension = '30px';

interface EventDateTimeProps {
    dateTime: Moment;
    className?: string;
    isMobile?: boolean;
    rounded?: string;
}

let EventDate: React.SFC<EventDateTimeProps> = (props) => (
    <div className={props.className}>
        <div className={css({ fontSize: '2.2em' })}>
            {parseInt(props.dateTime.format('D'), 10)}
        </div>
        <div className={css({ fontSize: '1.4em' })}>
            {props.dateTime.format('ddd')}
        </div>
    </div>
);

EventDate = styled<EventDateTimeProps, {}>(EventDate)`
    text-align: center;
    background-color: ${lightBlue};
    color: white;
    height: 6.7em;
    width: 6.7em;
    line-height: 2.5em;
    padding: 0.8em;

    /* stylelint-disable */
    ${props => {
        switch (props.rounded) {
            case 'top':
                return 'border-radius: 50% 50% 0 0;';
            case 'bottom':
                return 'border-radius: 0 0 50% 50%;';
            default:
                return 'border-radius: 50%;';
        }
    }}
    /* stylelint-enable */
`;

interface EventNameProps { name: string; eventType: EventType; className?: string; isMobile?: boolean; permaLink: string; }

const linkIconStyle = css`
    margin: 0 0.5em;
    width: 1em;
    height: 1em;
    display: inline-block;
    vertical-align: top;
`;

const eventNameStyle = css`
    font-size: 2em;
    font-family: ${lato2};
    transition: fill 0.2s, color 0.2s;
    fill: transparent;
    color: ${logoBlue};

    &:hover {
        cursor: pointer;
        fill: #999;
    }

    ${/* sc-selector */ screenXSorPortrait} {
        fill: logoBlue;
    }
`;

class EventName extends React.Component<EventNameProps & RouteComponentProps<{}>> {
    copiedSpan: React.RefObject<HTMLSpanElement> = React.createRef();
    onCopy = () => {
        // this.props.history.push(this.props.permaLink);
        TweenLite.fromTo(this.copiedSpan.current, 0.2, { autoAlpha: 1 }, { autoAlpha: 0, delay: 0.5 });
    }

    render() {
        return (
            <CopyToClipboard onCopy={this.onCopy} text={`${window.location.host}${this.props.permaLink}`}>
                <div className={eventNameStyle}>
                    <span>{this.props.name}</span>
                    {this.props.eventType === 'masterclass' && <span>{`: Masterclass`}</span>}
                    <LinkIconInstance className={linkIconStyle} />
                    <span
                        className={css`
                            visibility: hidden;
                            font-size: 0.5em;
                        `}
                        ref={this.copiedSpan}
                    >
                        copied
                    </span>
                </div>
            </CopyToClipboard>
        );
    }
}

const EventNameWithRouter = withRouter(EventName);

let EventTime: React.SFC<EventDateTimeProps> = ({ className, dateTime }) => (
    <div className={className}>
        {dateTime.format('h:mm a z')}
    </div>
);

EventTime = styled(EventTime)` font-size: 1.5em; `;

interface EventLocationProps { location: string; className?: string; isMobile?: boolean; }

const getVenueName = (location: string): string => {
    if (!location) {
        return '';
    }

    // Example location string:
    // Howard L. Schrott Center for the Arts, 610 W 46th St, Indianapolis, IN 46208, USA
    const locArray = location.split(', ');
    return locArray.length >= 1 ? locArray[0] : '';
};

let EventLocation: React.SFC<EventLocationProps> = ({ location, className, isMobile }) => {
    const locationIconStyle = css({
        height: locationIconDimension,
        width: locationIconDimension,
    });

    return (
        <a href={getGoogleMapsSearchUrl(location)} className={cx(className)} target="_blank">
            <LocationIconInstance className={locationIconStyle} />

            <strong
                className={css`
                    margin-left: ${isMobile ? 0 : 10}px;
                `}
            >
                {getVenueName(location)}
            </strong>
        </a>
    );
};

EventLocation = styled<EventLocationProps, typeof EventLocation>(EventLocation)`
    font-size: 1.2em;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: fit-content;
    text-decoration: underline solid transparent;
    transition: text-decoration-color 0.2s;

    &:hover {
        color: ${logoBlue};
        text-decoration-color: ${logoBlue};
    }
`;

interface EventCollaboratorsProps {
    collaborators: Collaborator[];
    className?: string;
}

let EventCollaborators: React.SFC<EventCollaboratorsProps> = ({ className, collaborators }) => (
    <div className={className}>
        {collaborators.map((collaborator: Collaborator, i: number) => (
            collaborator.name && collaborator.instrument && (
                <div key={i}>
                    <span><strong>{collaborator.name}</strong></span>{' - '}
                    <span>{startCase(collaborator.instrument)}</span>
                </div>
            )
        ))}
    </div>
);

EventCollaborators = styled(EventCollaborators)`
    list-style: none;
    padding: 0;
    font-size: 1.2em;
    font-family: ${lato2};
`;

interface EventProgramProps {
    program: Piece[];
    className?: string;
}

let EventProgram: React.SFC<EventProgramProps> = ({ program, className }) => (
    <div className={className}>
        {program.map(({ composer, piece }: Piece, i: number) => (
            <div key={i}>
                {composer}{piece ? ' ' : ''}<i>{piece}</i>
            </div>
        ))}
    </div>
);

EventProgram = styled(EventProgram)`
    list-style: none;
    padding: 0;
    font-size: 1.2em;
    font-family: ${lato2};
`;

interface EventWebsiteButtonProps {
    website: string;
    className?: string;
}

let EventWebsiteButton: React.SFC<EventWebsiteButtonProps> = ({ website, className }) => (
    <a href={website} target="_blank" className={className}>
        {`Tickets & Info`}
    </a>
);

EventWebsiteButton = styled(EventWebsiteButton)`
    display: block;
    font-size: 1.2em;
    width: 150px;
    padding: 10px;
    text-align: center;
    border-radius: 4px;
    font-family: ${lato2};
    background-color: ${magenta};
    color: ${textGrey};
    transition: all 0.25s;

    &:hover {
        background-color: ${mix(0.75, magenta, '#FFF')};
        color: white;
        cursor: pointer;
    }
`;

export {
    EventCollaborators,
    EventDate,
    EventLocation,
    EventNameWithRouter,
    EventProgram,
    EventTime,
    EventWebsiteButton,
};
