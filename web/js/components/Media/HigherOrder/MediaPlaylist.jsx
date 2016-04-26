import React from 'react';
import ReactDOM from 'react-dom';
import MediaPlaylistItem from '@/js/components/Media/Base/MediaPlaylistItem.jsx';

export default class MediaPlaylistItem extends React.Component {
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
        let PlaylistItem = this.props.playlistItem;
        let playlistItems = Object.keys(this.props.items).map((id) => {
            let item = this.props.items[id];
            return (
                <PlaylistItem key={id}
                    isActive={this.props.currentItemId === id}
                    item={item}
                    onClick={this.props.itemOnClick}/>
                );
        });

        return (
            <div className="mediaPlaylist">
                <ul>{playlistItems}</ul>
            </div>
            );
    }    
}

MediaPlaylistItem.propTypes = {
    currentItemId: React.PropTypes.string.isRequired,
    items: React.PropTypes.object.isRequired,
    playlistItem: React.PropTypes.func,
    itemOnClick: React.PropTypes.func
};

MediaPlaylistItem.defaultProps = {
    playlistItem: MediaPlaylistItem,
    itemOnClick: () => {}
};