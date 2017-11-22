import * as React from 'react';

import { TweenLite } from 'gsap';
import { Transition, TransitionGroup } from 'react-transition-group';

import SubNavLink from 'js/components/SubNav/SubNavLink';

const slideFromRightWithStagger = (element: HTMLElement, index: number) => {
    const index1 = index + 1;
    const delay = index1 * 0.1;
    const duration = 0.20 + 0.2 * index1;
    TweenLite.fromTo(element,
        duration,
        { x: 150, opacity: 0 },
        { x: 0, opacity: 1, ease: 'Power3.easeOut', delay });
};

interface SubNavProps {
    basePath: string;
    links: string[];
    onClick: () => void;
}

const SubNav: React.SFC<SubNavProps> = ({ basePath, links, onClick }) => (
    <ul className='subNav'>
        <TransitionGroup>
            {links.map((link, i) => (
                <Transition
                    key={link}
                    appear={true}
                    mountOnEnter={true}
                    unmountOnExit={true}
                    // calculate from adding delay and duration from slide function
                    timeout={0.50 + 0.3 * i}
                    onEnter={(element) => slideFromRightWithStagger(element, i)}
                >
                    <SubNavLink basePath={basePath} link={link} onClick={onClick}/>
                </Transition>
            ))}
        </TransitionGroup>
    </ul>
);

export default SubNav;
