import { rgba } from 'polished';
import { stringify } from 'qs';
import * as React from 'react';
import styled from 'react-emotion';
import { RouteComponentProps, withRouter } from 'react-router';

import { SearchIconInstance, SearchIconSVG } from 'src/components/Schedule/SearchIconSVG';

import { lightBlue } from 'src/styles/colors';
import { lato1 } from 'src/styles/fonts';
import { noHighlight } from 'src/styles/mixins';
import { screenXSandPortrait } from 'src/styles/screens';

const focusedBlue = rgba(lightBlue, 0.6);
const unfocusedGray = rgba(180, 180, 180, 0.4);

type SearchProps = {
    className?: string;
    isMobile?: boolean;
    search: string;
    setSearch: (search: string) => void;
} & RouteComponentProps<{}>;

const Container = styled<{ focused: boolean }, 'div'>('div')`
    width: 90%;
    max-width: 30rem;
    height: 50px;
    z-index: 2;
    right: 0;
    position: fixed;
    padding: 0 1rem;
    display: flex;
    margin: 1rem 1.4rem;
    font-family: ${lato1};
    border: 1px solid ${props => props.focused ? focusedBlue : unfocusedGray};
    border-radius: 30px;
    align-items: center;
    background-color: white;
    box-shadow: 0 1px 5px -2px rgba(0, 0, 0, 0.4);

    svg {
        fill: ${props => props.focused ? focusedBlue : 'rgba(180, 180, 180, 0.4)'};
    }
`;

const Label = styled<{ focused: boolean }, 'label'>('label')`
    font-size: 1.5rem;
    color: ${props => props.focused ? lightBlue : unfocusedGray};

    ${/* sc-selector */screenXSandPortrait} {
        font-size: 1.2rem;
    }
`;

const Span = styled<{ focused: boolean }, 'span'>('span')`
    flex: 1 0 auto;
    margin: 0.6rem 0 0.6rem 0.6rem;
    border-bottom: 1px solid ${props => props.focused ? focusedBlue : unfocusedGray};
    display: flex;
    position: relative;
`;

const Input = styled('input')`
    flex: 1 0 auto;
    border: none;
    font-family: ${lato1};
    font-size: 1.3rem;
`;

const ResetButton = styled<{ focused: boolean }, 'div'>('div')`
    ${noHighlight}
    flex: 0 0 auto;
    text-align: center;
    height: 1.6rem;
    font-size: 1.5rem;

    &:hover {
        cursor: pointer;
    }
`;

class Search extends React.Component<SearchProps, { focused: boolean; }> {
    constructor(props: SearchProps) {
        super(props);
        this.state = {
            focused: false,
        };
    }

    onInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.props.setSearch(event.currentTarget.value);
    }

    onReset = (event: React.SyntheticEvent<HTMLDivElement>) => {
        this.props.setSearch('');
        event.preventDefault();
    }

    onSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            this.props.history.push(`/schedule/search${stringify({ q: this.props.search}, { addQueryPrefix: true })}`);
            event.preventDefault();
        }
    }

    onFocus = () => {
        this.setState({
            focused: true,
        });
    }

    onBlur = () => {
        this.setState({
            focused: false,
        });
    }

    render() {
        return (
            <form>
                <Container focused={this.state.focused}>
                    <SearchIconSVG />
                    <Label focused={this.state.focused} htmlFor="search">Search</Label>
                    <Span focused={this.state.focused}>
                        <Input
                            id="search"
                            type="text"
                            placeholder={`try 'Mozart'`}
                            value={this.props.search}
                            onChange={this.onInputChange}
                            onFocus={this.onFocus}
                            onBlur={this.onBlur}
                            onKeyPress={this.onSubmit}
                        />
                        {this.props.search !== '' && <ResetButton focused={this.state.focused} onClick={this.onReset} >{'\u00D7'}</ResetButton>}
                    </Span>
                    <a href={`/schedule/search${stringify({ q: this.props.search}, { addQueryPrefix: true })}`}>
                        <SearchIconInstance />
                    </a>
                </Container>
            </form>
        );
    }
}

export const SearchWithHistory = withRouter(Search);
