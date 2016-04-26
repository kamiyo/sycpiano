import React from 'react';
import ReactDOM from 'react-dom';

const PlaylistManagerHOC = (Component) => {
    class _PlaylistManagerHOC extends React.Component {
        shouldComponentUpdate(nextProps, nextState) {
            // Necessary to prevent infinite updates, since calling props.playlistRightOnChange
            // causes a state change on the parent, which propagates back down to this component.
            return nextProps.currentItemId !== this.props.currentItemId;
        }

        componentDidUpdate() {
            let el = ReactDOM.findDOMNode(this);
            let scrollbarWidth = el.offsetWidth - el.clientWidth;
            el.style.right = el.style.paddingRight = `${-scrollbarWidth}px`;
            this.props.playlistRightOnChange(-scrollbarWidth);
        }

        render() {
            return <Component {...this.props} {...this.state} />
        }
    }

    _PlaylistManagerHOC.propTypes = {
        currentItemId: React.PropTypes.string.isRequired,
        items: React.PropTypes.object.isRequired,
        playlistRightOnChange: React.PropTypes.func.isRequired,
        playlistItemOnClick: React.PropTypes.func.isRequired
    };

    return _PlaylistManagerHOC;
}

export default PlaylistManagerHOC;