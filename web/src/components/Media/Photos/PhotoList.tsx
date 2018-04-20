import * as React from 'react';
import styled, { css } from 'react-emotion';
import { connect } from 'react-redux';

import { setOnScroll } from 'src/components/App/NavBar/actions';
import { GlobalStateShape } from 'src/types';

import DropboxButton from 'src/components/Media/Photos/DropboxButton';
import PhotoListItem from 'src/components/Media/Photos/PhotoListItem';
import { PhotoItem } from 'src/components/Media/Photos/types';
import { idFromItem } from 'src/components/Media/Photos/utils';
import Playlist from 'src/components/Media/Playlist';
import { screenXSorPortrait } from 'src/styles/screens';
import { navBarHeight } from 'src/styles/variables';

const photoListStyle = css`
    padding-left: 5px;
    background-color: black;
    top: 0;

    ${/* sc-selector */ screenXSorPortrait} {
        padding-left: 0;
    }
`;

const photoULStyle = css`
    padding-bottom: 80px;
    background-color: black;

    ${/* sc-selector */ screenXSorPortrait} {
        padding-top: ${navBarHeight.mobile}px;
        background-color: unset;
        padding-bottom: 60px;
    }
`;

const playlistExtraStyles = ({
    div: photoListStyle,
    ul: photoULStyle,
});

const StyledPhotoListContainer = styled('div') `
    width: fit-content;
    height: 100%;
    right: 0;
    top: 0;
    position: absolute;

    ${/* sc-selector */ screenXSorPortrait} {
        width: 100%;
        height: auto;
        right: unset;
        top: unset;
        position: unset;
    }
`;

interface PhotoListOwnProps {
    isMobile?: boolean;
    items: PhotoItem[];
    currentItem: PhotoItem;
    selectPhoto: (item: PhotoItem) => void;
}

interface PhotoListStateToProps {
    onScroll: (event: React.SyntheticEvent<HTMLElement>) => void;
}

interface PhotoListDispatchToProps {
    setOnScroll: typeof setOnScroll;
}

type PhotoListProps = PhotoListOwnProps & PhotoListStateToProps & PhotoListDispatchToProps;

class PhotoList extends React.Component<PhotoListProps> {
    componentDidMount() {
        this.props.setOnScroll(navBarHeight.mobile);
    }

    render() {
        const {
            isMobile,
            items,
            currentItem,
            selectPhoto,
            onScroll,
        } = this.props;
        return (
            <StyledPhotoListContainer>
                <Playlist
                    id="photos_ul"
                    extraStyles={playlistExtraStyles}
                    hasToggler={false}
                    isShow={true}
                    shouldAppear={false}
                    isMobile={isMobile}
                    onScroll={isMobile ? onScroll : null}
                >
                    {items.map((item) => (
                        <PhotoListItem
                            key={item.file}
                            item={item}
                            currentItemId={isMobile ? null : idFromItem(currentItem)}
                            onClick={isMobile ? null : selectPhoto}
                            isMobile={isMobile}
                        />
                    ))}
                </Playlist>
                <DropboxButton isMobile={isMobile} />
            </StyledPhotoListContainer>
        );
    }
}

const mapStateToProps = ({ navbar }: GlobalStateShape): PhotoListStateToProps => ({
    onScroll: navbar.onScroll,
});

export default connect<PhotoListStateToProps, PhotoListDispatchToProps, PhotoListOwnProps>(
    mapStateToProps,
    { setOnScroll },
)(PhotoList);
